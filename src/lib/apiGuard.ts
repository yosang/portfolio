import type { NextRequest } from "next/server";

export interface SanitizedMessage {
  role: "user" | "assistant";
  content: string;
}

const STATIC_GO_PATHS = new Set([
  "/",
  "/#prosjekter",
  "/about",
  "/ai",
  "/personvern",
  "/chat",
]);

const CONTROL_TAG_RE = /\[(?:MOOD|TOUR|GO|FILE):[^\]]*\]/gi;
const XML_FENCE_RE = /<\/?(?:untrusted_visitor_input|viewport_state)[^>]*>/gi;

export function isAllowedGoPath(
  rawPath: string,
  validSlugs: ReadonlySet<string>
): string | null {
  const trimmed = rawPath.trim();
  if (STATIC_GO_PATHS.has(trimmed)) return trimmed;
  if (trimmed.startsWith("/prosjekter/")) {
    const slug = trimmed.slice("/prosjekter/".length).toLowerCase();
    if (slug && !slug.includes("/") && validSlugs.has(slug)) {
      return `/prosjekter/${slug}`;
    }
  }
  return null;
}

export function stripPromptInjectionDelimiters(raw: string): string {
  return raw
    .replace(CONTROL_TAG_RE, "")
    .replace(XML_FENCE_RE, "")
    .replace(/\0/g, "");
}

export function sanitizeChatMessages(
  raw: unknown,
  maxTurns = 6,
  maxChars = 600
): SanitizedMessage[] {
  if (!Array.isArray(raw)) return [];
  const cleaned: SanitizedMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as { role?: unknown; content?: unknown };
    if (rec.role !== "user" && rec.role !== "assistant") continue;
    if (typeof rec.content !== "string") continue;
    const text = stripPromptInjectionDelimiters(rec.content)
      .trim()
      .slice(0, maxChars);
    if (!text) continue;
    cleaned.push({ role: rec.role, content: text });
  }
  return cleaned.slice(-maxTurns);
}

export function sanitizeViewportField(raw: unknown, maxLen = 80): string {
  if (typeof raw !== "string") return "";
  return raw
    .replace(/[\r\n\t#<>[\]`]+/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim()
    .slice(0, maxLen);
}

export function sanitizeViewportPath(raw: unknown): string {
  const cleaned = sanitizeViewportField(raw, 64);
  if (!cleaned.startsWith("/") || cleaned.startsWith("//")) return "/";
  return cleaned;
}

export function getClientIp(req: NextRequest): string {
  const raw =
    req.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip")?.trim() ||
    req.headers.get("x-real-ip")?.trim() ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "local";
  return raw.slice(0, 64);
}

export function isAllowedRequest(req: NextRequest): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }

  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).hostname.toLowerCase();
      const reqHost = req.nextUrl.hostname.toLowerCase();
      const allowedHost =
        originHost === reqHost ||
        originHost === "yosmel.no" ||
        originHost === "www.yosmel.no" ||
        originHost === "localhost" ||
        originHost === "127.0.0.1";
      if (!allowedHost) return false;
    } catch {
      return false;
    }
  } else if (process.env.NODE_ENV === "production") {
    return false;
  }

  const clientHeader = req.headers.get("x-portfolio-client");
  if (
    process.env.NODE_ENV === "production" &&
    clientHeader !== "yosmel-web"
  ) {
    return false;
  }

  return true;
}

interface RateLimiterOptions {
  globalPerMin: number;
  globalPerDay: number;
  ipPerMin: number;
  ipPerDay: number;
  maxIpBuckets?: number;
  onNewDay?: () => void;
}

export function createRateLimiter(opts: RateLimiterOptions) {
  const maxBuckets = opts.maxIpBuckets ?? 1000;
  let budgetDay = new Date().toISOString().slice(0, 10);
  let globalUsesToday = 0;
  let globalMinuteTs = Date.now();
  let globalMinuteCount = 0;
  const ipBuckets = new Map<
    string,
    { minuteTs: number; minuteCount: number; dayCount: number }
  >();

  function syncDay() {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== budgetDay) {
      budgetDay = today;
      globalUsesToday = 0;
      globalMinuteCount = 0;
      ipBuckets.clear();
      opts.onNewDay?.();
    }
  }

  return {
    syncDay,
    check(ip: string): boolean {
      syncDay();
      const now = Date.now();

      if (now - globalMinuteTs > 60_000) {
        globalMinuteTs = now;
        globalMinuteCount = 0;
      }
      if (
        globalMinuteCount >= opts.globalPerMin ||
        globalUsesToday >= opts.globalPerDay
      ) {
        return false;
      }

      if (!ipBuckets.has(ip) && ipBuckets.size >= maxBuckets) {
        const oldest = ipBuckets.keys().next().value;
        if (oldest) ipBuckets.delete(oldest);
      }

      const entry = ipBuckets.get(ip) ?? {
        minuteTs: now,
        minuteCount: 0,
        dayCount: 0,
      };
      if (now - entry.minuteTs > 60_000) {
        entry.minuteTs = now;
        entry.minuteCount = 0;
      }
      if (entry.minuteCount >= opts.ipPerMin || entry.dayCount >= opts.ipPerDay) {
        ipBuckets.set(ip, entry);
        return false;
      }
      entry.minuteCount += 1;
      entry.dayCount += 1;
      globalMinuteCount += 1;
      globalUsesToday += 1;
      ipBuckets.set(ip, entry);
      return true;
    },
  };
}
