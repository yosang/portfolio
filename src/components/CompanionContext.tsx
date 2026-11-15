"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { portfolioAudio } from "@/lib/audioSynth";
import type { AvatarMood } from "@/lib/avatarEngine";
import { PROJECT_TOUR_STEPS } from "@/data/portfolio";
import { UI } from "@/data/ui";

const INSTANT_TOUR_RE =
  /^(?:kan du\s+)?vis(?:e)?\s+meg\s+(?:rundt(?:\s+i\s+prosjektene(?:\s+dine)?)?|prosjektene(?:\s+dine)?)[.!?]*$/i;

export interface ChatAttachment {
  href: string;
  filename: string;
  label: string;
}

export interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
  bubbles?: string[];
  mood?: AvatarMood;
  attachment?: ChatAttachment;
}

export type ActiveVoiceMode = "replicated" | "preset";

interface CompanionContextValue {
  messages: ChatTurn[];
  mood: AvatarMood;
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
  voiceMode: ActiveVoiceMode;
  voiceCapped: boolean;
  isDemoMode: boolean;
  spotlightSlug: string | null;
  clearSpotlight: () => void;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => void;
}

interface CompanionPortfolioValue {
  spotlightSlug: string | null;
  clearSpotlight: () => void;
  sendMessage: (text: string) => Promise<void>;
  setIsOpen: (open: boolean) => void;
}

const CompanionContext = createContext<CompanionContextValue | null>(null);
const CompanionPortfolioContext = createContext<CompanionPortfolioValue | null>(null);

let loggedConsoleNote = false;

function inspectViewportContext(pathname: string) {
  if (typeof window === "undefined") {
    return { path: pathname, title: "", section: "", showing: "" };
  }

  let visibleSection = "";
  let visibleCard = "";
  const vh = window.innerHeight;

  const sections = document.querySelectorAll<HTMLElement>(
    "[data-viewport-section]"
  );
  for (const sec of sections) {
    const r = sec.getBoundingClientRect();
    if (r.top < vh * 0.65 && r.bottom > vh * 0.2) {
      visibleSection = sec.dataset.viewportSection || "";
      break;
    }
  }

  const items = document.querySelectorAll<HTMLElement>("[data-viewport-item]");
  let bestOverlap = 0;
  for (const item of items) {
    const r = item.getBoundingClientRect();
    const top = Math.max(0, r.top);
    const bottom = Math.min(vh, r.bottom);
    const overlap = Math.max(0, bottom - top);
    if (overlap > bestOverlap && overlap > 80) {
      bestOverlap = overlap;
      visibleCard = item.dataset.viewportItem || "";
    }
  }

  return {
    path: pathname,
    title: document.title,
    section: visibleSection,
    showing: visibleCard,
  };
}

