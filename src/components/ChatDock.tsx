"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useCompanion } from "@/components/CompanionContext";
import { ChatThread, Composer } from "@/components/ChatThread";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";

export function ChatDock() {
  const pathname = usePathname();
  const { isOpen, setIsOpen, mood, isStreaming, voiceEnabled, setVoiceEnabled, voiceCapped } =
    useCompanion();
  const t = UI.chat;
  const [heroScrolledOut, setHeroScrolledOut] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    const heroEl = document.getElementById("hero-ai-studio");
    if (!heroEl) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setHeroScrolledOut(!entry.isIntersecting);
      },
      { threshold: 0.08 }
    );
    io.observe(heroEl);
    return () => io.disconnect();
  }, [pathname]);

  const showFloatingPill = !isOpen && (pathname !== "/" || heroScrolledOut);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, setIsOpen]);

  if (pathname === "/chat") return null;

  return (
    <>
      {showFloatingPill && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="glass-capsule fixed bottom-5 right-5 z-40 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-transform hover:scale-105 cursor-pointer"
        >
          <span>{t.dock}</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            aria-label={t.close}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/35 cursor-default"
          />
          <aside
            role="dialog"
            aria-modal="true"
            aria-label={t.title}
            className="relative flex h-full w-full max-w-[400px] flex-col border-l border-line bg-paper shadow-2xl"
          >
            <header className="relative z-20 flex items-center justify-between gap-3 border-b border-line px-5 py-3.5">
              <span className="text-xs text-ink-soft">
                {isStreaming ? t.thinking : UI.moods[mood]}
              </span>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => setInfoOpen((v) => !v)}
                  aria-label={t.aboutAiLabel}
                  aria-expanded={infoOpen}
                  className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-line font-mono text-[11px] font-medium leading-none text-ink-soft transition-colors hover:border-ink/40 hover:text-ink cursor-pointer"
                >
                  ?
                </button>
                <label className="inline-flex items-center gap-1.5 text-ink-soft cursor-pointer">
                  <input
                    type="checkbox"
                    checked={voiceEnabled}
                    onChange={(e) => setVoiceEnabled(e.target.checked)}
                    className="accent-[var(--accent)]"
                  />
                  {t.sound}
                </label>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label={t.close}
                  className="rounded-full p-1 text-ink-soft hover:bg-ink/5 hover:text-ink cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {infoOpen && (
              <p className="border-b border-line bg-paper-raised px-5 py-2.5 text-xs leading-relaxed text-ink-soft">
                {t.disclaimerPrefix}
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="font-medium text-ink underline underline-offset-3 hover:text-trail"
                >
                  {t.disclaimerLink}
                </a>
                {t.disclaimerSuffix}
              </p>
            )}

            {voiceCapped && voiceEnabled && (
              <p className="border-b border-line px-5 py-2 text-xs text-ink-soft">{t.capped}</p>
            )}

            <ChatThread className="flex-1 px-5 py-4" />

            <div className="space-y-2.5 border-t border-line px-5 py-3.5">
              <Composer autoFocus inputId="dock-chat-input" />
              <Link
                href="/chat"
                onClick={() => setIsOpen(false)}
                className="inline-block text-xs text-ink-soft underline underline-offset-4 hover:text-ink"
              >
                {t.fullView} →
              </Link>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
