"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { PROFILE } from "@/data/portfolio";
import { UI } from "@/data/ui";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted && window.location.hash !== "#prosjekter") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (
      pathname === "/" &&
      window.location.hash === "#prosjekter" &&
      document.documentElement.dataset.prologue !== "1"
    ) {
      const id = requestAnimationFrame(() => {
        document.getElementById("prosjekter")?.scrollIntoView({ behavior: "smooth" });
      });
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const links = [
    { href: "/#prosjekter", label: UI.nav.projects, active: false, isProjects: true },
    { href: "/about", label: UI.nav.about, active: pathname === "/about", isProjects: false },
    { href: "/ai", label: UI.nav.ai, active: pathname === "/ai", isProjects: false },
    { href: "/chat", label: UI.nav.chat, active: pathname === "/chat", isProjects: false },
  ];

  return (
    <header className="sticky top-3 sm:top-4 z-40 mx-auto w-full max-w-5xl px-3 sm:px-6 pointer-events-none">
      <div className="glass-capsule pointer-events-auto mx-auto flex w-fit items-center justify-center gap-2 rounded-full px-3 py-1.5 sm:w-full sm:justify-between sm:gap-3 sm:px-5 sm:py-2.5">
        <Link
          href="/"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              if (window.location.hash) {
                window.history.replaceState(null, "", "/");
              }
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="hidden shrink-0 whitespace-nowrap font-display text-[15px] font-semibold tracking-tight text-ink sm:inline-block"
        >
          {PROFILE.name}
        </Link>

        <nav className="flex items-center gap-0.5 sm:gap-1.5">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  onClick={(e) => {
                    if (link.isProjects && pathname === "/") {
                      e.preventDefault();
                      window.history.replaceState(null, "", "/#prosjekter");
                      document.getElementById("prosjekter")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-[13px] font-medium transition-colors sm:px-3 sm:text-sm ${
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

          <span className="mx-0.5 h-3.5 w-px shrink-0 bg-line sm:mx-1" />

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={UI.themeLabel}
            title={UI.themeLabel}
            className="shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:text-ink cursor-pointer"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </nav>
      </div>
    </header>
  );
}
