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
import { ITEMS, SPECIFIC_TOUR_TARGET_RE } from "@/data/portfolio";
import { isAllowedGoPath } from "@/lib/apiGuard";
import { getLocalizedData, useLocalizedData } from "@/lib/i18n";

const VALID_SLUGS = new Set(ITEMS.map((i) => i.slug));

const INSTANT_TOUR_NO_RE =
  /^(?:hei[,!\s]+)?(?:ai\s+yosmel[,!\s]+|yosmel[,!\s]+)?(?:kan du\s+|vil du\s+)?(?:vis(?:e)?(?:\s+fram|\s+frem)?(?:\s+meg)?|ta\s+meg\s+(?:med\s+)?(?:gjennom|rundt(?:\s+i)?)|gi\s+meg\s+en\s+(?:runde|omvisning)(?:\s+i|\s+gjennom)?)\s+(?:litt\s+)?(?:rundt(?:\s+i\s+(?:dine\s+)?prosjekt(?:er|ene)(?:\s+dine)?)?|(?:dine\s+|alle\s+)?prosjekt(?:er|ene)(?:\s+dine|\s+du\s+har\s+laget)?|porteføljen(?:\s+din)?)[.!?]*$/i;

const INSTANT_TOUR_EN_RE =
  /^(?:hi[,!\s]+|hello[,!\s]+|hey[,!\s]+)?(?:ai\s+yosmel[,!\s]+|yosmel[,!\s]+)?(?:can you\s+|could you\s+|would you\s+)?(?:show\s+me(?:\s+around(?:\s+in|\s+your)?)?|take\s+me\s+(?:around|through|on\s+a\s+tour\s+of)|give\s+me\s+a\s+tour\s+of|walk\s+me\s+through)\s*(?:your\s+|the\s+|all\s+)?(?:projects|portfolio|work)?[.!?]*$/i;

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

