"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
export type Locale = "no" | "en";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  locale: "no",
  setLocale: () => {},
  toggleLocale: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");
  const [locale, setLocaleState] = useState<Locale>("no");

  useEffect(() => {
    const next = localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light";
    setTheme(next);
    document.documentElement.dataset.theme = next;

    const storedLocale = localStorage.getItem("portfolio-locale");
    let resolvedLocale: Locale = "no";
    if (storedLocale === "en" || storedLocale === "no") {
      resolvedLocale = storedLocale;
    } else if (typeof navigator !== "undefined") {
      const langs = navigator.languages?.length
        ? navigator.languages
        : [navigator.language || "nb"];
      const prefersNordic = langs.some((l) =>
        /^(nb|nn|no|da|sv)\b/i.test(l.trim())
      );
      if (!prefersNordic) {
        resolvedLocale = "en";
      }
    }
    setLocaleState(resolvedLocale);
    document.documentElement.lang = resolvedLocale === "en" ? "en" : "nb";
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      localStorage.setItem("portfolio-theme", next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  };

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    localStorage.setItem("portfolio-locale", next);
    document.documentElement.lang = next === "en" ? "en" : "nb";
  };

  const toggleLocale = () => {
    setLocaleState((prev) => {
      const next: Locale = prev === "no" ? "en" : "no";
      localStorage.setItem("portfolio-locale", next);
      document.documentElement.lang = next === "en" ? "en" : "nb";
      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, locale, setLocale, toggleLocale }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

export function useLocale() {
  const { locale, setLocale, toggleLocale } = useContext(ThemeContext);
  return { locale, setLocale, toggleLocale };
}
