"use client";

import React, { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";
import { PROLOGUE_REPLAY_EVENT } from "@/components/Prologue";
import { portfolioAudio } from "@/lib/audioSynth";

export function SiteFooter() {
  const pathname = usePathname();
  const router = useRouter();

  const handleReplay = useCallback(() => {
    portfolioAudio.unlock();
    portfolioAudio.stopAll();
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        window.dispatchEvent(new CustomEvent(PROLOGUE_REPLAY_EVENT));
      }, 60);
      return;
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    window.dispatchEvent(new CustomEvent(PROLOGUE_REPLAY_EVENT));
  }, [pathname, router]);

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

          <div className="flex shrink-0 flex-wrap items-center gap-5 font-medium text-ink">
            <button
              type="button"
              onClick={handleReplay}
              className="font-mono text-xs text-ink-soft underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink cursor-pointer"
            >
              {UI.prologue.replay}
            </button>

            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-ink transition-opacity hover:opacity-75"
            >
              <span>{PROFILE.email}</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
