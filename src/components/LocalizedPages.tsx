"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocalizedData } from "@/lib/i18n";
import { ProjectMedia } from "@/components/ProjectMedia";
import { CaseStudyAskButton } from "@/components/CaseStudyAskButton";

export function AboutPageContent() {
  const { ui: UI, profile: PROFILE } = useLocalizedData();
  const t = UI.about;

  return (
    <article
      data-viewport-section="About"
      className="page-enter mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6 md:py-20"
    >
      <section className="space-y-5">
        <h1 className="font-display text-3xl font-normal tracking-[-0.03em] sm:text-4xl">
          {t.heading}
        </h1>
        <div className="space-y-4 text-base leading-relaxed text-ink/90">
          {PROFILE.about.paragraphs.map((segments, idx) => (
            <p key={idx}>
              {segments.map((seg, i) =>
                typeof seg === "string" ? (
                  <React.Fragment key={i}>{seg}</React.Fragment>
                ) : (
                  <a
                    key={i}
                    href={seg.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-baseline gap-0.5 font-medium text-ink underline decoration-ink/35 underline-offset-4 transition-opacity hover:opacity-75 hover:decoration-ink"
                  >
                    <span>{seg.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0 self-center opacity-75" />
                  </a>
                )
              )}
            </p>
          ))}
        </div>
      </section>

      <section className="space-y-5 border-t border-line pt-10">
        <h2 className="font-display text-xl font-normal tracking-[-0.02em]">
          {t.toolkit}
        </h2>
        <dl className="grid gap-6 sm:grid-cols-3">
          {PROFILE.about.stackGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <dt className="text-sm font-semibold text-ink">{group.label}</dt>
              {group.items.map((item) => (
                <dd key={item} className="font-mono text-xs leading-relaxed text-ink-soft">
                  {item}
                </dd>
              ))}
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-10">
        <p className="font-display text-lg font-medium">{t.ctaTitle}</p>
        <Link
          href="/chat"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          <span>{t.ctaButton}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}

export function AiPageContent() {
  const { aiPage: t } = useLocalizedData();

  return (
    <article
      data-viewport-section="AI"
      className="page-enter mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6 md:py-20"
    >
      <section className="space-y-5">
        <h1 className="font-display text-3xl font-normal tracking-[-0.03em] text-ink sm:text-4xl">
          {t.title}
        </h1>
        <div className="space-y-4 text-base leading-relaxed text-ink/90 sm:text-lg">
          {t.lead.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="ai-shift-heading"
        className="overflow-hidden rounded-2xl border border-white/12 bg-[#17211e] p-6 text-[#f7f8f8] shadow-[0_8px_28px_rgba(10,18,15,0.18)] sm:p-8"
      >
        <h2
          id="ai-shift-heading"
          className="font-display text-xl font-normal tracking-[-0.02em] text-white"
        >
          {t.shift.heading}
        </h2>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-400">
              <span>{t.shift.beforeLabel}</span>
              <span>100 %</span>
            </div>
            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-white/5 p-0.5 gap-1">
              {t.shift.before.map((seg) => (
                <div
                  key={seg.label}
                  style={{ width: `${seg.pct}%` }}
                  className={`${seg.tone} h-full rounded-full`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-400">
              {t.shift.before.map((seg) => (
                <span key={seg.label} className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-[2px] ${seg.tone}`} />
                  <span>
                    {seg.label} ({seg.pct} %)
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono text-xs text-zinc-200">
              <span className="font-semibold text-white">{t.shift.withAiLabel}</span>
              <span>100 %</span>
            </div>
            <div className="flex h-3.5 w-full overflow-hidden rounded-full bg-white/5 p-0.5 gap-1">
              {t.shift.withAi.map((seg) => (
                <div
                  key={seg.label}
                  style={{ width: `${seg.pct}%` }}
                  className={`${seg.tone} h-full rounded-full`}
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-zinc-300">
              {t.shift.withAi.map((seg) => (
                <span key={seg.label} className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-[2px] ${seg.tone}`} />
                  <span>
                    {seg.label} ({seg.pct} %)
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 border-t border-white/10 pt-5 text-sm leading-relaxed text-zinc-300">
          {t.shift.caption}
        </p>
      </section>

      <section className="space-y-6 border-t border-line pt-10">
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-normal tracking-[-0.025em] text-ink">
            {t.principlesHeading}
          </h2>
          <p className="text-base leading-relaxed text-ink-soft">
            {t.principlesIntro}
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {t.principles.map((item) => (
            <div
              key={item.title}
              className="flex flex-col justify-between rounded-xl border border-line bg-paper-raised p-5 gap-3"
            >
              <div className="space-y-2.5">
                <h3 className="font-display text-base font-medium tracking-[-0.015em] text-ink">
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </p>
              </div>
              {"link" in item && item.link && (
                <a
                  href={item.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 self-start text-xs font-medium text-ink underline underline-offset-4 hover:opacity-75"
                >
                  <span>{item.link.label}</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-normal tracking-[-0.025em] text-ink">
          {t.portfolioStance.heading}
        </h2>
        <div className="space-y-4 text-base leading-relaxed text-ink/90">
          {t.portfolioStance.paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
        <p className="pt-1 text-xs text-ink-soft">
          {t.portfolioStance.referencePrefix}{" "}
          <a
            href={t.portfolioStance.referenceHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-ink underline underline-offset-4 hover:opacity-75"
          >
            <span>{t.portfolioStance.referenceLabel}</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
          .
        </p>
      </section>

      <section className="space-y-6 border-t border-line pt-10">
        <h2 className="font-display text-2xl font-normal tracking-[-0.025em] text-ink">
          {t.practiceHeading}
        </h2>
        <div className="divide-y divide-line border-y border-line">
          {t.practices.map((p) => {
            const external = p.href.startsWith("http");
            return (
              <div key={p.project} className="py-5 space-y-1.5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  {external ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-display text-base font-semibold text-ink hover:underline underline-offset-4"
                    >
                      <span>{p.project}</span>
                      <ArrowUpRight className="h-4 w-4 text-ink-soft" />
                    </a>
                  ) : (
                    <Link
                      href={p.href}
                      className="inline-flex items-center gap-1 font-display text-base font-semibold text-ink hover:underline underline-offset-4"
                    >
                      <span>{p.project}</span>
                      <ArrowUpRight className="h-4 w-4 text-ink-soft" />
                    </Link>
                  )}
                  <span className="font-mono text-xs text-ink-soft">
                    {p.status}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-6 pt-2">
        <p className="text-xs text-ink-soft">
          {t.creditPrefix}{" "}
          <a
            href={t.creditHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-0.5 font-medium text-ink underline underline-offset-4 hover:opacity-75"
          >
            <span>{t.creditName}</span>
            <ArrowUpRight className="h-3 w-3" />
          </a>
          .
        </p>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
          <p className="font-display text-lg font-medium text-ink">
            {t.ctaTitle}
          </p>
          <Link
            href="/chat"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-opacity hover:opacity-90"
          >
            <span>{t.ctaButton}</span>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </article>
  );
}

export function PrivacyPageContent() {
  const { ui: UI, profile: PROFILE } = useLocalizedData();
  const t = UI.privacy;

  return (
    <article
      data-viewport-section="Personvern"
      className="page-enter mx-auto max-w-3xl space-y-12 px-4 py-14 sm:px-6 md:py-20"
    >
      <section className="space-y-4">
        <h1 className="font-display text-3xl font-normal tracking-[-0.03em] text-ink sm:text-4xl">
          {t.heading}
        </h1>
        <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
          {t.lead}
        </p>
      </section>

      <section className="divide-y divide-line border-y border-line">
        {t.sections.map((sec) => (
          <div key={sec.title} className="space-y-2.5 py-6">
            <h2 className="font-display text-lg font-medium tracking-[-0.015em] text-ink">
              {sec.title}
            </h2>
            <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
              {sec.body}
            </p>
            {"bullets" in sec && sec.bullets && (
              <ul className="space-y-1.5 pt-1 text-sm leading-relaxed text-ink-soft">
                {sec.bullets.map((b) => (
                  <li key={b} className="font-mono text-xs sm:text-[13px]">
                    · {b}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      <section className="flex flex-wrap items-center justify-between gap-4 pt-2 text-sm text-ink-soft">
        <p>
          {t.contactPrefix}{" "}
          <a
            href={`mailto:${PROFILE.email}`}
            className="font-medium text-ink underline underline-offset-4 hover:opacity-75"
          >
            {PROFILE.email}
          </a>
          .
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1 font-medium text-ink underline underline-offset-4 hover:opacity-75"
        >
          <span>{t.backHome}</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </section>
    </article>
  );
}

export function ProjectCaseStudyContent({ slug }: { slug: string }) {
  const { ui: UI, projects: PROJECTS } = useLocalizedData();
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return null;

  const t = UI.home;
  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug);
  const prevProject =
    currentIndex > 0 ? PROJECTS[currentIndex - 1] : PROJECTS[PROJECTS.length - 1];
  const nextProject =
    currentIndex < PROJECTS.length - 1 ? PROJECTS[currentIndex + 1] : PROJECTS[0];

  const { caseStudy } = project;
  const firstTwoSections = caseStudy.sections.slice(0, 2);
  const remainingSections = caseStudy.sections.slice(2);

  return (
    <article
      data-viewport-section={`Prosjekt: ${project.title}`}
      className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-16"
    >
      <div className="mb-8">
        <Link
          href="/#prosjekter"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{t.backToProjects}</span>
        </Link>
      </div>

      <header className="space-y-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-paper-subtle px-2.5 py-1 font-mono text-xs font-medium text-ink">
            {project.category === "independent"
              ? t.categoryIndependent
              : t.categorySchool}
          </span>
          <span className="rounded-md bg-paper-subtle px-2.5 py-1 font-mono text-xs text-ink-soft">
            {project.year}
          </span>
          {project.tags
            .filter((tag) => tag !== project.year)
            .map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-line px-2.5 py-0.5 font-mono text-xs text-ink-soft"
              >
                {tag}
              </span>
            ))}
        </div>

        <h1 className="font-display text-3xl font-normal tracking-[-0.03em] text-ink sm:text-5xl">
          {project.title}
        </h1>

        <p className="max-w-[64ch] text-lg leading-relaxed text-ink-soft">
          {caseStudy.intro}
        </p>

        <div className="surface-card grid gap-4 rounded-xl p-4 sm:grid-cols-2 sm:px-5 sm:py-4">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
              {t.roleLabel}
            </div>
            <div className="mt-1 text-sm font-medium text-ink">
              {caseStudy.role}
            </div>
          </div>
          <div>
            <div className="font-mono text-[11px] uppercase tracking-wider text-ink-soft">
              {t.statusLabel}
            </div>
            <div className="mt-1 text-sm font-medium text-ink">
              {caseStudy.status}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-medium text-paper transition-opacity hover:opacity-88"
            >
              <span>{t.openLive}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}

          {project.repoUrl && (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-ink/35"
            >
              <span>{t.openCode}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}

          <CaseStudyAskButton title={project.title} />
        </div>

        {project.repoNote && (
          <p className="text-xs leading-relaxed text-ink-soft">
            {project.repoNote}
          </p>
        )}
      </header>

      <div className="mt-10 sm:mt-12">
        <ProjectMedia item={project} priority linkToCase={false} fullWidth />
      </div>

      <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-14">
        {firstTwoSections.map((sec) => (
          <CaseSection key={sec.title} section={sec} />
        ))}
      </div>

      {caseStudy.mobileGallery && caseStudy.mobileGallery.length > 0 && (
        <figure className="mt-12 sm:mt-16">
          <div className="rounded-2xl border border-line bg-[#17211e] p-4 sm:p-8">
            <div className="grid gap-5 sm:grid-cols-3 sm:gap-6">
              {caseStudy.mobileGallery.map((img) => (
                <div key={img.src} className="space-y-2.5">
                  <div className="overflow-hidden rounded-xl border border-white/14 bg-[#0d1017] shadow-lg">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes="(min-width: 1024px) 310px, (min-width: 640px) 30vw, 92vw"
                      className="h-auto w-full object-cover select-none"
                    />
                  </div>
                  <p className="px-0.5 text-xs leading-relaxed text-[#9ca0a8]">
                    {img.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </figure>
      )}

      {remainingSections.length > 0 && (
        <div className="mt-12 space-y-12 sm:mt-16 sm:space-y-14">
          {remainingSections.map((sec, idx) => (
            <div key={sec.title} className="space-y-12 sm:space-y-14">
              <CaseSection section={sec} />

              {idx === 1 && caseStudy.wideImage && (
                <figure className="space-y-3">
                  <div className="overflow-hidden rounded-2xl border border-line bg-[#17211e] p-3 sm:p-6">
                    <div className="overflow-hidden rounded-xl border border-white/14">
                      <Image
                        src={caseStudy.wideImage.src}
                        alt={caseStudy.wideImage.alt}
                        width={caseStudy.wideImage.width}
                        height={caseStudy.wideImage.height}
                        sizes="(min-width: 1024px) 980px, 96vw"
                        className="h-auto w-full object-cover select-none"
                      />
                    </div>
                  </div>
                  <figcaption className="px-1 text-xs leading-relaxed text-ink-soft">
                    {caseStudy.wideImage.caption}
                  </figcaption>
                </figure>
              )}
            </div>
          ))}
        </div>
      )}

      <nav
        aria-label={t.moreProjects}
        className="mt-16 grid gap-4 border-t border-line pt-10 sm:mt-20 sm:grid-cols-2"
      >
        <Link
          href={`/prosjekter/${prevProject.slug}`}
          className="surface-card group flex flex-col justify-between rounded-xl p-5 transition-colors hover:border-ink/30"
        >
          <span className="inline-flex items-center gap-1 font-mono text-xs text-ink-soft">
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            <span>{t.prevProject}</span>
          </span>
          <span className="mt-2 font-display text-lg font-medium text-ink">
            {prevProject.title}
          </span>
          <span className="mt-0.5 text-xs text-ink-soft line-clamp-1">
            {prevProject.subtitle}
          </span>
        </Link>

        <Link
          href={`/prosjekter/${nextProject.slug}`}
          className="surface-card group flex flex-col justify-between rounded-xl p-5 text-left transition-colors hover:border-ink/30 sm:items-end sm:text-right"
        >
          <span className="inline-flex items-center gap-1 font-mono text-xs text-ink-soft">
            <span>{t.nextProject}</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="mt-2 font-display text-lg font-medium text-ink">
            {nextProject.title}
          </span>
          <span className="mt-0.5 text-xs text-ink-soft line-clamp-1">
            {nextProject.subtitle}
          </span>
        </Link>
      </nav>
    </article>
  );
}

function CaseSection({
  section,
}: {
  section: { title: string; paragraphs: string[]; bullets?: string[] };
}) {
  return (
    <section className="max-w-3xl space-y-4">
      <h2 className="font-display text-xl font-medium tracking-[-0.02em] text-ink sm:text-2xl">
        {section.title}
      </h2>

      <div className="space-y-4 text-base leading-relaxed text-ink-soft">
        {section.paragraphs.map((p, i) => (
          <p key={i} className="max-w-[64ch]">
            {p}
          </p>
        ))}
      </div>

      {section.bullets && section.bullets.length > 0 && (
        <ul className="surface-card mt-4 space-y-2.5 rounded-xl p-5 text-sm text-ink-soft">
          {section.bullets.map((b, i) => {
            const colonIdx = b.indexOf(":");
            const hasLabel = colonIdx > 0 && colonIdx <= 44;
            return (
              <li key={i} className="leading-relaxed">
                ·{" "}
                {hasLabel ? (
                  <>
                    <span className="font-medium text-ink">
                      {b.slice(0, colonIdx + 1)}
                    </span>
                    {b.slice(colonIdx + 1)}
                  </>
                ) : (
                  b
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
