import { describe, expect, it } from "vitest";
import { allRoutes, dynamicRoutes } from "@/config/navigation";
import { industries, industrySlugs } from "@/data/industries";
import { sitemapUrls } from "@/routes/sitemap[.]xml";

describe("canonical industries", () => {
  it("uses one canonical dataset for the index, detail routes and route registry", () => {
    expect(industrySlugs).toEqual([
      "technology",
      "financial-services",
      "healthcare",
      "government-suppliers",
      "professional-services",
    ]);
    expect(industries).toHaveLength(5);
    expect(dynamicRoutes.find((route) => route.pattern === "/industries/$slug")?.slugs).toEqual(
      industrySlugs,
    );
    expect(industrySlugs.every((slug) => allRoutes.includes(`/industries/${slug}`))).toBe(true);
  });

  it("contains no stale industry URLs in the sitemap", () => {
    const routes = sitemapUrls().map((url) => url.loc);
    for (const stale of ["finance", "government", "legal", "startups"]) {
      expect(routes).not.toContain(`/industries/${stale}`);
    }
    for (const slug of industrySlugs) {
      expect(routes).toContain(`/industries/${slug}`);
    }
  });
});
