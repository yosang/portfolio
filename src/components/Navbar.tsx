"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocalizedData } from "@/lib/i18n";

export function Navbar() {
  const pathname = usePathname();
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
    <header className="sticky top-0 z-40 border-b border-line bg-white/92 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-center px-5 sm:h-[72px] sm:px-8">
        <nav className="flex items-center gap-4 sm:gap-7">
          <ul className="flex items-center gap-4 sm:gap-7">
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
                  className={`relative inline-block whitespace-nowrap py-1 text-[13px] transition-colors sm:text-sm ${
                    link.active
                      ? "font-medium text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-ink"
                      : "font-normal text-ink-soft hover:text-ink"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <span className="h-3.5 w-px shrink-0 bg-line" />

          <button
            type="button"
            onClick={toggleLocale}
            aria-label={UI.langLabel}
            title={UI.langLabel}
            className="shrink-0 font-mono text-[11px] font-semibold tracking-[0.08em] text-ink-soft transition-colors hover:text-ink cursor-pointer"
          >
            {locale === "no" ? "EN" : "NO"}
          </button>
        </nav>
      </div>
    </header>
  );
}
