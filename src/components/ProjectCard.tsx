"use client";

import React, { memo } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import type { ProjectItem } from "@/data/projects";
import { UI } from "@/data/ui";
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
  const t = UI.home;
  const panelId = `work-${item.slug}`;
  const caseHref = `/prosjekter/${item.slug}`;

  return (
    <article
      data-project-slug={item.slug}
      data-spotlit={spotlit ? "true" : undefined}
      data-viewport-item={`${item.title} (${item.subtitle})`}
      className="work-card group scroll-mt-24"
    >
      <ProjectMedia item={item} priority={priority} />

      <div className="mt-3.5 space-y-1 px-0.5">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-lg font-medium tracking-[-0.015em] text-ink">
            <Link
              href={caseHref}
              className="transition-opacity hover:opacity-75"
            >
              {item.title}
            </Link>
          </h3>

          <div className="flex shrink-0 items-center gap-3 text-xs font-medium text-ink-soft">
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
            {item.repoUrl && (
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

        <Link
          href={caseHref}
          className="block text-sm leading-relaxed text-ink-soft transition-colors hover:text-ink"
        >
          {item.subtitle}
        </Link>
      </div>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows,margin] duration-200 ease-out ${
          open
            ? "mt-3.5 grid-rows-[1fr]"
            : "mt-0 grid-rows-[0fr] pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <div
            className={`space-y-3 rounded-xl border bg-paper-raised p-4 text-sm transition-colors duration-200 ${
              spotlit ? "border-trail/65" : "border-line"
            }`}
          >
            <p className="leading-relaxed text-ink">{item.summary}</p>
            <ul className="space-y-1.5 text-ink-soft">
              {item.highlights.map((h, i) => {
                const colonIdx = h.indexOf(":");
                const hasLabel = colonIdx > 0 && colonIdx <= 24;
                return (
                  <li key={i} className="leading-relaxed">
                    ·{" "}
                    {hasLabel ? (
                      <>
                        <span className="font-medium text-ink">
                          {h.slice(0, colonIdx + 1)}
                        </span>
                        {h.slice(colonIdx + 1)}
                      </>
                    ) : (
                      h
                    )}
                  </li>
                );
              })}
            </ul>
            {item.repoNote && (
              <p className="border-t border-line pt-2.5 text-xs leading-relaxed text-ink-soft">
                {item.repoNote}
              </p>
            )}
            {item.aiNote && (
              <p className="border-t border-line pt-2.5 text-xs leading-relaxed text-ink-soft">
                {item.aiNote}{" "}
                <Link
                  href="/ai"
                  tabIndex={open ? undefined : -1}
                  className="font-medium text-ink underline underline-offset-4 hover:opacity-75"
                >
                  {t.readAiWorkflow} →
                </Link>
              </p>
            )}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
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
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  tabIndex={open ? undefined : -1}
                  onClick={() => onAsk(t.askAboutPrompt(item.title))}
                  className="text-xs font-medium text-ink-soft underline underline-offset-4 transition-colors hover:text-ink cursor-pointer"
                >
                  {t.askAbout}
                </button>
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
      </div>
    </article>
  );
});
