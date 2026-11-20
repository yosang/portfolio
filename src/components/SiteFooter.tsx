"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useLocalizedData } from "@/lib/i18n";

export function SiteFooter() {
  const pathname = usePathname();
  const { ui: UI, profile: PROFILE, locale } = useLocalizedData();

  if (pathname === "/chat") return null;

  const isAbout = pathname === "/about";
  const nextEyebrow =
    locale === "en" ? "NEXT" : "NESTE";
  const nextTitle = isAbout
    ? locale === "en"
      ? "See selected work"
      : "Se utvalgte prosjekter"
    : locale === "en"
      ? "Let's talk or test the AI twin"
      : "Ta en prat eller test AI-tvillingen";
  const nextHref = isAbout ? "/#prosjekter" : "/chat";

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="mx-auto max-w-5xl px-5 pt-20 pb-14 sm:px-8 sm:pt-28 sm:pb-16">
        <Link
          href={nextHref}
          className="group block border-b border-white/12 pb-16 sm:pb-20"
        >
          <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            {nextEyebrow}
          </span>
          <div className="mt-4 flex items-center justify-between gap-6">
            <span className="font-display text-3xl font-light tracking-[-0.03em] text-white transition-opacity group-hover:opacity-75 sm:text-5xl">
              {nextTitle}
            </span>
            <ArrowRight className="h-7 w-7 shrink-0 text-white/70 transition-transform duration-300 group-hover:translate-x-1.5 group-hover:text-white sm:h-9 sm:w-9" />
          </div>
        </Link>

        <dl className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {UI.colophon.items.map((entry) => (
            <div key={entry.label} className="space-y-1.5">
              <dt className="font-mono text-[11px] uppercase tracking-[0.08em] text-white/45">
                {entry.label}
              </dt>
              <dd className="text-sm leading-relaxed text-white/85">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/12 pt-7 text-xs text-white/50 sm:flex-row sm:items-baseline sm:gap-8">
          <p className="max-w-2xl leading-relaxed">
            {UI.colophon.copyright}
          </p>

          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <li>
              <Link
                href="/personvern"
                className="text-xs font-medium text-white/80 transition-colors hover:text-white"
              >
                {UI.chat.privacyLinkLabel}
              </Link>
            </li>
            {PROFILE.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel={s.href.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-1 text-xs font-medium text-white/80 transition-colors hover:text-white"
                >
                  <span>{s.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
