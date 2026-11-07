import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { featureSeo, frameworkSeo, industrySeo, solutionSeo } from "@/data/seo-overrides";
import { features } from "@/data/features";
import { frameworks } from "@/data/frameworks";
import { solutions } from "@/data/solutions";
import { industrySlugs } from "@/data/industries";
import { plans } from "@/data/pricing";
import { sitemapUrls } from "@/routes/sitemap[.]xml";
import { pageMeta } from "@/lib/seo";
import { testimonials } from "@/data/testimonials";
import { publishedByType } from "@/data/resources";

const root = process.cwd();
const read = (path: string) => readFileSync(resolve(root, path), "utf8");

describe("template SEO overrides", () => {
  const allTitles = [
    ...Object.values(featureSeo),
    ...Object.values(frameworkSeo),
    ...Object.values(industrySeo),
    ...Object.values(solutionSeo),
  ].map((entry) => entry.title);

  it("covers every feature, framework, industry and solution slug", () => {
    expect(Object.keys(featureSeo).sort()).toEqual(features.map((f) => f.slug).sort());
    expect(Object.keys(frameworkSeo).sort()).toEqual(frameworks.map((f) => f.slug).sort());
    expect(Object.keys(industrySeo).sort()).toEqual([...industrySlugs].sort());
    expect(Object.keys(solutionSeo).sort()).toEqual(solutions.map((s) => s.slug).sort());
  });

  it("keeps titles unique, 20-60 characters and consistently branded", () => {
    expect(new Set(allTitles).size).toBe(allTitles.length);
    for (const title of allTitles) {
      expect(title.length, title).toBeGreaterThanOrEqual(20);
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(title.endsWith(" | NOVA Compliance"), title).toBe(true);
      expect(title).not.toContain("—");
    }
  });

  it("keeps override descriptions 70-160 characters", () => {
    for (const entry of [
      ...Object.values(featureSeo),
      ...Object.values(frameworkSeo),
      ...Object.values(industrySeo),
      ...Object.values(solutionSeo),
    ]) {
      if (!entry.description) continue;
      expect(entry.description.length, entry.description).toBeGreaterThanOrEqual(70);
      expect(entry.description.length, entry.description).toBeLessThanOrEqual(160);
    }
  });

  it("never claims certification, guaranteed compliance or auditor-free outcomes", () => {
    const copy = [
      ...Object.values(featureSeo),
      ...Object.values(frameworkSeo),
      ...Object.values(industrySeo),
      ...Object.values(solutionSeo),
    ]
      .map((entry) => `${entry.title} ${entry.description ?? ""}`)
      .join(" ");
    expect(copy).not.toMatch(/\bguarantee|\bcertified by NOVA|get certified|instant compliance|100%|fully compliant|pass your audit/i);
  });

  it("gives every plan page a description inside the snippet range", () => {
    for (const plan of plans) {
      const description = `${plan.summary} Review the ${plan.name} plan entitlements, billing options and next steps.`;
      expect(description.length, plan.slug).toBeGreaterThanOrEqual(70);
      expect(description.length, plan.slug).toBeLessThanOrEqual(160);
      const title = `NOVA ${plan.name} Plan | Pricing and Entitlements`;
      expect(title.length, plan.slug).toBeLessThanOrEqual(60);
    }
  });

  it("emits absolute self-referencing canonicals for every sitemap path", () => {
    for (const { loc } of sitemapUrls()) {
      const meta = pageMeta({ title: "t", description: "d", path: loc });
      const canonical = meta.links[0]?.href ?? "";
      expect(canonical.startsWith("https://www.nova.eredox.com"), loc).toBe(true);
      expect(canonical.endsWith(loc === "/" ? "/" : loc), loc).toBe(true);
    }
  });
});

describe("placeholder sections", () => {
  it("are noindex in source while they have no content, and absent from the sitemap", () => {
    const routes = sitemapUrls().map((u) => u.loc);
    expect(testimonials).toHaveLength(0);
    expect(routes).not.toContain("/testimonials");
    expect(read("src/routes/testimonials.tsx")).toMatch(/noindexFollow/);
    expect(read("src/routes/status.tsx")).toMatch(/noindexFollow/);
    expect(routes).not.toContain("/status");
    if (publishedByType("Product update").length === 0) expect(routes).not.toContain("/resources/product-updates");
    expect(read("src/routes/resources.product-updates.index.tsx")).toMatch(/noindexFollow/);
  });

  it("previously orphaned pages are linked from the global footer", () => {
    const navigation = read("src/config/navigation.ts");
    expect(navigation).toMatch(/to: "\/compare"/);
    expect(navigation).toMatch(/label: "Free access", to: "\/start"/);
  });
});

describe("/start Free-access copy", () => {
  it("states the manifest entitlement (all available frameworks), not the retired single-framework limit", () => {
    const free = plans.find((p) => p.slug === "free");
    expect(free?.includes.some((i) => /all available frameworks/i.test(i))).toBe(true);
    expect(read("src/routes/start.tsx")).not.toMatch(/One active framework/);
  });
});

describe("security.txt (RFC 9116)", () => {
  const body = read("public/.well-known/security.txt");
  it("has a published Contact, a Canonical URL and a valid future Expires within a year", () => {
    expect(body).toMatch(/^Contact:\s*mailto:compliance@eredox\.com$/m);
    expect(body).toMatch(/^Canonical:\s*https:\/\/www\.nova\.eredox\.com\/\.well-known\/security\.txt$/m);
    const expires = /^Expires:\s*(.+)$/m.exec(body)?.[1] ?? "";
    const when = new Date(expires);
    expect(Number.isNaN(when.getTime())).toBe(false);
    expect(when.getTime()).toBeGreaterThan(Date.now());
    expect(when.getTime()).toBeLessThan(Date.now() + 366 * 24 * 3600 * 1000);
  });
  it("makes no invented guarantees (no SLA, bounty or safe-harbour promises)", () => {
    expect(body).not.toMatch(/bounty|safe harbou?r|within \d+ (hours|days)|guarantee/i);
  });
});
