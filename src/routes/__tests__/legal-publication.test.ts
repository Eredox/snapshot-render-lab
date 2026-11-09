import { describe, expect, it } from "vitest";
import { allRoutes } from "@/config/navigation";
import { publicLegalDocs } from "@/data/legal";
import { publishedPrivacy, publishedTerms } from "@/data/legal-published";
import { publishedLegalRegistry } from "@/data/legal-registry";
import { footerColumns } from "@/config/navigation";
import { siteUrl } from "@/config/site";
import { sitemapUrls } from "@/routes/sitemap[.]xml";

function sectionNumbers(document: typeof publishedTerms) {
  return document.sections.map((section) => Number(section.title.match(/^\d+/)?.[0]));
}

describe("published legal documents", () => {
  it("publishes the complete governed Terms and Privacy section sequences", () => {
    expect(publishedTerms.sections).toHaveLength(101);
    expect(publishedPrivacy.sections).toHaveLength(138);
    expect(sectionNumbers(publishedTerms)).toEqual(Array.from({ length: 101 }, (_, i) => i + 1));
    expect(sectionNumbers(publishedPrivacy)).toEqual(Array.from({ length: 138 }, (_, i) => i + 1));
  });

  it("uses final publication metadata and verified Eredox identity", () => {
    for (const document of [publishedTerms, publishedPrivacy]) {
      expect(document.metadata.version).toBe("1.1");
      expect(document.metadata.status).toBe("published_current");
      expect(document.metadata.publication_status).toBe("published");
      expect(document.metadata.effective_date).toBe("2026-09-24");
      expect(document.metadata.updated_date).toBe("2026-11-09");
      expect(JSON.stringify(document)).toContain("Eredox Pty Ltd");
    }
  });

  it("does not expose publication-review scaffolding in the customer copy", () => {
    for (const document of [publishedTerms, publishedPrivacy]) {
      expect(JSON.stringify(document)).not.toMatch(
        /1\.1-draft|Draft — Internal Review|Not yet effective|Not the current customer|working draft/i,
      );
    }
  });

  it("keeps the public legal surface local while pending documents stay hidden", () => {
    expect(allRoutes).toContain("/legal/terms");
    expect(allRoutes).toContain("/legal/privacy");
    expect(publicLegalDocs.map((document) => document.slug)).toEqual(["cookies", "accessibility"]);
    expect(publicLegalDocs.some((document) => document.slug === "dpa")).toBe(false);
    expect(publicLegalDocs.some((document) => document.slug === "ai-features")).toBe(false);
    expect(publicLegalDocs.some((document) => document.slug === "subprocessors")).toBe(false);
  });

  it("publishes complete supporting policies with current metadata", () => {
    expect(publicLegalDocs.map((document) => document.slug)).toEqual(["cookies", "accessibility"]);
    for (const document of publicLegalDocs) {
      expect(document.version).toBe("1.1");
      expect(document.effectiveDate).toBe("2026-11-09");
      expect(document.lastReviewed).toBe("2026-11-09");
      expect(document.sections.length).toBeGreaterThan(5);
      expect(JSON.stringify(document)).not.toMatch(/Draft|Internal Review|Not yet effective/i);
    }
  });

  it("states the actual third-party processing: no Google Fonts request, Brevo disclosed, history-state booking details", () => {
    const text = (slug: string) => JSON.stringify(publicLegalDocs.find((document) => document.slug === slug));
    expect(text("cookies")).not.toMatch(/fonts\.(googleapis|gstatic)|Google Fonts domains/);
    expect(text("cookies")).toMatch(/Brevo/);
    expect(text("cookies")).toMatch(/history entry/);
    expect(text("accessibility")).not.toMatch(/Google Fonts/);
  });

  it("discloses the DeepSeek-powered public assistant, overseas processing including China, and separates it from authenticated AI", () => {
    const section = (document: typeof publishedTerms, prefix: string) => document.sections.find((s) => s.title.startsWith(prefix))?.body ?? "";
    const privacy61 = section(publishedPrivacy, "61.");
    expect(privacy61).toMatch(/Public website information assistant/);
    expect(privacy61).toMatch(/DeepSeek/);
    expect(privacy61).toMatch(/People's Republic of China/);
    expect(privacy61).toContain("Google (Gemini text-to-speech)");
    expect(privacy61).toMatch(/Do not enter personal information, confidential information/);
    expect(privacy61).toMatch(/Authenticated NOVA AI features/);
    expect(privacy61).not.toMatch(/does not hold a platform-level credential/);
    const terms30 = section(publishedTerms, "30.");
    expect(terms30).toMatch(/separate from the Services/);
    expect(terms30).not.toMatch(/does not itself hold or supply credentials/);
    const cookies = JSON.stringify(publicLegalDocs.find((d) => d.slug === "cookies"));
    expect(cookies).toMatch(/nova\.assistant\.v1/);
    expect(cookies).toMatch(/DeepSeek/);
    expect(cookies).not.toMatch(/No public-site sessionStorage key was found/);
  });

  it("keeps the published registry aligned with the Legal Centre, footer and sitemap", () => {
    const registryRoutes = publishedLegalRegistry.map((document) => document.route);
    expect(registryRoutes).toEqual([
      "/legal/terms",
      "/legal/privacy",
      "/legal/cookies",
      "/legal/accessibility",
    ]);
    expect(registryRoutes.every((route) => allRoutes.includes(route))).toBe(true);
    const footerRoutes = footerColumns.flatMap((column) => column.items).map((item) => item.to);
    expect(registryRoutes.every((route) => footerRoutes.includes(route))).toBe(true);
    const sitemapRoutes = sitemapUrls().map((url) => url.loc);
    expect(registryRoutes.every((route) => sitemapRoutes.includes(route))).toBe(true);
    expect(
      sitemapUrls().every(
        (url) => url.loc.startsWith("/") && `${siteUrl}${url.loc}`.startsWith(siteUrl),
      ),
    ).toBe(true);
    expect(sitemapRoutes).not.toContain("/legal/dpa");
    expect(sitemapRoutes).not.toContain("/legal/ai-features");
    expect(sitemapRoutes).not.toContain("/legal/subprocessors");
  });

  it("does not expose application-domain legal links or review banners", () => {
    const publicCopy = JSON.stringify({ publishedLegalRegistry, footerColumns });
    expect(publicCopy).not.toContain("nova.eredox.com/terms");
    expect(publicCopy).not.toContain("nova.eredox.com/privacy");
    expect(publicCopy).not.toMatch(/Back to Dashboard|Draft — Internal Review|Not yet effective/);
  });
});
