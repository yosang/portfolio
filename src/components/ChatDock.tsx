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
  "radial-gradient(circle at 50% 28%, rgba(237, 110, 72, 0.14), transparent 62%), #1c1917";

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
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);
  const [scrolledPastTop, setScrolledPastTop] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [audioSpeaking, setAudioSpeaking] = useState(false);
  const [portalHost, setPortalHost] = useState<HTMLDivElement | null>(null);

  const floatingSlotRef = useRef<HTMLSpanElement | null>(null);
  const headerSlotRef = useRef<HTMLDivElement | null>(null);
  const parkingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) setHasOpenedOnce(true);
  }, [isOpen]);

  useEffect(() => {
    const onScroll = () => {
      const past = window.scrollY > 160;
      setScrolledPastTop((prev) => (prev === past ? prev : past));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let settleTimer: ReturnType<typeof setTimeout> | null = null;
    const unsub = portfolioAudio.subscribe((st) => {
      if (st.sessionActive) {
        if (settleTimer) {
          clearTimeout(settleTimer);
          settleTimer = null;
        }
        setAudioSpeaking((prev) => (prev ? prev : true));
      } else if (!settleTimer) {
        settleTimer = setTimeout(() => {
          settleTimer = null;
          setAudioSpeaking(false);
        }, 550);
      }
    });
    return () => {
      if (settleTimer) clearTimeout(settleTimer);
      unsub();
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/") return;
    const heroEl = document.getElementById("hero-ai-studio");
    const mq = window.matchMedia("(min-width: 1024px)");

    const check = () => {
      if (!mq.matches || !heroEl) {
        setHeroScrolledOut(true);
        return;
      }
      const r = heroEl.getBoundingClientRect();
      setHeroScrolledOut(r.height === 0 || r.bottom <= 72);
    };
    check();

    const io = heroEl
      ? new IntersectionObserver(
          (entries) => {
            if (!mq.matches) {
              setHeroScrolledOut(true);
              return;
            }
            const entry = entries[0];
            if (!entry) return;
            setHeroScrolledOut(!entry.isIntersecting && entry.boundingClientRect.top < 0);
          },
          { threshold: 0.1 }
        )
      : null;
    if (heroEl && io) io.observe(heroEl);
    mq.addEventListener("change", check);
    return () => {
      io?.disconnect();
      mq.removeEventListener("change", check);
    };
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
  const showMobileHint =
    !hasOpenedOnce && messages.length === 0 && !scrolledPastTop && !isActiveVoice;

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
          className="group fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex items-center gap-2.5 cursor-pointer focus-visible:outline-none sm:right-6 sm:bottom-6"
        >
          <span
            className={`glass-capsule pointer-events-none rounded-full px-3 py-1.5 text-xs font-medium text-ink transition-all duration-200 ${
              showMobileHint
                ? "translate-x-0 opacity-100 lg:translate-x-1 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100"
                : "hidden translate-x-1 opacity-0 sm:inline-block sm:group-hover:translate-x-0 sm:group-hover:opacity-100"
            }`}
          >
            {t.dock}
          </span>

          <span
            ref={floatingSlotRef}
            style={{ background: STUDIO_BG }}
            className={`pointer-events-none relative block h-[72px] w-[64px] origin-bottom-right overflow-hidden rounded-2xl border border-white/15 shadow-[0_8px_22px_-6px_rgba(22,19,18,0.38)] transition-transform duration-300 ease-out group-hover:-translate-y-0.5 sm:h-[114px] sm:w-[100px] sm:rounded-2xl ${
              isActiveVoice ? "scale-[1.34] sm:scale-[1.05] ring-2 ring-[#e05633]/80" : ""
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
                  className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-ink/10 dark:border-white/15 ${
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
