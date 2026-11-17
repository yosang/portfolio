"use client";

import Link from "next/link";
import { useLocalizedData } from "@/lib/i18n";

export default function NotFound() {
  const { ui: UI } = useLocalizedData();

  return (
    <div className="mx-auto flex max-w-xl flex-col items-start justify-center space-y-5 px-4 py-24 sm:px-6 md:py-32">
      <p className="font-mono text-xs text-ink-soft">{UI.notFound.code}</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {UI.notFound.heading}
      </h1>
      <p className="text-base leading-relaxed text-ink-soft">
        {UI.notFound.body}
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
      >
        {UI.privacy.backHome}
      </Link>
    </div>
  );
}
