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
import { UI } from "@/data/ui";

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
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled;
  }, [voiceEnabled]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("ai-twin-chat");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.messages)) setMessages(parsed.messages);
        if (typeof parsed.voiceEnabled === "boolean") {
          setVoiceEnabledState(parsed.voiceEnabled);
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
        JSON.stringify({ messages, voiceEnabled })
      );
    } catch {
      // ignore
    }
  }, [messages, voiceEnabled, isStreaming]);

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
      setSpotlightSlug(slug);
      const scrollAndHighlight = () => {
        const el = document.querySelector<HTMLElement>(
          `[data-project-slug="${slug}"]`
        );
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
      if (pathname !== "/") {
        router.push("/");
        setTimeout(scrollAndHighlight, 260);
      } else {
        setTimeout(scrollAndHighlight, 60);
      }
    },
    [pathname, router]
  );

  const sendMessage = useCallback(
    async (rawText: string) => {
      const trimmed = rawText.trim();
      if (!trimmed || isStreamingRef.current) return;

      abortRef.current?.abort();
      const abortController = new AbortController();
      abortRef.current = abortController;

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

      const pageContext = inspectViewportContext(pathname);
      const wantVoice = voiceEnabledRef.current;

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
              setIsDemoMode(data.demo);
            }

            if (typeof data.mood === "string") {
              const m = data.mood as AvatarMood;
              latestMood = m;
              setMood(m);
            }

            if (typeof data.tour === "string" && data.tour) {
              triggerSpotlight(data.tour);
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

            if (typeof data.audio === "string" && data.audio.length > 0 && voiceEnabledRef.current) {
              if (
                typeof data.mode === "string" &&
                (data.mode === "replicated" || data.mode === "preset")
              ) {
                setVoiceMode(data.mode);
              }
              const pause = typeof data.pauseBefore === "number" ? data.pauseBefore : 0;
              portfolioAudio.enqueueWavBase64(data.audio, pause);
            }

            if (data.capped === true) {
              setVoiceCapped(true);
            }
          }
        }
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
    [pathname, router, triggerSpotlight]
  );

  const resetChat = useCallback(() => {
    abortRef.current?.abort();
    portfolioAudio.stopAll();
    prevInteractionIdRef.current = null;
    setMessages([]);
    setMood("neutral");
    sessionStorage.removeItem("ai-twin-chat");
  }, []);

  const clearSpotlight = useCallback(() => setSpotlightSlug(null), []);

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
