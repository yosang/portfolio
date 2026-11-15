"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";

export function SiteFooter() {
  const pathname = usePathname();

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

          <a
            href={`mailto:${PROFILE.email}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-ink transition-opacity hover:opacity-75"
          >
            <span>{PROFILE.email}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
