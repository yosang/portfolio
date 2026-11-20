"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Maximize2,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useCompanion, useCompanionPortfolio } from "@/components/CompanionContext";
import { ChatThread, Composer } from "@/components/ChatThread";
import { ProjectCard } from "@/components/ProjectCard";
import { useLocalizedData } from "@/lib/i18n";

export default function HomePage() {
  const { spotlightSlug, clearSpotlight, sendMessage, setIsOpen } = useCompanionPortfolio();
  const {
    ui: UI,
    profile: PROFILE,
    projects: ITEMS,
  } = useLocalizedData();
  const t = UI.home;

  const [openSlugs, setOpenSlugs] = useState<Record<string, boolean>>({});

  const toggleDetails = useCallback(
    (slug: string) => {
      if (spotlightSlug === slug) {
        clearSpotlight();
        setOpenSlugs((prev) => ({ ...prev, [slug]: false }));
        return;
      }
      setOpenSlugs((prev) => ({ ...prev, [slug]: !prev[slug] }));
    },
    [spotlightSlug, clearSpotlight]
  );

  const askAboutProject = useCallback(
    (prompt: string) => {
      const heroEl = document.getElementById("hero-ai-studio");
      if (heroEl) {
        const r = heroEl.getBoundingClientRect();
        if (r.height > 0 && r.bottom > 120 && r.top < window.innerHeight) {
          sendMessage(prompt);
          return;
        }
      }
      setIsOpen(true);
      sendMessage(prompt);
    },
    [sendMessage, setIsOpen]
  );

  return (
    <div>
      {/* HERO: Pure white editorial band + desktop 3D AI Twin Studio */}
      <section
        data-viewport-section="Hero"
        className="border-b border-line bg-white"
      >
        <div className="mx-auto max-w-5xl px-5 pt-14 pb-16 sm:px-8 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28">
          <div className="grid gap-12 lg:grid-cols-[1fr_410px] lg:items-center lg:gap-16">
            <div className="space-y-6">
              <h1 className="font-display text-4xl leading-[1.1] font-light tracking-[-0.03em] text-ink sm:text-5xl lg:text-[3.25rem]">
                {PROFILE.heroHeadline}
              </h1>

              <p className="max-w-[50ch] text-base leading-[1.65] font-normal text-ink-soft sm:text-[17px]">
                {PROFILE.heroBio}
              </p>
            </div>

            <HeroAiStudio />
          </div>
        </div>
      </section>

      {/* WORK INDEX: Alabaster gallery ground with generous breathing room */}
      <section
        id="prosjekter"
        data-viewport-section="Prosjekter"
        className="scroll-mt-20 py-20 sm:py-28"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="mb-14 flex items-baseline justify-between gap-4 sm:mb-16">
            <h2 className="font-display text-3xl font-light tracking-[-0.03em] text-ink sm:text-4xl">
              {t.worksTitle}
            </h2>
            <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-muted">
              {String(ITEMS.length).padStart(2, "0")}
            </span>
          </div>

          <div className="grid items-start gap-x-10 gap-y-16 md:grid-cols-2 lg:gap-x-12 lg:gap-y-20">
            {ITEMS.map((item, idx) => (
              <ProjectCard
                key={item.slug}
                item={item}
                priority={idx < 2}
                open={Boolean(openSlugs[item.slug]) || spotlightSlug === item.slug}
                spotlit={spotlightSlug === item.slug}
                onToggle={toggleDetails}
                onAsk={askAboutProject}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const HeroAiStudio = memo(function HeroAiStudio() {
  const {
    messages,
    mood,
    isStreaming,
    voiceEnabled,
    setVoiceEnabled,
    voiceCapped,
    resetChat,
    setHeroAvatarSlot,
  } = useCompanion();
  const { ui, profile: PROFILE } = useLocalizedData();
  const [infoPinned, setInfoPinned] = useState(false);
  const [infoHovered, setInfoHovered] = useState(false);
  const infoOpen = infoPinned || infoHovered;
  const infoRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openHover = useCallback(() => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setInfoHovered(true);
  }, []);

  const closeHoverSoon = useCallback(() => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setInfoHovered(false);
    }, 110);
  }, []);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!infoPinned) return;
    const onPointerDown = (e: PointerEvent) => {
      if (infoRef.current && !infoRef.current.contains(e.target as Node)) {
        setInfoPinned(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setInfoPinned(false);
        setInfoHovered(false);
      }
    };
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [infoPinned]);

  return (
    <div
      id="hero-ai-studio"
      className="relative hidden overflow-hidden rounded-md border border-line bg-[#f7f7f7] text-ink lg:block"
    >
      <div
        ref={infoRef}
        className="relative z-30 flex items-center justify-between gap-2 border-b border-line bg-white px-4 py-2.5"
      >
        <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
          {isStreaming ? ui.chat.thinking : ui.moods[mood]}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") openHover();
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") closeHoverSoon();
            }}
            onClick={() =>
              setInfoPinned((prev) => {
                const next = !prev;
                if (!next) setInfoHovered(false);
                return next;
              })
            }
            aria-label={ui.chat.aboutAiLabel}
            aria-expanded={infoOpen}
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-line font-mono text-[11px] font-medium leading-none text-ink-soft transition-colors hover:border-ink hover:text-ink cursor-pointer"
          >
            ?
          </button>

          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={ui.chat.sound}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors cursor-pointer ${
              voiceEnabled
                ? "bg-ink/8 text-ink font-medium"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            {voiceEnabled ? (
              <Volume2 className="h-3.5 w-3.5" />
            ) : (
              <VolumeX className="h-3.5 w-3.5" />
            )}
            <span>{ui.chat.sound}</span>
          </button>

          {messages.length > 0 && (
            <button
              type="button"
              onClick={resetChat}
              title={ui.chat.clear}
              aria-label={ui.chat.clear}
              className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/6 hover:text-ink cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <Link
            href="/chat"
            title={ui.chat.fullStudio}
            aria-label={ui.chat.fullStudio}
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:bg-ink/6 hover:text-ink"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Link>
        </div>

        {infoOpen && (
          <div
            role="tooltip"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") openHover();
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") closeHoverSoon();
            }}
            className="absolute inset-x-3 top-full z-40 pt-2 sm:left-auto sm:right-3 sm:w-72"
          >
            <p className="rounded-md border border-line bg-white p-3.5 text-xs leading-relaxed text-ink-soft shadow-lg">
              {ui.chat.disclaimerPrefix}
              <a
                href={`mailto:${PROFILE.email}`}
                className="font-medium text-ink underline decoration-ink/35 underline-offset-3 hover:decoration-ink"
              >
                {ui.chat.disclaimerLink}
              </a>
              {ui.chat.disclaimerSuffix}{" "}
              <Link
                href="/personvern"
                className="font-medium text-ink underline decoration-ink/35 underline-offset-3 hover:decoration-ink"
              >
                {ui.chat.privacyLinkLabel}
              </Link>
              .
            </p>
          </div>
        )}
      </div>

      <div className="relative h-[265px] w-full sm:h-[290px]">
        <div ref={setHeroAvatarSlot} className="absolute inset-0" />
      </div>

      <div className="relative z-20 border-t border-line bg-white">
        {voiceCapped && voiceEnabled && (
          <p className="border-b border-amber-500/25 bg-amber-50 px-4 py-1.5 text-xs text-amber-800">
            {ui.chat.capped}
          </p>
        )}
        <ChatThread compact className="max-h-64 px-4 pt-3 pb-2" />
        <div className="px-4 pt-1.5 pb-3.5">
          <Composer inputId="hero-chat-input" />
        </div>
      </div>
    </div>
  );
});
