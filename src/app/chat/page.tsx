"use client";

import React from "react";
import Link from "next/link";
import { VolumeX } from "lucide-react";
import { ChatThread, Composer } from "@/components/ChatThread";
import { useCompanion } from "@/components/CompanionContext";
import { useLocalizedData } from "@/lib/i18n";

export default function ChatPage() {
  const {
    messages,
    mood,
    isStreaming,
    voiceEnabled,
    setVoiceEnabled,
    voiceCapped,
    resetChat,
    setChatPageAvatarSlot,
  } = useCompanion();
  const { ui: UI, profile: PROFILE } = useLocalizedData();
  const t = UI.chat;

  return (
    <div
      data-viewport-section="Chat"
      className="mx-auto grid max-w-5xl gap-6 px-5 py-8 sm:px-8 md:h-[calc(100dvh-5rem)] md:grid-cols-[340px_1fr] md:py-10"
    >
      <aside className="flex flex-col overflow-hidden rounded-md border border-line bg-[#f7f7f7] text-ink">
        <div className="relative h-64 md:h-auto md:flex-1">
          <div ref={setChatPageAvatarSlot} className="absolute inset-0" />
        </div>

        <div className="space-y-3 border-t border-line bg-white p-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-medium text-ink">{PROFILE.name}</span>
            <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-ink-muted">
              {isStreaming ? t.thinking : UI.moods[mood]}
            </span>
          </div>

          <div className="flex items-center gap-4 text-ink-soft">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={(e) => setVoiceEnabled(e.target.checked)}
                className="accent-[#1a1a1a]"
              />
              {t.sound}
            </label>
            {messages.length > 0 && (
              <button
                type="button"
                onClick={resetChat}
                className="underline underline-offset-4 hover:text-ink cursor-pointer"
              >
                {t.clear}
              </button>
            )}
          </div>

          <p className="leading-relaxed text-ink-soft">
            {t.disclaimerPrefix}
            <a
              href={`mailto:${PROFILE.email}`}
              className="font-medium text-ink underline decoration-ink/35 underline-offset-3 hover:decoration-ink"
            >
              {t.disclaimerLink}
            </a>
            {t.disclaimerSuffix}{" "}
            <Link
              href="/personvern"
              className="font-medium text-ink underline decoration-ink/35 underline-offset-3 hover:decoration-ink"
            >
              {t.privacyLinkLabel}
            </Link>
            .
          </p>
        </div>
      </aside>

      <section className="surface-card flex min-h-[55vh] flex-col gap-4 rounded-md p-5 sm:p-7 md:min-h-0">
        <h1 className="font-display text-2xl font-light tracking-[-0.025em]">{t.title}</h1>
        {voiceCapped && voiceEnabled && (
          <p className="flex items-center gap-2 rounded-sm border border-amber-500/25 bg-amber-50 px-4 py-2.5 text-xs font-medium text-amber-800">
            <VolumeX className="h-3.5 w-3.5 shrink-0" />
            <span>{t.capped}</span>
          </p>
        )}
        <ChatThread className="flex-1 border-t border-line pt-4" />
        <Composer autoFocus inputId="studio-chat-input" />
      </section>
    </div>
  );
}
