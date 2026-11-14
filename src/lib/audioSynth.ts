"use client";

export type VisemeHint = "rest" | "aa" | "ee" | "oh";

export interface SpeechFrameState {
  energy: number;
  viseme: VisemeHint;
  speaking: boolean;
}

export type KeystrokeKind = "char" | "space" | "backspace";

type FrameListener = (state: SpeechFrameState) => void;

class PortfolioAudioEngine {
  private ctx: AudioContext | null = null;
  private activeStoppers: Array<() => void> = [];
  private listeners = new Set<FrameListener>();
  private keystrokeBank: AudioBuffer[] | null = null;
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
        : earliest + pauseBeforeSec;
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

  public enqueueAudioBuffer(rawBuffer: ArrayBuffer, pauseBeforeSec = 0): void {
    if (!rawBuffer || rawBuffer.byteLength === 0) return;
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

        const audioBuffer = await ctx.decodeAudioData(rawBuffer.slice(0));
        if (gen !== this.playbackGen) return;
        this.scheduleBufferOnAnalyser(ctx, audioBuffer, pauseBeforeSec);
      })
      .catch(() => {});
  }

  private getKeystrokeBank(ctx: AudioContext): AudioBuffer[] {
    if (this.keystrokeBank) return this.keystrokeBank;
    const sr = ctx.sampleRate;
    const bufLen = Math.floor(sr * 0.028);
    const bank: AudioBuffer[] = [];
    for (let v = 0; v < 16; v++) {
      const buf = ctx.createBuffer(1, bufLen, sr);
      const ch = buf.getChannelData(0);
      const gap = Math.floor(sr * (0.0038 + (v % 5) * 0.0007));
      for (let i = 0; i < bufLen; i++) {
        const t1 = i / sr;
        let s = (Math.random() * 2 - 1) * Math.exp(-t1 * 1200) * 0.42;
        if (i >= gap) {
          const t2 = (i - gap) / sr;
          s += (Math.random() * 2 - 1) * Math.exp(-t2 * 440) * 0.95;
        }
        ch[i] = s;
      }
      bank.push(buf);
    }
    this.keystrokeBank = bank;
    return bank;
  }

  public playKeystroke(kind: KeystrokeKind, idx = 0): void {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== "running") return;

    const bank = this.getKeystrokeBank(ctx);
    const src = ctx.createBufferSource();
    src.buffer = bank[Math.abs(idx) % bank.length];

    const jitter = ((Math.abs(idx) * 53 + 17) % 100) / 100;
    let rate = 0.92 + jitter * 0.18;
    let cavityHz = 920 + jitter * 260;
    let crispHz = 2650 + jitter * 550;
    let gainVal = 0.14 + jitter * 0.04;

    if (kind === "space") {
      rate = 0.78 + jitter * 0.06;
      cavityHz = 560;
      crispHz = 1650;
      gainVal = 0.18;
    } else if (kind === "backspace") {
      rate = 1.06 + jitter * 0.08;
      cavityHz = 1080;
      crispHz = 2900;
      gainVal = 0.12;
    }

    src.playbackRate.value = rate;

    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 260;

    const cavity = ctx.createBiquadFilter();
    cavity.type = "peaking";
    cavity.frequency.value = cavityHz;
    cavity.Q.value = 1.8;
    cavity.gain.value = 5.5;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = crispHz;
    lp.Q.value = 0.9;

    const g = ctx.createGain();
    g.gain.value = gainVal;

    src.connect(hp);
    hp.connect(cavity);
    cavity.connect(lp);
    lp.connect(g);
    g.connect(ctx.destination);
    src.start(ctx.currentTime);
  }

  public playConnectionDrop(): void {
    const ctx = this.ensureContext();
    if (!ctx || ctx.state !== "running") return;

    const sr = ctx.sampleRate;
    const dropLen = Math.floor(sr * 0.24);
    const dropBuf = ctx.createBuffer(1, dropLen, sr);
    const d = dropBuf.getChannelData(0);
    for (let i = 0; i < dropLen; i++) {
      const t = i / sr;
      if (t < 0.014) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-t * 260) * 0.7;
      } else if (t >= 0.042 && t < 0.056) {
        const dt = t - 0.042;
        d[i] = (Math.random() * 2 - 1) * Math.exp(-dt * 280) * 0.65;
      } else if (t >= 0.095 && t < 0.18) {
        const gate = t < 0.145 ? 1 : Math.exp(-(t - 0.145) * 400);
        d[i] = (Math.random() * 2 - 1) * 0.48 * gate;
      }
    }

    const now = ctx.currentTime;
    const src = ctx.createBufferSource();
    src.buffer = dropBuf;

    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 1150;
    bp.Q.value = 1.1;

    const g = ctx.createGain();
    g.gain.value = 0.2;

    src.connect(bp);
    bp.connect(g);
    g.connect(ctx.destination);
    src.start(now);

    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(115, now + 0.14);
    osc.frequency.exponentialRampToValueAtTime(36, now + 0.21);

    const og = ctx.createGain();
    og.gain.setValueAtTime(0.0001, now + 0.14);
    og.gain.linearRampToValueAtTime(0.085, now + 0.145);
    og.gain.exponentialRampToValueAtTime(0.0001, now + 0.215);

    osc.connect(og);
    og.connect(ctx.destination);
    osc.start(now + 0.14);
    osc.stop(now + 0.22);
  }
}

export const portfolioAudio = new PortfolioAudioEngine();
