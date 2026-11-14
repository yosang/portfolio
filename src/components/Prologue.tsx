"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { UI } from "@/data/ui";
import { useCompanion } from "@/components/CompanionContext";
import { portfolioAudio, type KeystrokeKind } from "@/lib/audioSynth";

export const PROLOGUE_STORAGE_KEY = "yosmel-prologue-seen";
export const PROLOGUE_REPLAY_EVENT = "yosmel:replay-prologue";

type ProloguePhase = "hidden" | "typing" | "glitching" | "disconnected" | "exiting";

interface StepOp {
  slot: 0 | 1 | 2;
  text: string;
  delay: number;
  sound?: KeystrokeKind | "drop";
  jitter?: -1 | 0 | 1;
  killCursor?: boolean;
}

function formatTodayNorwegian(): string {
  try {
    return `// ${new Intl.DateTimeFormat("nb-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date())}`;
  } catch {
    return "// 14. november 2026";
  }
}

function charDelay(ch: string, baseMin: number, baseRange: number, idx: number): number {
  if (ch === "\n") return 280;
  if (ch === "." || ch === "!" || ch === "?") return 280;
  if (ch === ",") return 170;
  if (ch === " ") return 56;
  const jitter = ((idx * 37 + ch.charCodeAt(0) * 13) % 100) / 100;
  return Math.round(baseMin + jitter * baseRange);
}

function soundForChar(ch: string): KeystrokeKind {
  return ch === " " ? "space" : "char";
}

function buildSteps(dateLine: string): StepOp[] {
  const t = UI.prologue;
  const ops: StepOp[] = [];

  let s0 = "";
  for (let i = 0; i < dateLine.length; i++) {
    const ch = dateLine[i];
    s0 += ch;
    ops.push({
      slot: 0,
      text: s0,
      delay: charDelay(ch, 30, 20, i),
      sound: soundForChar(ch),
    });
  }
  ops.push({ slot: 1, text: "", delay: 360 });

  let s1 = "";
  for (let i = 0; i < t.stanzaOne.length; i++) {
    const ch = t.stanzaOne[i];
    s1 += ch;
    ops.push({
      slot: 1,
      text: s1,
      delay: charDelay(ch, 28, 20, i),
      sound: soundForChar(ch),
    });
  }
  ops.push({ slot: 2, text: "", delay: 420 });

  let s2 = "";
  for (let i = 0; i < t.stanzaTwoCutoff.length; i++) {
    const ch = t.stanzaTwoCutoff[i];
    s2 += ch;
    ops.push({
      slot: 2,
      text: s2,
      delay: charDelay(ch, 28, 20, i + 20),
      sound: soundForChar(ch),
    });
  }

  // Brief freeze right on "tok ov", then signal corruption + line drop
  ops.push({ slot: 2, text: s2, delay: 140 });
  ops.push({
    slot: 2,
    text: t.glitchFrames[0],
    delay: 52,
    sound: "drop",
    jitter: 1,
  });
  ops.push({
    slot: 2,
    text: t.glitchFrames[1],
    delay: 62,
    jitter: -1,
  });
  ops.push({
    slot: 2,
    text: t.glitchFrames[2],
    delay: 68,
    jitter: 1,
  });
  ops.push({
    slot: 2,
    text: t.glitchFrames[3],
    delay: 360,
    jitter: 0,
    killCursor: true,
  });

  return ops;
}

