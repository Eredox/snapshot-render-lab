import { describe, expect, it } from "vitest";
import { allRoutes } from "@/config/navigation";
import { governedFrameworkCatalogue } from "@/data/framework-catalogue";
import { integrations } from "@/data/integrations";
import { faqCategories, homepageFaqItems } from "@/data/resources";
import { faqSchema } from "@/lib/seo";

const allFaqItems = faqCategories.flatMap((category) => category.items);

describe("governed FAQ library", () => {
  it("uses the current eight buyer-led categories", () => {
    expect(faqCategories.map((category) => category.category)).toEqual([
      "About NOVA",
      "Getting started",
      "Frameworks & requirements",
      "Evidence & automation",
      "Audit & assurance",
      "AI governance & human oversight",
      "Security & trust",
      "Commercial & support",
    ]);
    expect(allFaqItems.length).toBe(39);
  });

  it("derives the homepage from exactly five curated governed records", () => {
    expect(homepageFaqItems).toHaveLength(5);
    expect(homepageFaqItems.map((item) => item.question)).toEqual([
      "What does NOVA actually do that spreadsheets and shared folders do not?",
      "What does \"27 available frameworks\" mean?",
      "What does NOVA actually automate, and what still needs human approval?",
      "Do we still need an independent auditor or certification body?",
      "How does NOVA help us govern AI use?",
    ]);
    expect(homepageFaqItems.every((item) => allFaqItems.some((candidate) => candidate.question === item.question))).toBe(true);
  });

  it("derives framework and integration answers from governed inventories", () => {
    const frameworkAnswer = allFaqItems.find((item) => item.question === "What does \"27 available frameworks\" mean?")?.answer;
    const integrationAnswer = allFaqItems.find((item) => item.question === "Which integrations and connectors are available today?")?.answer;
    const availableIntegration = integrations.find((integration) => integration.status === "Available now");
    expect(frameworkAnswer).toContain(String(governedFrameworkCatalogue.availableCount));
    expect(availableIntegration).toBeDefined();
    expect(integrationAnswer).toContain(availableIntegration!.name);
  });

  it("removes stale planned-framework wording and keeps internal links valid", () => {
    expect(allFaqItems.some((item) => item.question === "Which frameworks are planned?")).toBe(false);
    for (const item of allFaqItems) {
      for (const link of item.links ?? []) {
        expect(allRoutes).toContain(link.to);
      }
    }
  });

  it("keeps FAQ structured data aligned with the full visible question set", () => {
    const schema = faqSchema(allFaqItems);
    expect(schema.mainEntity).toHaveLength(allFaqItems.length);
    expect(schema.mainEntity.map((item) => item.name)).toEqual(allFaqItems.map((item) => item.question));
    expect(schema.mainEntity.map((item) => item.acceptedAnswer.text)).toEqual(allFaqItems.map((item) => item.answer));
  });
});
