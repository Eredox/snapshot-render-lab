import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy, createNonce, withSecurityHeaders } from "@/lib/security-headers";
import { renderErrorPage } from "@/lib/error-page";

describe("application-owned security headers", () => {
  it("builds a nonce-based CSP without unsafe-eval, wildcards or inline-script allowance", () => {
    const nonce = createNonce();
    const csp = buildContentSecurityPolicy(nonce);
    expect(csp).toContain(`script-src 'self' 'nonce-${nonce}'`);
    expect(csp).not.toMatch(/unsafe-eval/);
    expect(csp).not.toMatch(/script-src[^;]*unsafe-inline/);
    expect(csp).not.toMatch(/(^|[ ;])\*([ ;]|$)/);
    expect(csp).not.toMatch(/https?:\/\//); // everything is same-origin: no third-party origins allowed
    for (const directive of [
      "default-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "frame-ancestors 'self'",
      "form-action 'self'",
      "connect-src 'self'",
    ]) {
      expect(csp).toContain(directive);
    }
  });

  it("limits the only permitted inline allowance to style attributes", () => {
    const csp = buildContentSecurityPolicy("abc");
    expect(csp).toContain("style-src-attr 'unsafe-inline'");
    expect(csp.match(/unsafe-inline/g)).toHaveLength(1);
  });

  it("uses a fresh unpredictable nonce for every request", () => {
    const nonces = new Set(Array.from({ length: 50 }, () => createNonce()));
    expect(nonces.size).toBe(50);
    expect([...nonces][0]).toMatch(/^[A-Za-z0-9+/]{22}==$/);
  });

  it("adds CSP and COOP to any response, preserves body/status and does not clobber edge headers", async () => {
    const request = new Request("https://www.nova.eredox.com/", {
      headers: { "x-forwarded-proto": "https" },
    });
    const out = withSecurityHeaders(
      new Response("hello", { status: 404, headers: { "referrer-policy": "no-referrer" } }),
      "n0nce",
      request,
    );
    expect(out.status).toBe(404);
    expect(await out.text()).toBe("hello");
    expect(out.headers.get("content-security-policy")).toContain("'nonce-n0nce'");
    expect(out.headers.get("content-security-policy")).toContain("upgrade-insecure-requests");
    expect(out.headers.get("cross-origin-opener-policy")).toBe("same-origin");
    expect(out.headers.get("referrer-policy")).toBe("no-referrer");
    expect(out.headers.get("x-content-type-options")).toBe("nosniff");
  });

  it("does not upgrade insecure requests for local http development", () => {
    const out = withSecurityHeaders(new Response("x"), "n", new Request("http://127.0.0.1:3000/"));
    expect(out.headers.get("content-security-policy")).not.toContain("upgrade-insecure-requests");
  });

  it("renders the catastrophic error page without inline event handlers and with the nonce on its style", () => {
    const html = renderErrorPage("abc123");
    expect(html).toContain('<style nonce="abc123">');
    expect(html).not.toMatch(/\son[a-z]+=/i);
  });
});
