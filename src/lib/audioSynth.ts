"use client";

export type VisemeHint = "rest" | "aa" | "ee" | "oh";

export interface SpeechFrameState {
  energy: number;
  viseme: VisemeHint;
  speaking: boolean;
}

type FrameListener = (state: SpeechFrameState) => void;

class PortfolioAudioEngine {
  private ctx: AudioContext | null = null;
  private activeStoppers: Array<() => void> = [];
  private listeners = new Set<FrameListener>();
  private rafId: number | null = null;
  private streamAnalyser: AnalyserNode | null = null;
  private nextStartTime = 0;
  private activeSourceCount = 0;
  private playbackGen = 0;
  private queueChain: Promise<void> = Promise.resolve();

  private ensureContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock() {
    this.ensureContext();
  }

  public subscribe(listener: FrameListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(state: SpeechFrameState) {
    for (const l of this.listeners) {
      l(state);
    }
  }

  public stopAll() {
    this.playbackGen += 1;
    this.queueChain = Promise.resolve();
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    while (this.activeStoppers.length > 0) {
      const stop = this.activeStoppers.pop();
      try {
        stop?.();
      } catch {
        // ignore cleanup errors
      }
    }
    if (this.streamAnalyser) {
      try {
        this.streamAnalyser.disconnect();
      } catch {
        // ignore
      }
      this.streamAnalyser = null;
    }
    this.nextStartTime = 0;
    this.activeSourceCount = 0;
    this.emit({ energy: 0, viseme: "rest", speaking: false });
  }

  private scheduleBufferOnAnalyser(
    ctx: AudioContext,
    audioBuffer: AudioBuffer,
    pauseBeforeSec = 0
  ): void {
    if (!this.streamAnalyser) {
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.65;
      analyser.connect(ctx.destination);
      this.streamAnalyser = analyser;
    }

    const analyser = this.streamAnalyser;
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);

    const earliest = ctx.currentTime + 0.02;
    const targetStart =
      this.nextStartTime > earliest
        ? this.nextStartTime + pauseBeforeSec
        : earliest;
    this.nextStartTime = targetStart + audioBuffer.duration;
    this.activeSourceCount += 1;

    let stopped = false;
    this.activeStoppers.push(() => {
      stopped = true;
      try {
        source.stop();
      } catch {
        // already stopped
      }
      source.disconnect();
    });

    if (this.rafId === null) {
      const timeData = new Uint8Array(analyser.fftSize);
      const freqData = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (
          (this.activeSourceCount <= 0 &&
            ctx.currentTime >= this.nextStartTime) ||
          !this.streamAnalyser
        ) {
          this.rafId = null;
          this.emit({ energy: 0, viseme: "rest", speaking: false });
          return;
        }
        this.streamAnalyser.getByteTimeDomainData(timeData);
        this.streamAnalyser.getByteFrequencyData(freqData);

        let sumSq = 0;
        for (let i = 0; i < timeData.length; i++) {
          const centered = (timeData[i] - 128) / 128;
          sumSq += centered * centered;
        }
        const rms = Math.sqrt(sumSq / timeData.length);
        const energy = Math.min(1, rms * 4.2);

        let lowBand = 0;
        let highBand = 0;
        for (let i = 2; i < 10; i++) lowBand += freqData[i];
        for (let i = 10; i < 28; i++) highBand += freqData[i];

        let viseme: VisemeHint = "rest";
        if (energy > 0.06) {
          const ratio = highBand / Math.max(1, lowBand);
          if (ratio > 0.85) viseme = "ee";
          else if (ratio < 0.42) viseme = "oh";
          else viseme = "aa";
        }

        this.emit({ energy, viseme, speaking: energy > 0.03 });
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    source.onended = () => {
      if (!stopped) {
        this.activeSourceCount = Math.max(0, this.activeSourceCount - 1);
        if (
          this.activeSourceCount === 0 &&
          ctx.currentTime >= this.nextStartTime - 0.02
        ) {
          if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
          }
          this.emit({ energy: 0, viseme: "rest", speaking: false });
        }
      }
    };
    source.start(targetStart);
  }

  public enqueueWavBase64(base64Data: string, pauseBeforeSec = 0): void {
    if (!base64Data) return;
    const gen = this.playbackGen;
    this.queueChain = this.queueChain
      .then(async () => {
        if (gen !== this.playbackGen) return;
        const ctx = this.ensureContext();
        if (!ctx) return;
        if (ctx.state === "suspended") {
          await ctx.resume().catch(() => {});
        }
        if (gen !== this.playbackGen) return;

        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }

        const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
        if (gen !== this.playbackGen) return;
        this.scheduleBufferOnAnalyser(ctx, audioBuffer, pauseBeforeSec);
      })
      .catch(() => {});
  }
}

export const portfolioAudio = new PortfolioAudioEngine();