export function Prologue() {
  const { voiceEnabled, setVoiceEnabled, seedWelcome } = useCompanion();
  const t = UI.prologue;

  const [phase, setPhase] = useState<ProloguePhase>("hidden");
  const [dateLine, setDateLine] = useState("// 14. november 2026");
  const [slots, setSlots] = useState<[string, string, string]>(["", "", ""]);
  const [activeSlot, setActiveSlot] = useState<0 | 1 | 2>(0);
  const [cursorAlive, setCursorAlive] = useState(true);
  const [jitterX, setJitterX] = useState<-1 | 0 | 1>(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isActivelyTyping, setIsActivelyTyping] = useState(false);
  const [audioRunning, setAudioRunning] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const welcomeBufRef = useRef<ArrayBuffer | null>(null);
  const fetchingAudioRef = useRef(false);
  const reconnectBtnRef = useRef<HTMLButtonElement | null>(null);
  const voiceEnabledRef = useRef(voiceEnabled);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    return portfolioAudio.subscribeRunning((running) => {
      setAudioRunning(running);
    });
  }, []);

  const finalSlots = useMemo<[string, string, string]>(
    () => [dateLine, t.stanzaOne, t.glitchFrames[3]],
    [dateLine, t.stanzaOne, t.glitchFrames]
  );

  const clearTypingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const preloadWelcomeAudio = useCallback(() => {
    if (welcomeBufRef.current || fetchingAudioRef.current) return;
    fetchingAudioRef.current = true;
    fetch("/audio/prologue-welcome.mp3")
      .then((r) => (r.ok ? r.arrayBuffer() : null))
      .then((buf) => {
        if (buf) welcomeBufRef.current = buf;
      })
      .catch(() => {})
      .finally(() => {
        fetchingAudioRef.current = false;
      });
  }, []);

  const startPrologue = useCallback(
    (forceReplay = false) => {
      if (exitTimerRef.current !== null) {
        clearTimeout(exitTimerRef.current);
        exitTimerRef.current = null;
      }
      clearTypingTimer();

      const today = formatTodayNorwegian();
      setDateLine(today);

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setReducedMotion(prefersReduced);

      if (!forceReplay) {
        const flagged = document.documentElement.dataset.prologue === "1";
        let unseen = false;
        try {
          unseen =
            window.location.pathname === "/" &&
            sessionStorage.getItem(PROLOGUE_STORAGE_KEY) !== "1";
        } catch {
          unseen = false;
        }
        if (!flagged && !unseen) return;
      }

      if (voiceEnabledRef.current) {
        portfolioAudio.unlock();
      }
      preloadWelcomeAudio();

      if (prefersReduced) {
        setSlots([today, t.stanzaOne, t.glitchFrames[3]]);
        setActiveSlot(2);
        setCursorAlive(false);
        setJitterX(0);
        setIsActivelyTyping(false);
        setPhase("disconnected");
        return;
      }

      setSlots(["", "", ""]);
      setActiveSlot(0);
      setCursorAlive(true);
      setJitterX(0);
      setIsActivelyTyping(false);
      setPhase("typing");

      const ops = buildSteps(today);
      let idx = 0;

      const step = () => {
        if (idx >= ops.length) {
          setIsActivelyTyping(false);
          setJitterX(0);
          setPhase("disconnected");
          return;
        }
        const op = ops[idx];
        const stepIndex = idx;
        idx += 1;

        if (op.sound === "drop") {
          setPhase("glitching");
          if (voiceEnabledRef.current) {
            portfolioAudio.playConnectionDrop();
          }
        } else if (op.sound && voiceEnabledRef.current) {
          portfolioAudio.playKeystroke(op.sound, stepIndex);
        }

        if (op.killCursor) {
          setCursorAlive(false);
        }
        setJitterX(op.jitter ?? 0);
        setIsActivelyTyping(op.delay < 180 && !op.killCursor);
        setActiveSlot(op.slot);
        setSlots((prev) => {
          const next: [string, string, string] = [...prev];
          next[op.slot] = op.text;
          return next;
        });
        timerRef.current = setTimeout(step, op.delay);
      };

      timerRef.current = setTimeout(step, 460);
    },
    [clearTypingTimer, preloadWelcomeAudio, t.glitchFrames, t.stanzaOne]
  );

  const jumpToDisconnected = useCallback(() => {
    clearTypingTimer();
    setSlots(finalSlots);
    setActiveSlot(2);
    setCursorAlive(false);
    setJitterX(0);
    setIsActivelyTyping(false);
    setPhase("disconnected");
  }, [clearTypingTimer, finalSlots]);

  const exitPrologue = useCallback(
    (isReconnect: boolean) => {
      clearTypingTimer();
      setJitterX(0);
      try {
        sessionStorage.setItem(PROLOGUE_STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      delete document.documentElement.dataset.prologue;
      document.documentElement.style.overflow = "";

      if (isReconnect) {
        seedWelcome();
      }

      if (isReconnect && voiceEnabledRef.current) {
        portfolioAudio.unlock();
        portfolioAudio.stopAll();
        if (welcomeBufRef.current) {
          portfolioAudio.enqueueAudioBuffer(welcomeBufRef.current, 0.36);
        } else {
          fetch("/audio/prologue-welcome.mp3")
            .then((r) => (r.ok ? r.arrayBuffer() : null))
            .then((buf) => {
              if (buf && voiceEnabledRef.current) {
                welcomeBufRef.current = buf;
                portfolioAudio.enqueueAudioBuffer(buf, 0.12);
              }
            })
            .catch(() => {});
        }
      }

      setPhase("exiting");
      const fadeMs = reducedMotion ? 160 : 720;
      exitTimerRef.current = setTimeout(() => {
        setPhase("hidden");
      }, fadeMs);
    },
    [clearTypingTimer, reducedMotion, seedWelcome]
  );

  const handleSoundToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!voiceEnabled) {
        setVoiceEnabled(true);
        portfolioAudio.unlock();
        portfolioAudio.playKeystroke("char", 1);
        return;
      }
      if (!audioRunning) {
        portfolioAudio.unlock();
        portfolioAudio.playKeystroke("char", 1);
        return;
      }
      setVoiceEnabled(false);
    },
    [voiceEnabled, audioRunning, setVoiceEnabled]
  );

  useEffect(() => {
    startPrologue(false);
    return () => {
      clearTypingTimer();
      if (exitTimerRef.current !== null) clearTimeout(exitTimerRef.current);
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.prologue;
    };
  }, [startPrologue, clearTypingTimer]);

  useEffect(() => {
    const onReplay = () => startPrologue(true);
    window.addEventListener(PROLOGUE_REPLAY_EVENT, onReplay);
    return () => window.removeEventListener(PROLOGUE_REPLAY_EVENT, onReplay);
  }, [startPrologue]);

  useEffect(() => {
    if (phase === "typing" || phase === "glitching" || phase === "disconnected") {
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
    }
  }, [phase]);

  useEffect(() => {
    if (phase === "hidden" || phase === "exiting") return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        exitPrologue(false);
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        if (voiceEnabledRef.current) {
          portfolioAudio.unlock();
        }
        if (phase === "typing" || phase === "glitching") {
          e.preventDefault();
          jumpToDisconnected();
        } else if (
          phase === "disconnected" &&
          document.activeElement !== reconnectBtnRef.current
        ) {
          e.preventDefault();
          exitPrologue(true);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [phase, jumpToDisconnected, exitPrologue]);

  if (phase === "hidden") return null;

  const isExiting = phase === "exiting";
  const isDisconnected = phase === "disconnected" || isExiting;
  const cursorClass = isActivelyTyping
    ? "prologue-cursor prologue-cursor--solid"
    : "prologue-cursor";

  const soundActive = voiceEnabled && audioRunning;
  const soundLabel = !voiceEnabled
    ? t.soundOff
    : audioRunning
      ? t.soundOn
      : t.enableSound;

  const jitterStyle =
    jitterX !== 0
      ? { transform: `translate3d(${jitterX * 1.5}px, 0, 0)` }
      : undefined;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Prolog"
      onPointerDown={() => {
        if (voiceEnabledRef.current && !portfolioAudio.isRunning()) {
          portfolioAudio.unlock();
        }
      }}
      className={`fixed inset-0 z-[100] flex flex-col justify-between bg-[#111110] px-6 py-6 text-[#d8d6d0] select-none sm:px-10 sm:py-8 ${
        isExiting
          ? "pointer-events-none opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-150"
          : "opacity-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 50% 42%, rgba(255, 244, 226, 0.04), transparent 65%)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={handleSoundToggle}
          aria-pressed={soundActive}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-xs transition-colors cursor-pointer ${
            soundActive
              ? "border-white/15 bg-white/[0.07] text-zinc-200 hover:border-white/30"
              : voiceEnabled
                ? "border-white/25 bg-white/[0.06] text-zinc-200 hover:border-white/45"
                : "border-white/10 text-zinc-500 hover:border-white/20 hover:text-zinc-200"
          }`}
        >
          {soundActive ? (
            <Volume2 className="h-3.5 w-3.5" />
          ) : (
            <VolumeX className="h-3.5 w-3.5" />
          )}
          <span>{soundLabel}</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            exitPrologue(false);
          }}
          className="rounded-full px-3 py-1.5 font-mono text-xs text-zinc-500 transition-colors hover:text-zinc-200 cursor-pointer"
        >
          {t.skip}
        </button>
      </div>

      <div className="mx-auto my-auto w-full max-w-xl">
        <div className="grid">
          {/* Ghost sizer: locks exact layout height so typing & disconnect never jump */}
          <div
            aria-hidden="true"
            className="invisible pointer-events-none [grid-area:1/1] space-y-6 font-mono text-[14px] leading-[1.8] text-pretty sm:text-base"
          >
            <p>{finalSlots[0]}</p>
            <p>{finalSlots[1]}</p>
            <p>{finalSlots[2]}</p>
            <div className="space-y-4 pt-3">
              <p className="text-xs">{t.disconnected}</p>
              <span className="inline-flex rounded-full border px-5 py-2.5 text-sm">
                {t.reconnect}
              </span>
            </div>
          </div>

          {/* Live typed & glitched layer */}
          <div
            style={jitterStyle}
            className="[grid-area:1/1] space-y-6 font-mono text-[14px] leading-[1.8] text-pretty sm:text-base"
          >
            <p className="text-zinc-500">
              {slots[0]}
              {cursorAlive && activeSlot === 0 && (
                <span aria-hidden="true" className={cursorClass} />
              )}
            </p>

            <p className={cursorAlive ? "text-[#d8d6d0]" : "text-zinc-400 transition-colors duration-300"}>
              {slots[1]}
              {cursorAlive && activeSlot === 1 && (
                <span aria-hidden="true" className={cursorClass} />
              )}
            </p>

            <p className={cursorAlive ? "text-[#d8d6d0]" : "text-zinc-400 transition-colors duration-300"}>
              {slots[2]}
              {cursorAlive && activeSlot === 2 && (
                <span aria-hidden="true" className={cursorClass} />
              )}
            </p>

            <div
              className={`space-y-4 pt-3 transition-all duration-300 ease-out motion-reduce:transition-none ${
                isDisconnected
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-1.5 opacity-0"
              }`}
            >
              <p className="font-mono text-xs text-[#e4461f]">
                {t.disconnected}
              </p>

              <button
                ref={reconnectBtnRef}
                type="button"
                tabIndex={isDisconnected ? 0 : -1}
                onClick={(e) => {
                  e.stopPropagation();
                  exitPrologue(true);
                }}
                className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.06] px-5 py-2.5 font-mono text-sm text-[#f3f2ee] transition-colors hover:border-white/45 hover:bg-white/[0.12] cursor-pointer"
              >
                <span>{t.reconnect}</span>
                <span className="hidden rounded border border-white/15 px-1.5 py-0.5 text-[11px] text-zinc-400 transition-colors group-hover:text-zinc-200 sm:inline">
                  {t.enterKeyHint} ↵
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="h-6" />
    </div>
  );
}
