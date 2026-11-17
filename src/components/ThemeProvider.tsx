"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

type Theme = "dark" | "light";
export type Locale = "no" | "en";

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

const listeners = new Set<() => void>();
let cachedTheme: Theme | null = null;
let cachedLocale: Locale | null = null;

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getThemeSnapshot(): Theme {
  if (cachedTheme === null) {
    cachedTheme =
      localStorage.getItem("portfolio-theme") === "dark" ? "dark" : "light";
  }
  return cachedTheme;
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

function getLocaleSnapshot(): Locale {
  if (cachedLocale === null) {
    const stored = localStorage.getItem("portfolio-locale");
    if (stored === "en" || stored === "no") {
      cachedLocale = stored;
    } else {
      const langs = navigator.languages?.length
        ? navigator.languages
        : [navigator.language || "nb"];
      const prefersNordic = langs.some((l) =>
        /^(nb|nn|no|da|sv)\b/i.test(l.trim())
      );
      cachedLocale = prefersNordic ? "no" : "en";
    }
  }
  return cachedLocale;
}

function getServerLocaleSnapshot(): Locale {
  return "no";
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "light",
  toggleTheme: () => {},
  locale: "no",
  setLocale: () => {},
  toggleLocale: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribe,
    getThemeSnapshot,
    getServerThemeSnapshot
  );
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocaleSnapshot
  );

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "nb";
  }, [locale]);

  const toggleTheme = useCallback(() => {
    const next: Theme = getThemeSnapshot() === "dark" ? "light" : "dark";
    cachedTheme = next;
    localStorage.setItem("portfolio-theme", next);
    document.documentElement.dataset.theme = next;
    emitChange();
  }, []);

  const setLocale = useCallback((next: Locale) => {
    cachedLocale = next;
    localStorage.setItem("portfolio-locale", next);
    document.documentElement.lang = next === "en" ? "en" : "nb";
    emitChange();
  }, []);

  const toggleLocale = useCallback(() => {
    const next: Locale = getLocaleSnapshot() === "no" ? "en" : "no";
    cachedLocale = next;
    localStorage.setItem("portfolio-locale", next);
    document.documentElement.lang = next === "en" ? "en" : "nb";
    emitChange();
  }, []);

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
