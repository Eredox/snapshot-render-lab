import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sitemapUrls } from "@/routes/sitemap[.]xml";

describe("public launch invariants", () => {
  it("keeps sitemap URLs unique and canonical", () => {
    const urls = sitemapUrls();
    expect(urls.length).toBe(65);
    expect(new Set(urls.map((url) => url.loc)).size).toBe(urls.length);
    expect(urls.every((url) => url.loc.startsWith("/"))).toBe(true);
    expect(urls.some((url) => url.loc === "/404")).toBe(false);
    expect(urls.some((url) => url.loc === "/book-demo/confirmed")).toBe(false);
  });

  it("keeps the public edge security baseline and CSP together", () => {
    const nginx = readFileSync(
      resolve(process.cwd(), "ops/nginx/www.nova.eredox.com.conf"),
      "utf8",
    );
    for (const header of [
      "Strict-Transport-Security",
      "X-Frame-Options",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Content-Security-Policy",
    ]) {
      expect(nginx).toContain(`add_header ${header}`);
    }
    expect(nginx).not.toMatch(/unsafe-eval/);
  });
});
