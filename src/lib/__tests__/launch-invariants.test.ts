import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sitemapUrls } from "@/routes/sitemap[.]xml";
import { appUrls } from "@/config/site";

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

  it("keeps the Free-start CTA on the verified application registration route", () => {
    expect(appUrls.register).toBe("https://nova.eredox.com/register");
    const start = readFileSync(resolve(process.cwd(), "src/routes/start.tsx"), "utf8");
    expect(start).toContain("to={appUrls.register}");
    expect(start).toContain("Create Free workspace");
  });

  it("keeps every customer-facing Free signup surface on the centralized registration URL", () => {
    const sourceFiles = [
      "src/components/site/Header.tsx",
      "src/components/site/cta.tsx",
      "src/data/pricing.ts",
      "src/routes/contact.tsx",
      "src/routes/frameworks.$slug.tsx",
      "src/routes/index.tsx",
      "src/routes/pricing.tsx",
      "src/routes/solutions.$slug.tsx",
      "src/routes/start.tsx",
    ];

    for (const relativePath of sourceFiles) {
      const source = readFileSync(resolve(process.cwd(), relativePath), "utf8");
      expect(source, relativePath).toContain("appUrls.register");
    }

    expect(readFileSync(resolve(process.cwd(), "src/data/pricing.ts"), "utf8")).toContain(
      'label: "Start Free", to: appUrls.register, external: true',
    );
    expect(readFileSync(resolve(process.cwd(), "src/components/site/cta.tsx"), "utf8")).toContain(
      'primary = { label: "Start Free", to: appUrls.register, external: true }',
    );
  });
});
