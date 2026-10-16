import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { getComplianceJourneyCtaAction } from "@/lib/compliance-journey-cta";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("global compliance journey CTA placement", () => {
  const root = read("src/routes/__root.tsx");
  const pricing = read("src/routes/pricing.tsx");
  const homepage = read("src/routes/index.tsx");

  it("renders the shared CTA after page content and immediately before the footer", () => {
    expect(root.indexOf("<Outlet />")).toBeLessThan(root.indexOf("<ComplianceJourneyCta"));
    expect(root.indexOf("<ComplianceJourneyCta")).toBeLessThan(root.indexOf("<Footer />"));
    expect(root).toContain("shouldRenderRootComplianceJourneyCta(pathname)");
  });

  it("places exactly one CTA between Support by plan and Pricing questions", () => {
    expect(pricing.match(/<ComplianceJourneyCta/g)).toHaveLength(1);
    expect(pricing.indexOf("Support by plan")).toBeLessThan(
      pricing.indexOf("<ComplianceJourneyCta"),
    );
    expect(pricing.indexOf("<ComplianceJourneyCta")).toBeLessThan(
      pricing.indexOf("Pricing questions"),
    );
  });

  it("removes the homepage duplicate and preserves all CTA actions", () => {
    expect(homepage).not.toContain("Guided compliance journey");
    expect(homepage).not.toContain("Start your compliance journey without spreadsheets");
    expect(getComplianceJourneyCtaAction("/about").label).toBe("Start the guided journey");
    expect(getComplianceJourneyCtaAction("/compliance-journey").label).toBe(
      "Revisit the assessment",
    );
    expect(getComplianceJourneyCtaAction("/compliance-journey").to).toBe(
      "/compliance-journey#questionnaire",
    );
  });
});
