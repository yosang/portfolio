"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { ProjectItem } from "@/data/projects";
import { useLocalizedData } from "@/lib/i18n";
import { ProjectMedia } from "@/components/ProjectMedia";

export interface ProjectCardProps {
  item: ProjectItem;
  priority?: boolean;
  open: boolean;
  spotlit: boolean;
  onToggle: (slug: string) => void;
  onAsk: (prompt: string) => void;
}

export const ProjectCard = memo(function ProjectCard({
  item,
  priority = false,
  open,
  spotlit,
  onToggle,
  onAsk,
}: ProjectCardProps) {
  const { ui: UI } = useLocalizedData();
  const t = UI.home;
  const panelId = `work-${item.slug}`;
  const caseHref = `/prosjekter/${item.slug}`;

  const stackLabel = item.tags
    .filter((tag) => tag !== item.year)
    .slice(0, 3)
    .join(", ");

  return (
    <article
      data-project-slug={item.slug}
      data-spotlit={spotlit ? "true" : undefined}
      data-viewport-item={`${item.title} (${item.subtitle})`}
      className="work-card group scroll-mt-24"
    >
      <ProjectMedia item={item} priority={priority} />

      <div className="mt-4 space-y-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-xl font-normal tracking-[-0.02em] text-ink">
            <Link
              href={caseHref}
              className="transition-opacity hover:opacity-65"
            >
              {item.title}
            </Link>
          </h3>

          <div className="flex shrink-0 items-center gap-3.5 text-xs text-ink-muted">
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-0.5 transition-colors hover:text-ink"
              >
                <span>{t.live}</span>
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

        <Link
          href={caseHref}
          className="block text-sm leading-relaxed text-ink-soft transition-colors hover:text-ink"
        >
          {item.subtitle}
        </Link>

        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-2.5 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
          <span>{item.year}</span>
          <span className="truncate text-right">{stackLabel}</span>
        </div>
      </div>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,margin] duration-200 ease-out ${
          open
            ? "mt-4 grid-rows-[1fr]"
            : "mt-0 grid-rows-[0fr] pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`space-y-4 rounded-sm border bg-paper-raised p-5 text-sm transition-colors duration-200 ${
              spotlit ? "border-ink" : "border-line"
            }`}
          >
            <p className="leading-[1.65] text-ink-soft">{item.summary}</p>

            <dl className="grid gap-3 border-t border-line pt-3.5 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  {t.roleLabel}
                </dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-ink">
                  {item.caseStudy.role}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-muted">
                  {t.statusLabel}
                </dt>
                <dd className="mt-0.5 text-xs leading-relaxed text-ink">
                  {item.caseStudy.status}
                </dd>
              </div>
            </dl>

            {item.repoNote && (
              <p className="border-t border-line pt-3 text-xs leading-relaxed text-ink-muted">
                {item.repoNote}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3">
              <div className="flex items-center gap-4">
                {item.repoUrl && (
                  <a
                    href={item.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    tabIndex={open ? undefined : -1}
                    className="inline-flex items-center gap-0.5 text-xs font-medium text-ink-soft underline underline-offset-4 transition-colors hover:text-ink"
                  >
                    <span>{t.source}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </a>
                )}
                <button
                  type="button"
                  tabIndex={open ? undefined : -1}
                  onClick={() => onAsk(t.askAboutPrompt(item.title))}
                  className="text-xs font-medium text-ink-soft underline underline-offset-4 transition-colors hover:text-ink cursor-pointer"
                >
                  {t.askAbout}
                </button>
              </div>
              <Link
                href={caseHref}
                tabIndex={open ? undefined : -1}
                className="text-xs font-medium text-ink underline underline-offset-4 hover:opacity-75"
              >
                {t.readCaseStudy} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
