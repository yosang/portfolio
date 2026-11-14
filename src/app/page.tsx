"use client";

import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  Maximize2,
  RotateCcw,
  Volume2,
  VolumeX,
} from "lucide-react";
import { ITEMS, PROFILE, type IndexItem } from "@/data/portfolio";
import { UI } from "@/data/ui";
import { useCompanion, useCompanionPortfolio } from "@/components/CompanionContext";
import { AvatarStage } from "@/components/AvatarStage";
import { ChatThread, Composer } from "@/components/ChatThread";
import { ProjectMedia } from "@/components/ProjectMedia";

type FilterMode = "all" | "independent" | "school";

const INDEPENDENT_ITEMS = ITEMS.filter((i) => i.category === "independent");
const SCHOOL_ITEMS = ITEMS.filter((i) => i.category === "school");

export default function HomePage() {
  const { spotlightSlug, clearSpotlight, sendMessage, setIsOpen } = useCompanionPortfolio();
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
        if (r.bottom > 120 && r.top < window.innerHeight) {
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
      {/* HERO: Clean, low-noise intro + 3D AI Twin Studio */}
      <section
        data-viewport-section="Hero"
        className="mx-auto max-w-5xl px-4 pt-10 pb-20 sm:px-6 md:pt-14 md:pb-24"
      >
        <div className="grid gap-10 lg:grid-cols-[1fr_420px] lg:items-center lg:gap-14">
          <div className="space-y-6">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {PROFILE.heroHeadline}
            </h1>

            <p className="max-w-md text-lg leading-relaxed text-ink-soft">
              {PROFILE.heroBio}
            </p>

            <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-sm font-medium">
              {PROFILE.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-ink-soft transition-colors hover:text-ink"
                  >
                    <span>{s.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </a>
                </li>
              ))}
            </ul>
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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <h2 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
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

          <p className="mb-10 max-w-2xl text-sm leading-relaxed text-ink-soft sm:text-base">
            {t.worksIntro}
          </p>

          {showIndependent && (
            <div>
              {showSchool && (
                <h3 className="mb-6 font-display text-lg font-semibold tracking-tight text-ink">
                  {t.filterIndependent}
                </h3>
              )}
              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                {INDEPENDENT_ITEMS.map((item, idx) => (
                  <WorkShowcaseItem
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
                <h3 className="mb-6 font-display text-lg font-semibold tracking-tight text-ink">
                  {t.filterSchool}
                </h3>
              )}

              <div className="grid gap-x-8 gap-y-12 md:grid-cols-2">
                {SCHOOL_ITEMS.map((item) => (
                  <WorkShowcaseItem
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
  const ui = UI;
  const [infoPinned, setInfoPinned] = useState(false);
  const [infoHovered, setInfoHovered] = useState(false);
  const infoOpen = infoPinned || infoHovered;
  const infoRef = useRef<HTMLDivElement | null>(null);

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
      className="relative overflow-hidden rounded-[24px] border border-white/12 text-white shadow-[0_24px_56px_-18px_rgba(16,17,18,0.34)]"
      style={{
        background:
          "radial-gradient(circle at 18% 14%, rgba(228, 70, 31, 0.2), transparent 48%), radial-gradient(circle at 84% 22%, rgba(128, 201, 255, 0.14), transparent 50%), #212325",
      }}
    >
      <div className="relative z-30 flex items-center justify-between gap-2 border-b border-white/10 bg-[#191b1d] px-4 py-2.5">
        <span className="text-xs text-zinc-400">
          {isStreaming ? ui.chat.thinking : ui.moods[mood]}
        </span>

        <div className="flex items-center gap-1.5">
          <div
            ref={infoRef}
            className="relative flex items-center"
            onPointerEnter={(e) => {
              if (e.pointerType === "mouse") setInfoHovered(true);
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") setInfoHovered(false);
            }}
          >
            <button
              type="button"
              onClick={() =>
                setInfoPinned((prev) => {
                  const next = !prev;
                  if (!next) setInfoHovered(false);
                  return next;
                })
              }
              aria-label={ui.chat.aboutAiLabel}
              aria-expanded={infoOpen}
              className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/20 font-mono text-[11px] font-medium leading-none text-zinc-400 transition-colors hover:border-white/45 hover:text-white cursor-pointer"
            >
              ?
            </button>

            {infoOpen && (
              <div
                role="tooltip"
                className="absolute top-full right-0 pt-2 w-64 sm:w-72"
              >
                <p className="rounded-xl border border-white/14 bg-[#141618]/98 p-3 text-xs leading-relaxed text-zinc-200 shadow-xl backdrop-blur-md">
                  {ui.chat.disclaimerPrefix}
                  <a
                    href={`mailto:${PROFILE.email}`}
                    className="font-medium text-white underline decoration-white/40 underline-offset-3 hover:decoration-white"
                  >
                    {ui.chat.disclaimerLink}
                  </a>
                  {ui.chat.disclaimerSuffix}
                </p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            title={ui.chat.sound}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors cursor-pointer ${
              voiceEnabled
                ? "bg-white/12 text-zinc-100"
                : "text-zinc-400 hover:text-white"
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
              className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}

          <Link
            href="/chat"
            title={ui.chat.fullStudio}
            aria-label={ui.chat.fullStudio}
            className="rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="relative h-[265px] w-full sm:h-[290px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_38%,rgba(255,231,201,0.14),transparent_65%)]"
        />
        <div className="absolute inset-0">
          <AvatarStage mood={mood} variant="hero" className="h-full w-full" />
        </div>
      </div>

      <div className="relative z-20 border-t border-white/10 bg-[#17191b]">
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

const WorkShowcaseItem = memo(function WorkShowcaseItem({
  item,
  priority,
  open,
  spotlit,
  onToggle,
  onAsk,
}: {
  item: IndexItem;
  priority: boolean;
  open: boolean;
  spotlit: boolean;
  onToggle: (slug: string) => void;
  onAsk: (prompt: string) => void;
}) {
  const t = UI.home;
  const panelId = `work-${item.slug}`;

  return (
    <article
      data-project-slug={item.slug}
      data-viewport-item={`${item.title} (${item.subtitle})`}
      className={`work-card group scroll-mt-28 ${
        spotlit ? "rounded-[26px] ring-2 ring-trail ring-offset-6 ring-offset-paper" : ""
      }`}
    >
      <ProjectMedia item={item} priority={priority} />

      <div className="mt-3.5 space-y-1 px-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
            {item.title}
          </h3>

          <div className="flex shrink-0 items-center gap-3 text-xs font-medium text-ink-soft">
            {item.liveUrl && item.repoUrl && (
              <a
                href={item.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 transition-colors hover:text-ink"
              >
                <span>{t.source}</span>
                <ArrowUpRight className="h-3 w-3" />
              </a>
            )}
            <button
              type="button"
              onClick={() => onToggle(item.slug)}
              aria-expanded={open}
              aria-controls={panelId}
              className="inline-flex items-center gap-0.5 transition-colors hover:text-ink cursor-pointer"
            >
              <span>{open ? t.detailsOpen : t.detailsClosed}</span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-ink-soft">{item.subtitle}</p>
      </div>

      <div
        id={panelId}
        inert={!open || undefined}
        className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out ${
          open
            ? "mt-3.5 grid-rows-[1fr] opacity-100"
            : "mt-0 grid-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-3 rounded-xl border border-line bg-paper-raised p-4 text-sm">
            <p className="leading-relaxed text-ink">{item.summary}</p>
            <ul className="space-y-1.5 text-ink-soft">
              {item.highlights.map((h, i) => (
                <li key={i} className="leading-relaxed">
                  · {h}
                </li>
              ))}
            </ul>
            {item.aiNote && (
              <p className="border-t border-line pt-2.5 text-xs leading-relaxed text-ink-soft">
                {item.aiNote}{" "}
                <Link
                  href="/ai"
                  className="font-medium text-ink underline underline-offset-4 hover:text-trail"
                >
                  {t.readAiWorkflow} →
                </Link>
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-paper-subtle px-2 py-0.5 font-mono text-[11px] text-ink-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => onAsk(t.askAboutPrompt(item.title))}
                className="text-xs font-medium text-ink underline underline-offset-4 cursor-pointer"
              >
                {t.askAbout} →
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
