"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

export type Locale = "no" | "en";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  toggleLocale: () => void;
}

const listeners = new Set<() => void>();
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

const LocaleContext = createContext<LocaleContextValue>({
  locale: "no",
  setLocale: () => {},
  toggleLocale: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocaleSnapshot
  );

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "nb";
  }, [locale]);

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
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
