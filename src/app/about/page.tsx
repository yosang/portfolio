import type { Metadata } from "next";
import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";

export const metadata: Metadata = {
  title: UI.about.heading,
  description:
    "Bakgrunn, utdanning i backend og frontend ved Noroff School of Technology and Digital Media, arbeid med Ember Booking og verktøykasse.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
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
                    className="inline-flex items-baseline gap-0.5 font-medium text-ink underline decoration-ink/35 underline-offset-4 transition-colors hover:text-trail hover:decoration-trail"
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
