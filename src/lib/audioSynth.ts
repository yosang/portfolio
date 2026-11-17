"use client";

export type VisemeHint = "rest" | "aa" | "ee" | "oh";

export interface SpeechFrameState {
  energy: number;
  viseme: VisemeHint;
  speaking: boolean;
  sessionActive: boolean;
}

type FrameListener = (state: SpeechFrameState) => void;

class PortfolioAudioEngine {
  private ctx: AudioContext | null = null;
  private activeStoppers = new Set<() => void>();
  private listeners = new Set<FrameListener>();
  private rafId: number | null = null;
  private streamAnalyser: AnalyserNode | null = null;
  private nextStartTime = 0;
  private nextFallbackWallTime = 0;
  private activeSourceCount = 0;
  private playbackGen = 0;
  private queueChain: Promise<void> = Promise.resolve();
  private resumePromise: Promise<void> | null = null;
  private audioTimedOut = false;

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
    if (this.ctx && this.ctx.state === "suspended" && !this.resumePromise) {
      this.resumePromise = this.ctx
        .resume()
        .then(() => {
          this.audioTimedOut = false;
        })
        .catch(() => {})
        .finally(() => {
          this.resumePromise = null;
        });
    }
    return this.ctx;
  }

  public unlock() {
    this.ensureContext();
  }

  public isRunning(): boolean {
    return this.ctx?.state === "running";
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
    for (const stop of this.activeStoppers) {
      try {
        stop();
      } catch {
        // ignore cleanup errors
      }
    }
    this.activeStoppers.clear();
    if (this.streamAnalyser) {
      try {
        this.streamAnalyser.disconnect();
      } catch {
        // ignore
      }
      this.streamAnalyser = null;
    }
    this.nextStartTime = 0;
    this.nextFallbackWallTime = 0;
    this.activeSourceCount = 0;
    this.emit({ energy: 0, viseme: "rest", speaking: false, sessionActive: false });
  }

  private scheduleWallClockStep(
    durationSec: number,
    pauseBeforeSec = 0,
    onStart?: () => void
  ): void {
    const nowSec = performance.now() / 1000;
    const earliest = nowSec + 0.02;
    const targetStart =
      this.nextFallbackWallTime > earliest
        ? this.nextFallbackWallTime + pauseBeforeSec
        : earliest + pauseBeforeSec;
    this.nextFallbackWallTime = targetStart + durationSec;
    if (onStart) {
      const leadSec = Math.min(pauseBeforeSec, 0.22);
      const fireInMs = Math.max(0, (targetStart - leadSec - nowSec) * 1000);
      let stopped = false;
      const stop = () => {
        stopped = true;
        clearTimeout(timer);
      };
      const timer = setTimeout(() => {
        this.activeStoppers.delete(stop);
        if (!stopped) onStart();
      }, fireInMs);
      this.activeStoppers.add(stop);
    }
  }

  private syncAudioClockFromFallback(ctx: AudioContext): void {
    if (this.nextFallbackWallTime <= 0) return;
    const remainingWall = this.nextFallbackWallTime - performance.now() / 1000;
    if (remainingWall > 0) {
      this.nextStartTime = Math.max(
        this.nextStartTime,
        ctx.currentTime + remainingWall
      );
    }
    this.nextFallbackWallTime = 0;
  }

  private scheduleBufferOnAnalyser(
    ctx: AudioContext,
    audioBuffer: AudioBuffer,
    pauseBeforeSec = 0,
    onStart?: () => void
  ): void {
    if (ctx.state !== "running") {
      this.scheduleWallClockStep(audioBuffer.duration, pauseBeforeSec, onStart);
      return;
    }

    this.syncAudioClockFromFallback(ctx);

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
        : earliest + pauseBeforeSec;
    this.nextStartTime = targetStart + audioBuffer.duration;
    this.activeSourceCount += 1;

    let stopped = false;
    let startTimer: ReturnType<typeof setTimeout> | null = null;
    if (onStart) {
      const leadSec = Math.min(pauseBeforeSec, 0.22);
      const fireInMs = Math.max(0, (targetStart - leadSec - ctx.currentTime) * 1000);
      startTimer = setTimeout(() => {
        startTimer = null;
        if (!stopped) onStart();
      }, fireInMs);
    }

    const stop = () => {
      stopped = true;
      if (startTimer !== null) {
        clearTimeout(startTimer);
        startTimer = null;
      }
      try {
        source.stop();
      } catch {
        // already stopped
      }
      source.disconnect();
    };
    this.activeStoppers.add(stop);

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
          this.emit({
            energy: 0,
            viseme: "rest",
            speaking: false,
            sessionActive: false,
          });
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

        this.emit({
          energy,
          viseme,
          speaking: energy > 0.03,
          sessionActive: true,
        });
        this.rafId = requestAnimationFrame(tick);
      };
      this.rafId = requestAnimationFrame(tick);
    }

    source.onended = () => {
      this.activeStoppers.delete(stop);
      source.disconnect();
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
          this.emit({
            energy: 0,
            viseme: "rest",
            speaking: false,
            sessionActive: false,
          });
        }
      }
    };
    source.start(targetStart);
  }

  private async waitForContextReady(ctx: AudioContext): Promise<void> {
    if (ctx.state !== "suspended" || this.audioTimedOut) return;
    const resumeTask = this.resumePromise ?? ctx.resume().catch(() => {});
    let timedOut = false;
    await Promise.race([
      resumeTask,
      new Promise<void>((r) =>
        setTimeout(() => {
          timedOut = true;
          r();
        }, 1500)
      ),
    ]);
    if (timedOut && (ctx.state as AudioContextState) !== "running") {
      this.audioTimedOut = true;
    }
  }

  private decodeAndSchedule(
    getBuffer: () => ArrayBuffer,
    pauseBeforeSec: number,
    onStart?: () => void
  ): void {
    const gen = this.playbackGen;
    this.queueChain = this.queueChain
      .then(async () => {
        if (gen !== this.playbackGen) return;
        const ctx = this.ensureContext();
        if (!ctx) {
          this.scheduleWallClockStep(3.2, pauseBeforeSec, onStart);
          return;
        }
        await this.waitForContextReady(ctx);
        if (gen !== this.playbackGen) return;

        const audioBuffer = await ctx.decodeAudioData(getBuffer());
        if (gen !== this.playbackGen) return;
        this.scheduleBufferOnAnalyser(ctx, audioBuffer, pauseBeforeSec, onStart);
      })
      .catch(() => {
        if (gen === this.playbackGen) {
          this.scheduleSilentOnActiveClock(3.2, pauseBeforeSec, onStart);
        }
      });
  }

  private scheduleSilentOnActiveClock(
    durationSec: number,
    pauseBeforeSec: number,
    onStart?: () => void
  ): void {
    const ctx = this.ctx;
    if (ctx && ctx.state === "running") {
      this.syncAudioClockFromFallback(ctx);
      const earliest = ctx.currentTime + 0.02;
      const targetStart =
        this.nextStartTime > earliest
          ? this.nextStartTime + pauseBeforeSec
          : earliest + pauseBeforeSec;
      this.nextStartTime = targetStart + durationSec;
      if (onStart) {
        const leadSec = Math.min(pauseBeforeSec, 0.22);
        const fireInMs = Math.max(
          0,
          (targetStart - leadSec - ctx.currentTime) * 1000
        );
        let stopped = false;
        const stop = () => {
          stopped = true;
          clearTimeout(timer);
        };
        const timer = setTimeout(() => {
          this.activeStoppers.delete(stop);
          if (!stopped) onStart();
        }, fireInMs);
        this.activeStoppers.add(stop);
      }
      return;
    }
    this.scheduleWallClockStep(durationSec, pauseBeforeSec, onStart);
  }

  public enqueueSilentStep(
    durationSec: number,
    pauseBeforeSec = 0,
    onStart?: () => void
  ): void {
    const gen = this.playbackGen;
    this.queueChain = this.queueChain
      .then(async () => {
        if (gen !== this.playbackGen) return;
        const ctx = this.ensureContext();
        if (ctx) {
          await this.waitForContextReady(ctx);
        }
        if (gen !== this.playbackGen) return;
        this.scheduleSilentOnActiveClock(durationSec, pauseBeforeSec, onStart);
      })
      .catch(() => {});
  }

  public enqueueWavBase64(
    base64Data: string,
    pauseBeforeSec = 0,
    onStart?: () => void
  ): void {
    if (!base64Data) return;
    this.decodeAndSchedule(
      () => {
        const binary = atob(base64Data);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer.slice(0);
      },
      pauseBeforeSec,
      onStart
    );
  }

  public enqueueAudioBuffer(
    rawBuffer: ArrayBuffer,
    pauseBeforeSec = 0,
    onStart?: () => void
  ): void {
    if (!rawBuffer || rawBuffer.byteLength === 0) return;
    this.decodeAndSchedule(() => rawBuffer.slice(0), pauseBeforeSec, onStart);
  }
}

export const portfolioAudio = new PortfolioAudioEngine();
