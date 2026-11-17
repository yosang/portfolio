"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useLocalizedData } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { locale, toggleLocale, ui: UI } = useLocalizedData();
  const [projectsActive, setProjectsActive] = useState(false);

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
    if (pathname !== "/") return;
    const sec = document.getElementById("prosjekter");
    if (!sec) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setProjectsActive(entry.isIntersecting);
      },
      { rootMargin: "-28% 0px -55% 0px", threshold: 0 }
    );
    io.observe(sec);
    return () => {
      io.disconnect();
      setProjectsActive(false);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/" && window.location.hash === "#prosjekter") {
      const id = requestAnimationFrame(() => {
        document.getElementById("prosjekter")?.scrollIntoView({ behavior: "smooth" });
      });
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  const links = [
    {
      href: "/",
      label: UI.nav.home,
      active: pathname === "/" && !projectsActive,
      kind: "home" as const,
    },
    {
      href: "/#prosjekter",
      label: UI.nav.projects,
      active: (pathname === "/" && projectsActive) || pathname.startsWith("/prosjekter"),
      kind: "projects" as const,
    },
    { href: "/about", label: UI.nav.about, active: pathname === "/about", kind: "page" as const },
    { href: "/ai", label: UI.nav.ai, active: pathname === "/ai", kind: "page" as const },
    { href: "/chat", label: UI.nav.chat, active: pathname === "/chat", kind: "page" as const },
  ];

  return (
    <header className="sticky top-3 sm:top-4 z-40 mx-auto w-full max-w-5xl px-3 sm:px-6 pointer-events-none">
      <div className="glass-capsule pointer-events-auto mx-auto flex w-fit items-center justify-center gap-1.5 rounded-full px-2.5 py-1.5 sm:gap-2 sm:px-3.5 sm:py-2">
        <nav className="flex items-center gap-0.5 sm:gap-1.5">
          <ul className="flex items-center gap-0.5 sm:gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={link.active ? "page" : undefined}
                  onClick={(e) => {
                    if (pathname === "/" && link.kind === "home") {
                      e.preventDefault();
                      if (window.location.hash) {
                        window.history.replaceState(null, "", "/");
                      }
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } else if (pathname === "/" && link.kind === "projects") {
                      e.preventDefault();
                      window.history.replaceState(null, "", "/#prosjekter");
                      document.getElementById("prosjekter")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className={`inline-block whitespace-nowrap rounded-full px-2 py-1 text-[13px] font-medium transition-colors sm:px-3 sm:text-sm ${
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
            onClick={toggleLocale}
            aria-label={UI.langLabel}
            title={UI.langLabel}
            className="shrink-0 rounded-full px-2 py-1 font-mono text-[11px] font-semibold tracking-wider text-ink-soft transition-colors hover:text-ink cursor-pointer"
          >
            {locale === "no" ? "EN" : "NO"}
          </button>

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
