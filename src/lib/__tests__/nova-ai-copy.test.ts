import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { novaAiCopy } from "@/config/site";
import { features } from "@/data/features";

describe("NOVA AI teammate positioning", () => {
  it("keeps the founder-approved positioning and authority boundary together", () => {
    const aiAssistant = features.find((feature) => feature.slug === "ai-assistant");

    expect(aiAssistant).toBeDefined();
    expect(aiAssistant?.heroTitle).toBe(novaAiCopy.heroTitle);
    expect(aiAssistant?.heroDescription).toBe(novaAiCopy.heroDescription);
    expect(aiAssistant?.positioning?.title).toBe(novaAiCopy.positioningTitle);
    expect(aiAssistant?.summary).toBe(novaAiCopy.heroDescription);
    expect(aiAssistant?.humanResponsibilities).toContain(
      "Approving any statement made to a customer, auditor or regulator",
    );
    expect(novaAiCopy.availabilityNote).toContain("Pricing page");
  });

  it("publishes the homepage control language without unapproved replacement slogans", () => {
    const homepage = readFileSync(resolve(process.cwd(), "src/routes/index.tsx"), "utf8");

    expect(homepage).toContain("You're in control.");
    expect(homepage).toContain("novaAiCopy.whatNovaDoes");
    expect(homepage).toContain("novaAiCopy.whatYouControl");
    expect(homepage).not.toContain("It does not approve anything.");
    expect(homepage).not.toContain("AI assistance. Your decisions.");
    expect(homepage).not.toContain("We'll help you configure it");
  });

  it("scopes the shared sidebar disclaimer removal to AI Assistant", () => {
    const featureRoute = readFileSync(
      resolve(process.cwd(), "src/routes/features.$slug.tsx"),
      "utf8",
    );

    expect(featureRoute).toContain('feature.slug !== "ai-assistant"');
    expect(featureRoute).toContain("<Disclaimer>{site.humanStatement}</Disclaimer>");
    expect(featureRoute).toContain('feature.slug === "ai-assistant"');
    expect(featureRoute).toContain("Availability");
    expect(featureRoute).toContain("Relevant frameworks");
  });
});
