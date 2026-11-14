"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RotateCcw, Volume2, VolumeX, X } from "lucide-react";
import { useCompanion } from "@/components/CompanionContext";
import { AvatarStage } from "@/components/AvatarStage";
import { ChatThread, Composer } from "@/components/ChatThread";
import { portfolioAudio } from "@/lib/audioSynth";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";

const STUDIO_BG =
  "radial-gradient(circle at 22% 18%, rgba(228, 70, 31, 0.22), transparent 52%), radial-gradient(circle at 82% 24%, rgba(128, 201, 255, 0.15), transparent 54%), #212325";

export function ChatDock() {
  const pathname = usePathname();
  const {
    messages,
    isOpen,
    setIsOpen,
    mood,
    isStreaming,
    voiceEnabled,
    setVoiceEnabled,
    voiceCapped,
    resetChat,
  } = useCompanion();
  const t = UI.chat;

  const [heroScrolledOut, setHeroScrolledOut] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [audioSpeaking, setAudioSpeaking] = useState(false);
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);

  const floatingSlotRef = useRef<HTMLSpanElement | null>(null);
  const headerSlotRef = useRef<HTMLDivElement | null>(null);
  const parkingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    return portfolioAudio.subscribe((st) => {
      setAudioSpeaking((prev) => (prev === st.speaking ? prev : st.speaking));
    });
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const heroEl = document.getElementById("hero-ai-studio");
    if (!heroEl) return;

    const check = () => {
      const r = heroEl.getBoundingClientRect();
      setHeroScrolledOut(r.bottom <= 72);
    };
    check();

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setHeroScrolledOut(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0.1 }
    );
    io.observe(heroEl);
    return () => io.disconnect();
  }, [pathname]);

  const isOnChatPage = pathname === "/chat";
  const belowFoldOrSubpage = pathname !== "/" || heroScrolledOut;
  const showFloatingAvatar = !isOnChatPage && !isOpen && belowFoldOrSubpage;
  const shouldActivate = !isOnChatPage && (isOpen || belowFoldOrSubpage);

  useEffect(() => {
    if (!shouldActivate || portalHost) return;
    const host = document.createElement("div");
    host.className = "h-full w-full";
    setPortalHost(host);
  }, [shouldActivate, portalHost]);

  useLayoutEffect(() => {
    if (!portalHost) return;
    let target: HTMLElement | null = parkingRef.current;
    if (!isOnChatPage) {
      if (isOpen && headerSlotRef.current) {
        target = headerSlotRef.current;
      } else if (showFloatingAvatar && floatingSlotRef.current) {
        target = floatingSlotRef.current;
      }
    }
    if (target && portalHost.parentElement !== target) {
      target.appendChild(portalHost);
    }
  }, [portalHost, isOnChatPage, isOpen, showFloatingAvatar]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.documentElement.style.overflow;
    if (window.innerWidth < 640) {
      document.documentElement.style.overflow = "hidden";
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen, setIsOpen]);

  const isActiveVoice = audioSpeaking || isStreaming;

  return (
    <>
      <div ref={parkingRef} className="hidden" aria-hidden="true" />

      {portalHost &&
        createPortal(
          <AvatarStage
            mood={mood}
            variant={isOpen ? "head" : "bust"}
            className="h-full w-full"
          />,
          portalHost
        )}

      {!isOnChatPage && showFloatingAvatar && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label={t.dock}
          title={t.dock}
          className="group fixed right-4 bottom-4 z-40 flex items-center gap-2.5 cursor-pointer focus-visible:outline-none sm:right-6 sm:bottom-6"
        >
          <span className="glass-capsule pointer-events-none hidden translate-x-1 rounded-full px-3 py-1.5 text-xs font-medium text-ink opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 sm:inline-block">
            {t.dock}
          </span>

          <span
            ref={floatingSlotRef}
            style={{ background: STUDIO_BG }}
            className={`pointer-events-none relative block h-[78px] w-[70px] overflow-hidden rounded-[22px] border border-white/15 shadow-[0_18px_38px_-10px_rgba(16,17,18,0.45)] transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-[88px] sm:w-[78px] ${
              isActiveVoice ? "ring-2 ring-[#e4461f]/80" : ""
            }`}
          />
        </button>
      )}

      {!isOnChatPage && isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
          <button
            type="button"
            aria-label={t.close}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/35 cursor-default"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="relative flex h-dvh max-h-dvh w-full flex-col bg-paper shadow-2xl sm:max-w-[400px] sm:border-l sm:border-line"
          >
            <header className="relative z-20 flex items-center justify-between gap-3 border-b border-line px-4 py-2.5 sm:px-5">
              <div className="flex items-center gap-2.5">
                <div
                  ref={headerSlotRef}
                  style={{ background: STUDIO_BG }}
                  className={`relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-ink/10 dark:border-white/15 ${
                    isActiveVoice ? "ring-1.5 ring-[#e4461f]/75" : ""
                  }`}
                />
                <span className="text-xs text-ink-soft">
                  {isStreaming ? t.thinking : UI.moods[mood]}
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setInfoOpen((v) => !v)}
                  aria-label={t.aboutAiLabel}
                  aria-expanded={infoOpen}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-line font-mono text-[11px] font-medium leading-none text-ink-soft transition-colors hover:border-ink/40 hover:text-ink cursor-pointer"
                >
                  ?
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  title={t.sound}
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors cursor-pointer ${
                    voiceEnabled
                      ? "bg-ink/8 text-ink"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {voiceEnabled ? (
                    <Volume2 className="h-3.5 w-3.5" />
                  ) : (
                    <VolumeX className="h-3.5 w-3.5" />
                  )}
                  <span>{t.sound}</span>
                </button>

                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={resetChat}
                    title={t.clear}
                    aria-label={t.clear}
                    className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/6 hover:text-ink cursor-pointer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={t.close}
                  className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/6 hover:text-ink cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {infoOpen && (
              <p className="border-b border-line bg-paper-raised px-5 py-2.5 text-xs leading-relaxed text-ink-soft">
                {t.disclaimerPrefix}
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="font-medium text-ink underline underline-offset-3 hover:text-trail"
                >
                  {t.disclaimerLink}
                </a>
                {t.disclaimerSuffix}
              </p>
            )}

            {voiceCapped && voiceEnabled && (
              <p className="border-b border-line px-5 py-2 text-xs text-ink-soft">
                {t.capped}
              </p>
            )}

            <ChatThread className="flex-1 px-5 py-4" />

            <div className="space-y-2.5 border-t border-line px-5 py-3.5">
              <Composer autoFocus inputId="dock-chat-input" />
              <Link
                href="/chat"
                onClick={() => setIsOpen(false)}
                className="inline-block text-xs text-ink-soft underline underline-offset-4 hover:text-ink"
              >
                {t.fullView} →
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