interface CompanionContextValue {
  messages: ChatTurn[];
  mood: AvatarMood;
  isStreaming: boolean;
  isOpen: boolean;
  hasOpenedOnce: boolean;
  setIsOpen: (open: boolean) => void;
  voiceEnabled: boolean;
  setVoiceEnabled: (v: boolean) => void;
  voiceCapped: boolean;
  spotlightSlug: string | null;
  clearSpotlight: () => void;
  sendMessage: (text: string) => Promise<void>;
  resetChat: () => void;
  heroAvatarSlot: HTMLElement | null;
  setHeroAvatarSlot: (el: HTMLElement | null) => void;
  chatPageAvatarSlot: HTMLElement | null;
  setChatPageAvatarSlot: (el: HTMLElement | null) => void;
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
  const { locale, ui: UI } = useLocalizedData();

  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [mood, setMood] = useState<AvatarMood>("neutral");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isOpen, setIsOpenState] = useState(false);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [voiceEnabled, setVoiceEnabledState] = useState(true);

  const setIsOpen = useCallback((next: boolean) => {
    if (next) setHasOpenedOnce(true);
    setIsOpenState(next);
  }, []);
  const [voiceCapped, setVoiceCapped] = useState(false);
  const [spotlightSlug, setSpotlightSlug] = useState<string | null>(null);
  const [heroAvatarSlot, setHeroAvatarSlot] = useState<HTMLElement | null>(null);
  const [chatPageAvatarSlot, setChatPageAvatarSlot] = useState<HTMLElement | null>(
    null
  );

  const messagesRef = useRef<ChatTurn[]>([]);
  const isStreamingRef = useRef(false);
  const voiceEnabledRef = useRef(true);
  const pathnameRef = useRef(pathname);
  const localeRef = useRef(locale);
  const uiRef = useRef(UI);
  const spotlightSlugRef = useRef<string | null>(null);
  const autoScrollCancelledRef = useRef(false);
  const hasStartedTourScrollRef = useRef(false);
  const tourStartedAtRef = useRef(0);
  const tourTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    localeRef.current = locale;
    uiRef.current = UI;
  }, [locale, UI]);

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
    const cancelOnWheel = () => {
      if (!hasStartedTourScrollRef.current) return;
      if (performance.now() - tourStartedAtRef.current < 500) return;
      autoScrollCancelledRef.current = true;
    };
    const cancelIfTouring = () => {
      if (!hasStartedTourScrollRef.current) return;
      autoScrollCancelledRef.current = true;
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
    window.addEventListener("wheel", cancelOnWheel, { passive: true });
    window.addEventListener("touchmove", cancelIfTouring, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", cancelOnWheel);
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
          if (restored.length > 0) {
            queueMicrotask(() => setMessages(restored));
          }
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

  const onMuteFlushRef = useRef<(() => void) | null>(null);

  const setVoiceEnabled = useCallback((next: boolean) => {
    voiceEnabledRef.current = next;
    setVoiceEnabledState(next);
    if (!next) {
      portfolioAudio.stopAll();
      onMuteFlushRef.current?.();
    } else {
      portfolioAudio.unlock();
    }
  }, []);

  const triggerSpotlight = useCallback(
    (slug: string) => {
      const prevSlug = spotlightSlugRef.current;
      spotlightSlugRef.current = slug;
      setSpotlightSlug(slug);
      hasStartedTourScrollRef.current = true;

      if (typeof window !== "undefined" && window.innerWidth < 640) {
        setIsOpen(false);
      }

      if (autoScrollCancelledRef.current) return;

      const scrollAndHighlight = () => {
        if (autoScrollCancelledRef.current) return;
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
    [router, setIsOpen]
  );

  const sendMessage = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed || isStreamingRef.current) return;

      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;

      clearTourTimers();
      autoScrollCancelledRef.current = false;
      hasStartedTourScrollRef.current = false;
      tourStartedAtRef.current = performance.now();

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

      const isEnglishTour =
        !SPECIFIC_TOUR_TARGET_RE.test(trimmed) && INSTANT_TOUR_EN_RE.test(trimmed);
      const isNorwegianTour =
        !SPECIFIC_TOUR_TARGET_RE.test(trimmed) && INSTANT_TOUR_NO_RE.test(trimmed);
      const isInstantTour = isEnglishTour || isNorwegianTour;

      if (isInstantTour) {
        const tourLocale = isEnglishTour
          ? "en"
          : isNorwegianTour
            ? localeRef.current === "en"
              ? "no"
              : localeRef.current
            : localeRef.current;
        const steps: Array<{ slug?: string; audioSrc?: string; bubble: string }> =
          getLocalizedData(tourLocale).tourSteps;
        setMood("happy");

        const finishStreamingState = () => {
          if (abortRef.current === abortController && isStreamingRef.current) {
            isStreamingRef.current = false;
            setIsStreaming(false);
          }
        };

        const revealTourStep = (stepIdx: number) => {
          if (abortController.signal.aborted) return;
          finishStreamingState();
          const visibleBubbles = steps.slice(0, stepIdx + 1).map((s) => s.bubble);
          const content = visibleBubbles.join("\n\n");
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? { ...msg, content, bubbles: visibleBubbles, mood: "happy" }
                : msg
            )
          );
          const slug = steps[stepIdx].slug;
          if (slug) triggerSpotlight(slug);
        };

        const runMutedFallbackFrom = (startIdx: number) => {
          for (let i = startIdx; i < steps.length; i++) {
            const delay = i === startIdx ? 60 : (i - startIdx) * 3800;
            const id = setTimeout(() => {
              revealTourStep(i);
            }, delay);
            tourTimersRef.current.push(id);
          }
        };

        if (wantVoice) {
          (async () => {
            for (let i = 0; i < steps.length; i++) {
              if (abortController.signal.aborted) return;
              const step = steps[i];
              const pause = i === 0 ? 0 : 0.24;

              if (!voiceEnabledRef.current) {
                runMutedFallbackFrom(i);
                return;
              }

              if (!step.audioSrc) {
                portfolioAudio.enqueueSilentStep(3.6, pause, () =>
                  revealTourStep(i)
                );
                continue;
              }

              try {
                const r = await fetch(step.audioSrc, {
                  signal: abortController.signal,
                });
                if (!r.ok) throw new Error(`HTTP ${r.status}`);
                const buf = await r.arrayBuffer();
                if (abortController.signal.aborted) return;
                if (voiceEnabledRef.current) {
                  portfolioAudio.enqueueAudioBuffer(buf, pause, () =>
                    revealTourStep(i)
                  );
                } else {
                  runMutedFallbackFrom(i);
                  return;
                }
              } catch (e) {
                if (e instanceof DOMException && e.name === "AbortError") return;
                if (voiceEnabledRef.current) {
                  portfolioAudio.enqueueSilentStep(3.6, pause, () =>
                    revealTourStep(i)
                  );
                } else {
                  runMutedFallbackFrom(i);
                  return;
                }
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
          headers: {
            "Content-Type": "application/json",
            "X-Portfolio-Client": "yosmel-web",
          },
          signal: abortController.signal,
          body: JSON.stringify({
            messages: updatedHistory.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            page: pageContext,
            voice: wantVoice,
            locale: localeRef.current,
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
        let holdTextForVoice = wantVoice;
        let revealedBubbleCount = 0;
        let textStreamFinished = false;

        const pendingTourSteps = new Map<number, string>();
        const scheduledTourIndices = new Set<number>();
        let fallbackStepCount = 0;
        let hasQueuedAudio = false;

        const finishStreamingState = () => {
          if (abortRef.current === abortController && isStreamingRef.current) {
            isStreamingRef.current = false;
            setIsStreaming(false);
          }
        };

        const syncVisibleText = () => {
          if (abortController.signal.aborted) return;
          const splitBubbles = accumulatedText
            .split(/\n{2,}/)
            .map((s) => s.trim())
            .filter(Boolean);

          if (!holdTextForVoice || !voiceEnabledRef.current) {
            setMood(latestMood);
            if (textStreamFinished) {
              finishStreamingState();
            }
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
            return;
          }

          if (revealedBubbleCount === 0) {
            return;
          }

          const visibleBubbles = splitBubbles.slice(0, revealedBubbleCount);
          const visibleContent = visibleBubbles.join("\n\n");
          setMood(latestMood);
          finishStreamingState();
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId
                ? {
                    ...msg,
                    content: visibleContent,
                    bubbles: visibleBubbles,
                    mood: latestMood,
                    ...(latestAttachment ? { attachment: latestAttachment } : {}),
                  }
                : msg
            )
          );
        };

        onMuteFlushRef.current = () => {
          holdTextForVoice = false;
          syncVisibleText();
        };

        const scheduleFallbackTourStep = (bubbleIdx: number, slug: string) => {
          if (scheduledTourIndices.has(bubbleIdx)) return;
          scheduledTourIndices.add(bubbleIdx);
          if (hasQueuedAudio && voiceEnabledRef.current) {
            portfolioAudio.enqueueSilentStep(3.5, 0.24, () => {
              revealedBubbleCount = Math.max(revealedBubbleCount, bubbleIdx + 1);
              syncVisibleText();
              triggerSpotlight(slug);
            });
            return;
          }
          const delay = fallbackStepCount === 0 ? 120 : fallbackStepCount * 3800;
          fallbackStepCount += 1;
          const id = setTimeout(() => {
            triggerSpotlight(slug);
          }, delay);
          tourTimersRef.current.push(id);
        };

        const flushUnscheduledTourSteps = () => {
          const ordered = [...pendingTourSteps.entries()].sort(
            (a, b) => a[0] - b[0]
          );
          for (const [idx, slug] of ordered) {
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
              if (data.demo) {
                holdTextForVoice = false;
                syncVisibleText();
              }
            }

            if (typeof data.mood === "string") {
              const m = data.mood as AvatarMood;
              latestMood = m;
              if (!holdTextForVoice || !voiceEnabledRef.current || revealedBubbleCount > 0) {
                setMood(m);
              }
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
            }

            if (typeof data.go === "string" && data.go) {
              const safeGo = isAllowedGoPath(data.go, VALID_SLUGS);
              if (safeGo) router.push(safeGo);
            }

            if (data.file === "cv") {
              latestAttachment = {
                href: "/Yosmel_Chiang_CV.pdf",
                filename: "Yosmel_Chiang_CV.pdf",
                label: uiRef.current.chat.cvLabel,
              };
              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === assistantId
                    ? { ...msg, attachment: latestAttachment }
                    : msg
                )
              );
            }

            if (data.textDone === true) {
              textStreamFinished = true;
              if (!holdTextForVoice || !voiceEnabledRef.current) {
                finishStreamingState();
              }
            }

            if (typeof data.t === "string") {
              accumulatedText += data.t;
              syncVisibleText();
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
                const pause =
                  typeof data.pauseBefore === "number" ? data.pauseBefore : 0;
                if (tourSlug && bubbleIdx >= 0) {
                  scheduledTourIndices.add(bubbleIdx);
                }
                hasQueuedAudio = true;
                portfolioAudio.enqueueWavBase64(
                  data.audio,
                  pause,
                  () => {
                    revealedBubbleCount = Math.max(
                      revealedBubbleCount,
                      bubbleIdx >= 0 ? bubbleIdx + 1 : 1
                    );
                    syncVisibleText();
                    if (tourSlug) triggerSpotlight(tourSlug);
                  }
                );
              } else {
                holdTextForVoice = false;
                syncVisibleText();
                if (tourSlug && bubbleIdx >= 0) {
                  scheduleFallbackTourStep(bubbleIdx, tourSlug);
                }
              }
            } else if (data.audioSkipped === true) {
              const bubbleIdx =
                typeof data.bubbleIndex === "number" ? data.bubbleIndex : -1;
              const tourSlug =
                typeof data.tour === "string" && data.tour
                  ? data.tour
                  : bubbleIdx >= 0
                    ? pendingTourSteps.get(bubbleIdx)
                    : undefined;
              if (voiceEnabledRef.current && hasQueuedAudio) {
                if (tourSlug && bubbleIdx >= 0) {
                  scheduledTourIndices.add(bubbleIdx);
                }
                const pause =
                  typeof data.pauseBefore === "number" ? data.pauseBefore : 0.24;
                portfolioAudio.enqueueSilentStep(3.0, pause, () => {
                  revealedBubbleCount = Math.max(
                    revealedBubbleCount,
                    bubbleIdx >= 0 ? bubbleIdx + 1 : 1
                  );
                  syncVisibleText();
                  if (tourSlug) triggerSpotlight(tourSlug);
                });
              } else {
                holdTextForVoice = false;
                syncVisibleText();
                if (tourSlug && bubbleIdx >= 0) {
                  scheduleFallbackTourStep(bubbleIdx, tourSlug);
                }
              }
            }

            if (data.capped === true) {
              setVoiceCapped(true);
              holdTextForVoice = false;
              syncVisibleText();
              flushUnscheduledTourSteps();
            }
          }
        }

        if (!hasQueuedAudio) {
          holdTextForVoice = false;
          syncVisibleText();
        }
        onMuteFlushRef.current = null;
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
                  content: uiRef.current.networkError,
                  bubbles: [uiRef.current.networkError],
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
    autoScrollCancelledRef.current = false;
    hasStartedTourScrollRef.current = false;
    spotlightSlugRef.current = null;
    setSpotlightSlug(null);
    portfolioAudio.stopAll();
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
    [spotlightSlug, clearSpotlight, sendMessage, setIsOpen]
  );

  const ctxValue = useMemo<CompanionContextValue>(
    () => ({
      messages,
      mood,
      isStreaming,
      isOpen,
      hasOpenedOnce,
      setIsOpen,
      voiceEnabled,
      setVoiceEnabled,
      voiceCapped,
      spotlightSlug,
      clearSpotlight,
      sendMessage,
      resetChat,
      heroAvatarSlot,
      setHeroAvatarSlot,
      chatPageAvatarSlot,
      setChatPageAvatarSlot,
    }),
    [
      messages,
      mood,
      isStreaming,
      isOpen,
      hasOpenedOnce,
      setIsOpen,
      voiceEnabled,
      setVoiceEnabled,
      voiceCapped,
      spotlightSlug,
      clearSpotlight,
      sendMessage,
      resetChat,
      heroAvatarSlot,
      chatPageAvatarSlot,
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
