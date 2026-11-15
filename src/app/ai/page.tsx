import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AI_PAGE } from "@/data/ai";

export const metadata: Metadata = {
  title: AI_PAGE.title,
  description:
    "Hvordan jeg jobber med arkitektur, Spike and Stabilize, slank kontekst og testing når jeg bruker AI i programvareutvikling.",
  alternates: { canonical: "/ai" },
};

export default function AiTransparencyPage() {
  const t = AI_PAGE;

  return (
    <article
      data-viewport-section="AI"
      className="page-enter mx-auto max-w-3xl space-y-14 px-4 py-14 sm:px-6 md:py-20"
    >
      {/* Intro */}
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

      {/* Visual Time-Shift Card (Without AI vs With AI) */}
      <section
        aria-labelledby="ai-shift-heading"
        className="overflow-hidden rounded-2xl border border-[#a5b9b2]/20 bg-[#17211e] p-6 text-[#edf4f2] shadow-[0_8px_28px_rgba(10,18,15,0.18)] sm:p-8"
      >
        <h2
          id="ai-shift-heading"
          className="font-display text-xl font-normal tracking-[-0.02em] text-white"
        >
          {t.shift.heading}
        </h2>

        <div className="mt-6 space-y-6">
          {/* Before */}
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

          {/* With AI */}
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

      {/* Guiding Principles */}
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

      {/* Portfolio curation & craft stance */}
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

      {/* Concrete traces in projects */}
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

      {/* Credit + CTA */}
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
