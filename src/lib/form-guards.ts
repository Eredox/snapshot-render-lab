import { createHash, randomBytes } from "node:crypto";

/**
 * Abuse controls for the public /api/forms endpoint.
 *
 * Deployment topology (see DEPLOYMENT.md): ONE Node container behind the nginx
 * edge, on a private Docker network, with no published port. A per-process
 * in-memory store is therefore sufficient and avoids a new datastore. If the
 * site is ever scaled to more than one replica, move these counters to a shared
 * store (e.g. Redis) or rely on the edge `limit_req` zone alone; limits here are
 * then per replica.
 */

type Bucket = number[];

export class SlidingWindowLimiter {
  private readonly hits = new Map<string, Bucket>();
  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxKeys = 5_000,
  ) {}

  /** Records a hit when allowed; returns Retry-After seconds when the key is over its limit. */
  take(key: string, now = Date.now()): { allowed: true } | { allowed: false; retryAfterSeconds: number } {
    const bucket = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (bucket.length >= this.limit) {
      this.hits.set(key, bucket);
      const oldest = bucket[0] ?? now;
      return { allowed: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000)) };
    }
    bucket.push(now);
    this.hits.delete(key); // refresh insertion order so the oldest keys are evicted first
    this.hits.set(key, bucket);
    if (this.hits.size > this.maxKeys) {
      const first = this.hits.keys().next().value;
      if (first !== undefined) this.hits.delete(first);
    }
    return { allowed: true };
  }

  clear() {
    this.hits.clear();
  }
}

const TEN_MINUTES = 10 * 60_000;
const ONE_HOUR = 60 * 60_000;

/** Every POST attempt (valid or not) per client. */
export const attemptLimiter = new SlidingWindowLimiter(20, TEN_MINUTES);
/** Accepted-for-delivery submissions per client. */
export const clientDeliveryLimiter = new SlidingWindowLimiter(5, TEN_MINUTES);
/** Hard ceiling on total deliveries per hour, bounding CRM/e-mail cost during a distributed attack. */
export const globalDeliveryLimiter = new SlidingWindowLimiter(120, ONE_HOUR, 1);

const recentFingerprints = new Map<string, number>();
const DUPLICATE_WINDOW_MS = 15 * 60_000;

export function submissionFingerprint(parts: string[]): string {
  return createHash("sha256").update(parts.map((p) => p.trim().toLowerCase()).join("\u0000")).digest("hex");
}

export function isRecentDuplicate(fingerprint: string, now = Date.now()): boolean {
  const seen = recentFingerprints.get(fingerprint);
  return seen !== undefined && now - seen < DUPLICATE_WINDOW_MS;
}

export function rememberSubmission(fingerprint: string, now = Date.now()) {
  for (const [key, at] of recentFingerprints) if (now - at >= DUPLICATE_WINDOW_MS) recentFingerprints.delete(key);
  if (recentFingerprints.size > 5_000) recentFingerprints.clear();
  recentFingerprints.set(fingerprint, now);
}

const ipPattern = /^[0-9a-fA-F:.]{3,45}$/;

/**
 * Client identity for rate limiting. nginx (the only reachable proxy) overwrites X-Real-IP with the
 * TCP peer address and appends the peer to X-Forwarded-For, so X-Real-IP, then the LAST X-Forwarded-For
 * entry, are trustworthy; earlier entries are client-controlled and ignored.
 */
export function clientKey(request: Request): string {
  const real = request.headers.get("x-real-ip")?.trim();
  if (real && ipPattern.test(real)) return real;
  const forwarded = request.headers.get("x-forwarded-for")?.split(",").pop()?.trim();
  if (forwarded && ipPattern.test(forwarded)) return forwarded;
  return "unknown";
}

const logSalt = randomBytes(16).toString("hex");

/** Privacy-safe operational log line: reason codes and a per-process salted client hash only - never names, e-mail addresses or message text. */
export function logFormEvent(event: string, fields: { status: number; reason?: string; client?: string }) {
  const clientRef = fields.client ? createHash("sha256").update(logSalt + fields.client).digest("hex").slice(0, 8) : undefined;
  console.warn(JSON.stringify({ scope: "nova-forms", event, status: fields.status, ...(fields.reason ? { reason: fields.reason } : {}), ...(clientRef ? { client: clientRef } : {}) }));
}

export function resetFormGuardsForTests() {
  attemptLimiter.clear();
  clientDeliveryLimiter.clear();
  globalDeliveryLimiter.clear();
  recentFingerprints.clear();
}

/** Accepts only requests that a same-site browser form could legitimately make. */
export function originAllowed(request: Request, extraHosts: string[] = []): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite && fetchSite !== "same-origin" && fetchSite !== "none") return false;
  const origin = request.headers.get("origin");
  if (!origin) return true; // non-browser clients; protection for them is rate limiting, not Origin
  let originHost: string;
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    originHost = parsed.host;
  } catch {
    return false;
  }
  const allowed = new Set([new URL(request.url).host, request.headers.get("host") ?? "", request.headers.get("x-forwarded-host") ?? "", ...extraHosts].filter(Boolean));
  return allowed.has(originHost);
}

/** Reads at most `maxBytes` of the request body; resolves null when the limit is exceeded. */
export async function readBodyCapped(request: Request, maxBytes: number): Promise<string | null> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > maxBytes) return null;
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks).toString("utf8");
}
