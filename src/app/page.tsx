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
import { AvatarStage } from "@/components/AvatarStage";
import { ChatThread, Composer } from "@/components/ChatThread";
import { ProjectCard } from "@/components/ProjectCard";
import { useLocalizedData } from "@/lib/i18n";

type FilterMode = "all" | "independent" | "school";

export default function HomePage() {
  const { spotlightSlug, clearSpotlight, sendMessage, setIsOpen } = useCompanionPortfolio();
  const {
    ui: UI,
    profile: PROFILE,
    projects: ITEMS,
    independentProjects: INDEPENDENT_PROJECTS,
    schoolProjects: SCHOOL_PROJECTS,
  } = useLocalizedData();
  const t = UI.home;

  const [filter, setFilter] = useState<FilterMode>("all");
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

  const spotlitItem = spotlightSlug
    ? ITEMS.find((i) => i.slug === spotlightSlug)
    : undefined;
  const effectiveFilter: FilterMode =
    spotlitItem && filter !== "all" && spotlitItem.category !== filter
      ? "all"
      : filter;

  const showIndependent =
    effectiveFilter === "all" || effectiveFilter === "independent";
  const showSchool = effectiveFilter === "all" || effectiveFilter === "school";

  return (
    <div className="page-enter">
      {/* HERO: Clean, low-noise intro + desktop 3D AI Twin Studio */}
      <section
        data-viewport-section="Hero"
        className="mx-auto max-w-5xl px-4 pt-8 pb-12 sm:px-6 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-14">
          <div className="space-y-5">
            <h1 className="font-display text-4xl font-normal tracking-[-0.03em] text-ink sm:text-5xl">
              {PROFILE.heroHeadline}
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-ink-soft">
              {PROFILE.heroBio}
            </p>
          </div>

          <HeroAiStudio />
        </div>
      </section>

      {/* WORK INDEX: Minimal header, zero eyebrows, clean 2-col stages */}
      <section
        id="prosjekter"
        data-viewport-section="Prosjekter"
        className="scroll-mt-24 border-t border-line py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-normal tracking-[-0.025em] sm:text-3xl">
              {t.worksTitle}
            </h2>

            <div
              role="tablist"
              aria-label={t.worksTitle}
              className="inline-flex items-center rounded-full border border-line bg-paper-raised p-1"
            >
              {(
                [
                  { id: "all", label: t.filterAll },
                  { id: "independent", label: t.filterIndependent },
                  { id: "school", label: t.filterSchool },
                ] as const
              ).map((tab) => {
                const active = effectiveFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setFilter(tab.id)}
                    className={`rounded-full px-3.5 py-1 text-xs font-medium transition-colors cursor-pointer ${
                      active ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {showIndependent && (
            <div>
              {showSchool && (
                <h3 className="mb-6 font-display text-lg font-medium tracking-[-0.015em] text-ink">
                  {t.filterIndependent}
                </h3>
              )}
              <div className="grid items-start gap-x-8 gap-y-12 md:grid-cols-2">
                {INDEPENDENT_PROJECTS.map((item, idx) => (
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
          )}

          {showSchool && (
            <div className={showIndependent ? "mt-16 border-t border-line pt-14" : ""}>
              {showIndependent && (
                <h3 className="mb-6 font-display text-lg font-medium tracking-[-0.015em] text-ink">
                  {t.filterSchool}
                </h3>
              )}

              <div className="grid items-start gap-x-8 gap-y-12 md:grid-cols-2">
                {SCHOOL_PROJECTS.map((item) => (
                  <ProjectCard
                    key={item.slug}
                    item={item}
                    priority={!showIndependent}
                    open={Boolean(openSlugs[item.slug]) || spotlightSlug === item.slug}
                    spotlit={spotlightSlug === item.slug}
                    onToggle={toggleDetails}
                    onAsk={askAboutProject}
                  />
                ))}
              </div>
            </div>
          )}
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
  } = useCompanion();
  const { ui, profile: PROFILE } = useLocalizedData();
  const [isDesktop, setIsDesktop] = useState(false);
  const [infoPinned, setInfoPinned] = useState(false);
  const [infoHovered, setInfoHovered] = useState(false);
  const infoOpen = infoPinned || infoHovered;
  const infoRef = useRef<HTMLDivElement | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
      className="relative hidden overflow-hidden rounded-2xl border border-white/12 bg-[#17211e] text-[#f7f8f8] shadow-[0_8px_28px_rgba(10,18,15,0.22)] lg:block"
    >
      <div
        ref={infoRef}
        className="relative z-30 flex items-center justify-between gap-2 border-b border-white/10 bg-[#141d1a] px-4 py-2.5"
      >
        <span className="text-xs text-[#9ca0a8]">
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
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 font-mono text-[11px] font-medium leading-none text-[#9ca0a8] transition-colors hover:border-white/45 hover:text-white cursor-pointer"
          >
            ?
          </button>

          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={ui.chat.sound}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors cursor-pointer ${
              voiceEnabled
                ? "bg-white/12 text-[#f7f8f8]"
                : "text-[#9ca0a8] hover:text-white"
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
              className="rounded-full p-1.5 text-[#9ca0a8] transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <Link
            href="/chat"
            title={ui.chat.fullStudio}
            aria-label={ui.chat.fullStudio}
            className="rounded-full p-1.5 text-[#9ca0a8] transition-colors hover:bg-white/10 hover:text-white"
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
            <p className="rounded-xl border border-white/15 bg-[#17211e]/98 p-3 text-xs leading-relaxed text-[#f7f8f8] shadow-xl backdrop-blur-md">
              {ui.chat.disclaimerPrefix}
              <a
                href={`mailto:${PROFILE.email}`}
                className="font-medium text-white underline decoration-white/40 underline-offset-3 hover:decoration-white"
              >
                {ui.chat.disclaimerLink}
              </a>
              {ui.chat.disclaimerSuffix}{" "}
              <Link
                href="/personvern"
                className="font-medium text-white underline decoration-white/40 underline-offset-3 hover:decoration-white"
              >
                {ui.chat.privacyLinkLabel}
              </Link>
              .
            </p>
          </div>
        )}
      </div>

      <div className="relative h-[265px] w-full sm:h-[290px]">
        <div className="absolute inset-0">
          {isDesktop && (
            <AvatarStage mood={mood} variant="hero" className="h-full w-full" />
          )}
        </div>
      </div>

      <div className="relative z-20 border-t border-white/10 bg-[#141d1a]">
        {voiceCapped && voiceEnabled && (
          <p className="border-b border-white/10 px-4 py-1.5 text-xs text-amber-300">
            {ui.chat.capped}
          </p>
        )}
        <ChatThread tone="dark" compact className="max-h-64 px-4 pt-3 pb-2" />
        <div className="px-4 pt-1.5 pb-3.5">
          <Composer tone="dark" inputId="hero-chat-input" />
        </div>
      </div>
    </div>
  );
});
