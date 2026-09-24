import { describe, expect, it } from "vitest";

import { allRoutes } from "@/config/navigation";
import { frameworks } from "@/data/frameworks";
import { audiencePaths, homepageFunnelSectionOrder, outcomePaths } from "@/data/homepage-funnel";

describe("homepage funnel contract", () => {
  it("keeps the approved section order and one hero/AI entry point", () => {
    expect(homepageFunnelSectionOrder).toEqual([
      "hero",
      "ai-governance",
      "audience",
      "why-nova",
      "product-proof",
      "frameworks",
      "outcomes",
      "trust",
      "faq",
      "pricing",
      "final-cta",
    ]);
  });

  it("presents the four approved audience paths", () => {
    expect(audiencePaths.map((audience) => audience.title)).toEqual([
      "Founders & growing teams",
      "Compliance & risk teams",
      "Security & technology teams",
      "Auditors & assurance",
    ]);
  });

  it("keeps all homepage audience and outcome destinations in the public route registry", () => {
    const paths = [
      ...audiencePaths.map((audience) => audience.to),
      ...outcomePaths.map((outcome) => outcome.to),
    ];
    for (const path of paths) {
      expect(allRoutes).toContain(path);
    }
  });

  it("keeps the homepage audience content readable without hover-only access", () => {
    for (const audience of audiencePaths) {
      expect(audience.body.length).toBeGreaterThan(20);
      expect(audience.cta.length).toBeGreaterThan(10);
    }
  });

  it("keeps framework status language explicit", () => {
    expect(
      frameworks
        .filter((framework) => framework.availability === "Available now")
        .map((framework) => framework.shortName),
    ).toEqual(["SOC 2", "ISO 27001", "Essential Eight", "ISO 42001"]);
    expect(
      frameworks.filter((framework) => framework.availability === "Available by configuration"),
    ).toHaveLength(4);
  });

  it("prepares the approved audience image paths without rendering missing assets", () => {
    for (const audience of audiencePaths) {
      expect(audience.imagePath).toMatch(/^\/media\/audience\/nova-[a-z0-9-]+\.webp$/);
      expect(audience.imageAlt.length).toBeGreaterThan(30);
      expect(audience.imageWidth).toBe(1448);
      expect(audience.imageHeight).toBe(1086);
    }
  });
});
