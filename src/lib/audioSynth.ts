"use client";

export type VisemeHint = "rest" | "aa" | "ee" | "oh";

export interface SpeechFrameState {
  energy: number; // 0..1 normalized amplitude
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
  private nextPcmTime = 0;
  private activeSourceCount = 0;
  private pcmCarryByte: number | null = null;

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
    this.nextPcmTime = 0;
    this.activeSourceCount = 0;
    this.pcmCarryByte = null;
    this.emit({ energy: 0, viseme: "rest", speaking: false });
  }

  private scheduleBufferOnAnalyser(
    ctx: AudioContext,
    audioBuffer: AudioBuffer,
    immediate = false
  ): Promise<void> {
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

    const startAt = immediate
      ? ctx.currentTime
      : Math.max(ctx.currentTime + 0.04, this.nextPcmTime);
    this.nextPcmTime = startAt + audioBuffer.duration;
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
        if (this.activeSourceCount <= 0 || !this.streamAnalyser) {
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

    return new Promise<void>((resolve) => {
      source.onended = () => {
        if (!stopped) {
          this.activeSourceCount = Math.max(0, this.activeSourceCount - 1);
          if (this.activeSourceCount === 0) {
            if (this.rafId !== null) {
              cancelAnimationFrame(this.rafId);
              this.rafId = null;
            }
            this.emit({ energy: 0, viseme: "rest", speaking: false });
          }
        }
        resolve();
      };
      source.start(startAt);
    });
  }

  public enqueuePcmChunk(base64Data: string, sampleRate = 24000): void {
    const ctx = this.ensureContext();
    if (!ctx || !base64Data) return;

    const binary = atob(base64Data);
    const hasCarry = this.pcmCarryByte !== null ? 1 : 0;
    const totalBytes = binary.length + hasCarry;
    if (totalBytes < 2) {
      if (binary.length === 1) this.pcmCarryByte = binary.charCodeAt(0);
      return;
    }

    const usableBytes = totalBytes - (totalBytes % 2);
    const bytes = new Uint8Array(usableBytes);
    let offset = 0;
    if (this.pcmCarryByte !== null) {
      bytes[0] = this.pcmCarryByte;
      offset = 1;
      this.pcmCarryByte = null;
    }
    const copyLen = usableBytes - offset;
    for (let i = 0; i < copyLen; i++) {
      bytes[offset + i] = binary.charCodeAt(i);
    }
    if (copyLen < binary.length) {
      this.pcmCarryByte = binary.charCodeAt(copyLen);
    }

    const sampleCount = usableBytes >> 1;
    const view = new DataView(bytes.buffer);
    const floats = new Float32Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) {
      floats[i] = view.getInt16(i * 2, true) / 32768;
    }

    const audioBuffer = ctx.createBuffer(1, sampleCount, sampleRate);
    audioBuffer.copyToChannel(floats, 0);
    void this.scheduleBufferOnAnalyser(ctx, audioBuffer, false);
  }

  public addSpeechPause(seconds = 0.12): void {
    if (!this.ctx) return;
    this.nextPcmTime = Math.max(this.ctx.currentTime, this.nextPcmTime) + seconds;
  }

  public async playBase64Audio(
    base64Data: string,
    _mimeType = "audio/wav"
  ): Promise<void> {
    this.stopAll();
    const ctx = this.ensureContext();
    if (!ctx) return;

    const binary = atob(base64Data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));
    return this.scheduleBufferOnAnalyser(ctx, audioBuffer, true);
  }
}

export const portfolioAudio = new PortfolioAudioEngine();
