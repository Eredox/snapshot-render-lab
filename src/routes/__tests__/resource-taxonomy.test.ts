import { describe, it, expect } from "vitest";
import {
  resources,
  resourceTypes,
  typeRoutes,
  resourcePath,
  legacyResourceRedirects,
  publishedResources,
} from "@/data/resources";
import { allRoutes } from "@/config/navigation";

describe("resource taxonomy", () => {
  it("every resource has a known type", () => {
    for (const r of resources) {
      expect(resourceTypes).toContain(r.type);
    }
  });

  it("slugs are unique across all resource types", () => {
    const slugs = resources.map((r) => r.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("each resource resolves to exactly one canonical route section", () => {
    for (const r of resources) {
      expect(resourcePath(r)).toBe(`${typeRoutes[r.type]}/${r.slug}`);
      const owningSections = Object.values(typeRoutes).filter((base) => resourcePath(r).startsWith(`${base}/`));
      expect(owningSections).toHaveLength(1);
    }
  });

  it("published resources are registered as routes", () => {
    for (const r of publishedResources) {
      expect(allRoutes).toContain(resourcePath(r));
    }
  });

  it("published resources have a body and a publication date", () => {
    for (const r of publishedResources) {
      expect(r.sections?.length).toBeGreaterThan(0);
      expect(r.published).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("coming soon items never expose a body", () => {
    for (const r of resources.filter((x) => x.status === "Coming soon")) {
      expect(r.sections).toBeUndefined();
    }
  });

  it("legacy redirects point at the current canonical path", () => {
    for (const [from, to] of Object.entries(legacyResourceRedirects)) {
      expect(from).not.toBe(to);
      const slug = to.split("/").pop()!;
      const resource = resources.find((r) => r.slug === slug);
      expect(resource).toBeDefined();
      expect(to).toBe(resourcePath(resource!));
    }
  });
});
