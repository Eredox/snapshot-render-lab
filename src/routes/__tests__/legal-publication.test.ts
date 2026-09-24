import { describe, expect, it } from "vitest";
import { allRoutes } from "@/config/navigation";
import { publicLegalDocs } from "@/data/legal";
import { publishedPrivacy, publishedTerms } from "@/data/legal-published";

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
      expect(document.metadata.updated_date).toBe("2026-09-24");
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
});
