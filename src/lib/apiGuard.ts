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

const CONTROL_TAG_RE = /\[(?:MOOD|TOUR|GO|FILE):[^\]]*\]?/gi;
const XML_FENCE_RE =
  /<\/?\s*(?:untrusted_visitor_input|viewport_state|system_instruction|model_output|user_input)\b[^>]*>?/gi;
const FENCE_TOKEN_RE = /\b(?:untrusted_visitor_input|viewport_state)\b/gi;
const INVISIBLE_UNICODE_RE =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF\u{E0000}-\u{E007F}]/gu;
const UNSAFE_VOICE_RE =
  /\b(jeg\s+(?:gir\s+)?samtykke(?:r)?|jeg\s+bekrefter\s+herved|gir\s+(?:herved\s+)?mitt\s+samtykke|eier(?:en)?\s+av\s+denne\s+stemmen|i\s+(?:hereby\s+)?consent|my\s+consent\s+to\s+use\s+my\s+voice|owner\s+of\s+this\s+voice|synthetic\s+voice\s+model|authorize\s+this\s+(?:transaction|transfer|payment)|doy\s+mi\s+consentimiento|propietario\s+de\s+esta\s+voz)\b/i;

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
  let out = raw.replace(INVISIBLE_UNICODE_RE, "");
  for (let i = 0; i < 8; i++) {
    const next = out
      .replace(CONTROL_TAG_RE, "")
      .replace(XML_FENCE_RE, "")
      .replace(FENCE_TOKEN_RE, "");
    if (next === out) break;
    out = next;
  }
  return out;
}

export function normalizeTurnText(raw: string): string {
  return stripPromptInjectionDelimiters(raw).replace(/\s+/g, " ").trim();
}

export function isSafeForVoice(raw: string): boolean {
  return !UNSAFE_VOICE_RE.test(raw);
}

export function sanitizeChatMessages(
  raw: unknown,
  maxTurns = 6,
  maxUserChars = 600,
  verifyAssistant?: (content: string, sig?: string) => boolean
): SanitizedMessage[] {
  if (!Array.isArray(raw)) return [];
  const cleaned: SanitizedMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const rec = item as { role?: unknown; content?: unknown; sig?: unknown };
    if (rec.role !== "user" && rec.role !== "assistant") continue;
    if (typeof rec.content !== "string") continue;
    const stripped = stripPromptInjectionDelimiters(rec.content).trim();
    if (!stripped) continue;
    if (rec.role === "assistant") {
      const sig = typeof rec.sig === "string" ? rec.sig.trim() : undefined;
      if (verifyAssistant && !verifyAssistant(stripped, sig)) continue;
      cleaned.push({ role: "assistant", content: stripped.slice(0, 1600) });
      continue;
    }
    cleaned.push({ role: "user", content: stripped.slice(0, maxUserChars) });
  }
  return cleaned.slice(-maxTurns);
}

export function sanitizeViewportField(raw: unknown, maxLen = 80): string {
  if (typeof raw !== "string") return "";
  return stripPromptInjectionDelimiters(raw)
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
  const vercelIp = req.headers
    .get("x-vercel-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  const flyIp = req.headers.get("fly-client-ip")?.trim();
  const cfIp = req.headers.get("cf-ray")
    ? req.headers.get("cf-connecting-ip")?.trim()
    : undefined;
  const xffLast = req.headers
    .get("x-forwarded-for")
    ?.split(",")
    .at(-1)
    ?.trim();
  const raw =
    vercelIp ||
    flyIp ||
    cfIp ||
    req.headers.get("x-real-ip")?.trim() ||
    xffLast ||
    "local";
  return raw.slice(0, 64);
}

export function isAllowedRequest(req: NextRequest): boolean {
  const fetchSite = req.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") {
    return false;
  }

  const isProd = process.env.NODE_ENV === "production";
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      const originHost = new URL(origin).hostname.toLowerCase();
      const reqHost = req.nextUrl.hostname.toLowerCase();
      const allowedHost =
        originHost === reqHost ||
        originHost === "yosmel.no" ||
        originHost === "www.yosmel.no" ||
        (!isProd &&
          (originHost === "localhost" || originHost === "127.0.0.1"));
      if (!allowedHost) return false;
    } catch {
      return false;
    }
  } else if (isProd) {
    return false;
  }

  const clientHeader = req.headers.get("x-portfolio-client");
  if (isProd && clientHeader !== "yosmel-web") {
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
        let evicted = false;
        for (const [k, v] of ipBuckets) {
          if (now - v.minuteTs > 60_000 && v.dayCount <= 2) {
            ipBuckets.delete(k);
            evicted = true;
            break;
          }
        }
        if (!evicted) {
          const oldest = ipBuckets.keys().next().value;
          if (oldest) ipBuckets.delete(oldest);
        }
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
