import { describe, expect, it } from "vitest";

import {
  getComplianceJourneyCtaAction,
  normalizePathname,
  shouldRenderRootComplianceJourneyCta,
} from "@/lib/compliance-journey-cta";

describe("global compliance journey CTA placement", () => {
  it("normalizes trailing slashes and query/hash suffixes safely", () => {
    expect(normalizePathname("/pricing/")).toBe("/pricing");
    expect(normalizePathname("/pricing/?billing=annual")).toBe("/pricing");
    expect(normalizePathname("/compliance-journey/#questionnaire")).toBe("/compliance-journey");
    expect(normalizePathname("////")).toBe("/");
  });

  it("excludes only pricing from the root CTA", () => {
    expect(shouldRenderRootComplianceJourneyCta("/pricing")).toBe(false);
    expect(shouldRenderRootComplianceJourneyCta("/pricing/")).toBe(false);
    expect(shouldRenderRootComplianceJourneyCta("/features/ai-assistant")).toBe(true);
    expect(shouldRenderRootComplianceJourneyCta("/features/ai-assistant/")).toBe(true);
  });

  it("uses the guided journey action on standard pages and a revisit action on itself", () => {
    expect(getComplianceJourneyCtaAction("/about")).toEqual({
      label: "Start the guided journey",
      to: "/compliance-journey",
    });
    expect(getComplianceJourneyCtaAction("/compliance-journey/")).toEqual({
      label: "Revisit the assessment",
      to: "/compliance-journey#questionnaire",
    });
  });
});
