"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  const links = [
    { href: "/#prosjekter", label: UI.nav.projects, active: false },
    { href: "/about", label: UI.nav.about, active: pathname === "/about" },
    { href: "/ai", label: UI.nav.ai, active: pathname === "/ai" },
    { href: "/chat", label: UI.nav.chat, active: pathname === "/chat" },
  ];

  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-5xl px-4 sm:px-6 pointer-events-none">
      <div className="glass-capsule pointer-events-auto mx-auto flex items-center justify-between gap-3 rounded-full px-4 py-2 sm:px-5 sm:py-2.5">
        <Link
          href="/"
          className="font-display text-[15px] font-semibold tracking-tight text-ink"
        >
          {PROFILE.name}
        </Link>

        <nav className="flex items-center gap-1 sm:gap-1.5">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                    link.active
                      ? "bg-ink text-paper"
                      : "text-ink-soft hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <span className="mx-1 h-3.5 w-px bg-line" />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={UI.themeLabel}
            title={UI.themeLabel}
            className="rounded-full p-1.5 text-ink-soft transition-colors hover:text-ink cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
