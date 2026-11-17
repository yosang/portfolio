"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useLocalizedData } from "@/lib/i18n";

export function SiteFooter() {
  const pathname = usePathname();
  const { ui: UI, profile: PROFILE } = useLocalizedData();

  if (pathname === "/chat") return null;

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-14">
        <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {UI.colophon.items.map((entry) => (
            <div key={entry.label} className="space-y-1">
              <dt className="font-mono text-[11px] text-ink-soft">
                {entry.label}
              </dt>
              <dd className="text-sm leading-relaxed text-ink">
                {entry.value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-line pt-6 text-xs text-ink-soft sm:flex-row sm:items-baseline sm:gap-8">
          <p className="max-w-2xl leading-relaxed">
            {UI.colophon.copyright}
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link
                href="/personvern"
                className="text-xs font-medium text-ink transition-opacity hover:opacity-75"
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
                  className="inline-flex items-center gap-1 text-xs font-medium text-ink transition-opacity hover:opacity-75"
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