export function CompanionProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [mood, setMood] = useState<AvatarMood>("neutral");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [voiceEnabled, setVoiceEnabledState] = useState(true);
  const [voiceMode, setVoiceMode] = useState<ActiveVoiceMode>("preset");
  const [voiceCapped, setVoiceCapped] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [spotlightSlug, setSpotlightSlug] = useState<string | null>(null);

  const prevInteractionIdRef = useRef<string | null>(null);
  const messagesRef = useRef<ChatTurn[]>([]);
  const isStreamingRef = useRef(false);
  const voiceEnabledRef = useRef(true);
  const pathnameRef = useRef(pathname);
  const spotlightSlugRef = useRef<string | null>(null);
  const tourCancelledRef = useRef(false);
  const hasStartedTourScrollRef = useRef(false);
  const tourTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    spotlightSlugRef.current = spotlightSlug;
  }, [spotlightSlug]);

  const clearTourTimers = useCallback(() => {
    for (const timer of tourTimersRef.current) {
      clearTimeout(timer);
    }
    tourTimersRef.current = [];
  }, []);

  useEffect(() => {
    const cancelIfTouring = () => {
      if (!hasStartedTourScrollRef.current) return;
      tourCancelledRef.current = true;
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (
        e.key === "ArrowDown" ||
        e.key === "ArrowUp" ||
        e.key === "PageDown" ||
        e.key === "PageUp" ||
        e.key === "Home" ||
        e.key === "End" ||
        e.key === " "
      ) {
        cancelIfTouring();
      }
    };
    window.addEventListener("wheel", cancelIfTouring, { passive: true });
    window.addEventListener("touchmove", cancelIfTouring, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", cancelIfTouring);
      window.removeEventListener("touchmove", cancelIfTouring);
      window.removeEventListener("keydown", onKeyDown);
      clearTourTimers();
    };
  }, [clearTourTimers]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    if (!loggedConsoleNote) {
      loggedConsoleNote = true;
      console.info(
        "%c// Hei fra den ekte Yosmel. Hvis du leser dette i konsollen, er du sannsynligvis fortsatt et menneske selv.",
        "font-family: monospace; color: #e4461f;"
      );
    }
    try {
      const raw = sessionStorage.getItem("ai-twin-chat");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.messages)) {
          const restored = (parsed.messages as ChatTurn[]).filter(
            (m) => m.id !== "a-prologue-welcome"
          );
          if (restored.length > 0) setMessages(restored);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (isStreaming) return;
    try {
      sessionStorage.setItem(
        "ai-twin-chat",
        JSON.stringify({ messages })
      );
    } catch {
      // ignore
    }
  }, [messages, isStreaming]);

  const setVoiceEnabled = useCallback((next: boolean) => {
    setVoiceEnabledState(next);
    if (!next) {
      portfolioAudio.stopAll();
    } else {
      portfolioAudio.unlock();
    }
  }, []);

  const triggerSpotlight = useCallback(
    (slug: string) => {
      if (tourCancelledRef.current) return;
      const prevSlug = spotlightSlugRef.current;
      spotlightSlugRef.current = slug;
      setSpotlightSlug(slug);
      hasStartedTourScrollRef.current = true;

      if (typeof window !== "undefined" && window.innerWidth < 640) {
        setIsOpen(false);
      }

      const scrollAndHighlight = () => {
        if (tourCancelledRef.current) return;
        const el = document.querySelector<HTMLElement>(
          `[data-project-slug="${slug}"]`
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };

      if (pathnameRef.current !== "/") {
        router.push("/");
        const id = setTimeout(scrollAndHighlight, 280);
        tourTimersRef.current.push(id);
      } else {
        const delay = prevSlug && prevSlug !== slug ? 220 : 50;
        const id = setTimeout(scrollAndHighlight, delay);
        tourTimersRef.current.push(id);
      }
    },
    [router]
  );

  const sendMessage = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed || isStreamingRef.current) return;

      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;

      clearTourTimers();
      tourCancelledRef.current = false;
      hasStartedTourScrollRef.current = false;

      portfolioAudio.unlock();
      portfolioAudio.stopAll();

      const userTurn: ChatTurn = {
        id: `u-${Date.now()}`,
        role: "user",
        content: trimmed,
      };
      const assistantId = `a-${Date.now() + 1}`;
      const assistantTurn: ChatTurn = {
        id: assistantId,
        role: "assistant",
        content: "",
        bubbles: [],
        mood: "thinking",
      };

      const updatedHistory = [...messagesRef.current, userTurn];
      setMessages([...updatedHistory, assistantTurn]);
      setMood("thinking");
      isStreamingRef.current = true;
      setIsStreaming(true);

      const pageContext = inspectViewportContext(pathnameRef.current);
      const wantVoice = voiceEnabledRef.current;

      if (INSTANT_TOUR_RE.test(trimmed)) {
        prevInteractionIdRef.current = null;
        setMood("happy");

        const revealTourStep = (stepIdx: number) => {
          if (abortController.signal.aborted) return;
          const visibleBubbles = PROJECT_TOUR_STEPS.slice(0, stepIdx + 1).map(
            (s) => s.bubble
          );
          const content = visibleBubbles.join("\n\n");
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content, bubbles: visibleBubbles, mood: "happy" }
                : msg
            )
          );
          triggerSpotlight(PROJECT_TOUR_STEPS[stepIdx].slug);
        };

        const runMutedFallbackFrom = (startIdx: number) => {
          for (let i = startIdx; i < PROJECT_TOUR_STEPS.length; i++) {
            const delay = i === startIdx ? 80 : (i - startIdx) * 3800;
            const id = setTimeout(() => {
              revealTourStep(i);
            }, delay);
            tourTimersRef.current.push(id);
          }
        };

        isStreamingRef.current = false;
        setIsStreaming(false);

        if (wantVoice) {
          setVoiceMode("replicated");
          (async () => {
            for (let i = 0; i < PROJECT_TOUR_STEPS.length; i++) {
              if (abortController.signal.aborted) return;
              try {
                const r = await fetch(PROJECT_TOUR_STEPS[i].audioSrc, {
                  signal: abortController.signal,
                });
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const buf = await r.arrayBuffer();
                if (abortController.signal.aborted) return;
                if (voiceEnabledRef.current) {
                  portfolioAudio.enqueueAudioBuffer(
                    buf,
                    i === 0 ? 0 : 0.24,
                    () => revealTourStep(i)
                  );
                } else {
                  runMutedFallbackFrom(i);
                  return;
                }
              } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                runMutedFallbackFrom(i);
                return;
              }
            }
          })();
        } else {
          runMutedFallbackFrom(0);
        }
        return;
      }

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: abortController.signal,
          body: JSON.stringify({
            messages: updatedHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            page: pageContext,
            voice: wantVoice,
            previousInteractionId: prevInteractionIdRef.current,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body
          .pipeThrough(new TextDecoderStream())
          .getReader();

        let sseBuffer = "";
        let accumulatedText = "";
        let latestMood: AvatarMood = "neutral";
        let latestAttachment: ChatAttachment | undefined;
        let isDemoStream = false;

        const pendingTourSteps = new Map<number, string>();
        const scheduledTourIndices = new Set<number>();
        let fallbackStepCount = 0;

        const scheduleFallbackTourStep = (bubbleIdx: number, slug: string) => {
          if (scheduledTourIndices.has(bubbleIdx)) return;
          scheduledTourIndices.add(bubbleIdx);
          const delay = fallbackStepCount === 0 ? 120 : fallbackStepCount * 3800;
          fallbackStepCount += 1;
          const id = setTimeout(() => {
            triggerSpotlight(slug);
          }, delay);
          tourTimersRef.current.push(id);
        };

        const flushUnscheduledTourSteps = () => {
          for (const [idx, slug] of pendingTourSteps.entries()) {
            if (!scheduledTourIndices.has(idx)) {
              scheduleFallbackTourStep(idx, slug);
            }
          }
        };

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          sseBuffer += value;

          const frames = sseBuffer.split("\n\n");
          sseBuffer = frames.pop() || "";

          for (const frame of frames) {
            const line = frame
              .split("\n")
              .find((l) => l.startsWith("data: "));
            if (!line) continue;

            let data: Record<string, unknown>;
            try {
              data = JSON.parse(line.slice(6));
            } catch {
              continue;
            }

            if (typeof data.demo === "boolean") {
              isDemoStream = data.demo;
              setIsDemoMode(data.demo);
            }

            if (typeof data.mood === "string") {
              const m = data.mood as AvatarMood;
              latestMood = m;
              setMood(m);
            }

            if (
              data.tourStep &&
              typeof data.tourStep === "object" &&
              typeof (data.tourStep as { index?: unknown }).index === "number" &&
              typeof (data.tourStep as { slug?: unknown }).slug === "string"
            ) {
              const { index, slug } = data.tourStep as {
                index: number;
                slug: string;
              };
              pendingTourSteps.set(index, slug);
              if (!voiceEnabledRef.current || isDemoStream) {
                scheduleFallbackTourStep(index, slug);
              }
            } else if (
              typeof data.tour === "string" &&
              data.tour &&
              typeof data.audio !== "string"
            ) {
              pendingTourSteps.set(0, data.tour);
              if (!voiceEnabledRef.current || isDemoStream) {
                scheduleFallbackTourStep(0, data.tour);
              }
            }

            if (typeof data.go === "string" && data.go) {
              router.push(data.go);
            }

            if (data.file === "cv") {
              latestAttachment = {
                href: "/Yosmel_Chiang_CV.pdf",
                filename: "Yosmel_Chiang_CV.pdf",
                label: UI.chat.cvLabel,
              };
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, attachment: latestAttachment }
                    : msg
                )
              );
            }

            if (typeof data.interactionId === "string") {
              prevInteractionIdRef.current = data.interactionId;
            }

            if (data.textDone === true) {
              isStreamingRef.current = false;
              setIsStreaming(false);
            }

            if (typeof data.t === "string") {
              accumulatedText += data.t;
              const splitBubbles = accumulatedText
                .split(/\n{2,}/)
                .map((s) => s.trim())
                .filter(Boolean);

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? {
                        ...msg,
                        content: accumulatedText,
                        bubbles: splitBubbles,
                        mood: latestMood,
                        ...(latestAttachment ? { attachment: latestAttachment } : {}),
                      }
                    : msg
                )
              );
            }

            if (typeof data.audio === "string" && data.audio.length > 0) {
              const bubbleIdx =
                typeof data.bubbleIndex === "number" ? data.bubbleIndex : -1;
              const tourSlug =
                typeof data.tour === "string" && data.tour
                  ? data.tour
                  : bubbleIdx >= 0
                    ? pendingTourSteps.get(bubbleIdx)
                    : undefined;

              if (voiceEnabledRef.current) {
                if (
                  typeof data.mode === "string" &&
                  (data.mode === "replicated" || data.mode === "preset")
                ) {
                  setVoiceMode(data.mode);
                }
                const pause =
                  typeof data.pauseBefore === "number" ? data.pauseBefore : 0;
                if (tourSlug && bubbleIdx >= 0) {
                  scheduledTourIndices.add(bubbleIdx);
                }
                portfolioAudio.enqueueWavBase64(
                  data.audio,
                  pause,
                  tourSlug ? () => triggerSpotlight(tourSlug) : undefined
                );
              } else if (tourSlug && bubbleIdx >= 0) {
                scheduleFallbackTourStep(bubbleIdx, tourSlug);
              }
            }

            if (data.capped === true) {
              setVoiceCapped(true);
              flushUnscheduledTourSteps();
            }
          }
        }

        flushUnscheduledTourSteps();
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        console.error("Chat stream failed:", err);
        setMood("confused");
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantId
                ? {
                  ...msg,
                  content: UI.networkError,
                  bubbles: [UI.networkError],
                  mood: "confused",
                }
              : msg
          )
        );
      } finally {
        if (abortRef.current === abortController) {
          isStreamingRef.current = false;
          setIsStreaming(false);
        }
      }
    },
    [clearTourTimers, router, triggerSpotlight]
  );

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    clearTourTimers();
    tourCancelledRef.current = false;
    hasStartedTourScrollRef.current = false;
    spotlightSlugRef.current = null;
    setSpotlightSlug(null);
    portfolioAudio.stopAll();
    prevInteractionIdRef.current = null;
    setMessages([]);
    setMood("neutral");
    sessionStorage.removeItem("ai-twin-chat");
  }, [clearTourTimers]);

  const clearSpotlight = useCallback(() => {
    spotlightSlugRef.current = null;
    setSpotlightSlug(null);
  }, []);

  const portfolioValue = useMemo<CompanionPortfolioValue>(
    () => ({
      spotlightSlug,
      clearSpotlight,
      sendMessage,
      setIsOpen,
    }),
    [spotlightSlug, clearSpotlight, sendMessage]
  );

  const ctxValue = useMemo<CompanionContextValue>(
    () => ({
      messages,
      mood,
      isStreaming,
      isOpen,
      setIsOpen,
      voiceEnabled,
      setVoiceEnabled,
      voiceMode,
      voiceCapped,
      isDemoMode,
      spotlightSlug,
      clearSpotlight,
      sendMessage,
      resetChat,
    }),
    [
      messages,
      mood,
      isStreaming,
      isOpen,
      voiceEnabled,
      setVoiceEnabled,
      voiceMode,
      voiceCapped,
      isDemoMode,
      spotlightSlug,
      clearSpotlight,
      sendMessage,
      resetChat,
    ]
  );

  return (
    <CompanionPortfolioContext.Provider value={portfolioValue}>
      <CompanionContext.Provider value={ctxValue}>
        {children}
      </CompanionContext.Provider>
    </CompanionPortfolioContext.Provider>
  );
}

export function useCompanion() {
  const ctx = useContext(CompanionContext);
  if (!ctx) {
    throw new Error("useCompanion must be used inside CompanionProvider");
  }
  return ctx;
}

export function useCompanionPortfolio() {
  const ctx = useContext(CompanionPortfolioContext);
  if (!ctx) {
    throw new Error("useCompanionPortfolio must be used inside CompanionProvider");
  }
  return ctx;
}
