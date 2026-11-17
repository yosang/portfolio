import { useMemo } from "react";
import { useLocale, type Locale } from "@/components/ThemeProvider";
import { UI } from "@/data/ui";
import {
  FOLLOW_UP_PROMPTS,
  INDEPENDENT_PROJECTS,
  PROFILE,
  PROJECTS,
  SCHOOL_PROJECTS,
  TOUR_PROMPT,
  USE_CASE_PROMPT,
} from "@/data/portfolio";
import { AI_PAGE } from "@/data/ai";
import enData from "@/data/en.generated.json";

const EN_MAP: Record<string, string> = enData.translations || {};

export function tr(text: string, locale: Locale): string {
  if (locale !== "en" || !text) return text;
  return EN_MAP[text] || text;
}

export function localizeValue<T>(val: T, locale: Locale): T {
  if (locale !== "en" || val === null || val === undefined) return val;
  if (typeof val === "string") {
    if (val.startsWith("/audio/tour/") && !val.startsWith("/audio/tour/en/")) {
      return val.replace("/audio/tour/", "/audio/tour/en/") as unknown as T;
    }
    return (EN_MAP[val] || val) as unknown as T;
  }
  if (Array.isArray(val)) {
    return val.map((item) => localizeValue(item, locale)) as unknown as T;
  }
  if (typeof val === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (
        k === "slug" ||
        k === "id" ||
        k === "category" ||
        k === "accent" ||
        k === "ground" ||
        k === "poster" ||
        k === "video" ||
        k === "src" ||
        k === "href" ||
        k === "liveUrl" ||
        k === "repoUrl" ||
        k === "tone" ||
        k === "aiContext"
      ) {
        out[k] = v;
      } else {
        out[k] = localizeValue(v, locale);
      }
    }
    return out as T;
  }
  return val;
}

export function getLocalizedData(locale: Locale) {
  const ui = localizeValue(UI, locale);
  if (locale === "en") {
    const tmpl = ui.home.askAboutTemplate || "Tell me briefly how you built {title}.";
    ui.home.askAboutPrompt = (title: string) => tmpl.replace("{title}", title);
  } else {
    ui.home.askAboutPrompt = UI.home.askAboutPrompt;
  }

  const profile = localizeValue(PROFILE, locale);
  const independentProjects = localizeValue(INDEPENDENT_PROJECTS, locale);
  const schoolProjects = localizeValue(SCHOOL_PROJECTS, locale);
  const projects = [...independentProjects, ...schoolProjects];
  const aiPage = localizeValue(AI_PAGE, locale);
  const tourPrompt = tr(TOUR_PROMPT, locale);
  const useCasePrompt = tr(USE_CASE_PROMPT, locale);
  const followUpPrompts = FOLLOW_UP_PROMPTS.map((p) => ({
    text: tr(p.text, locale),
    match: p.match,
  }));
  const tourSteps = projects.map((project) => ({
    slug: project.slug,
    audioSrc: project.tour.audioSrc,
    bubble: project.tour.bubble,
  }));

  return {
    locale,
    ui,
    profile,
    projects,
    independentProjects,
    schoolProjects,
    aiPage,
    tourPrompt,
    useCasePrompt,
    followUpPrompts,
    tourSteps,
  };
}

export function useLocalizedData() {
  const { locale, setLocale, toggleLocale } = useLocale();
  const data = useMemo(() => getLocalizedData(locale), [locale]);
  return { ...data, setLocale, toggleLocale };
}
