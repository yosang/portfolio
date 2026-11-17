"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { useCompanionPortfolio } from "@/components/CompanionContext";
import { useLocalizedData } from "@/lib/i18n";

export function CaseStudyAskButton({ title }: { title: string }) {
  const { setIsOpen, sendMessage } = useCompanionPortfolio();
  const { ui: UI } = useLocalizedData();
  const t = UI.home;

  return (
    <button
      type="button"
      onClick={() => {
        setIsOpen(true);
        sendMessage(t.askCasePrompt(title));
      }}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper-raised px-4 py-2 text-xs font-medium text-ink transition-colors hover:border-ink/35 cursor-pointer"
    >
      <MessageSquare className="h-3.5 w-3.5 text-ink-soft" />
      <span>{t.askCaseButton}</span>
    </button>
  );
}
