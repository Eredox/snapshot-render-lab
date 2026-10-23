import { describe, expect, it } from "vitest";

import { appUrls } from "@/config/site";
import { getPlan, plans, registrationUrl } from "./pricing";

describe("public pricing acquisition contract", () => {
  it("uses the Founder-approved USD catalogue", () => {
    expect(plans.map((plan) => [plan.slug, plan.monthly, plan.annual])).toEqual([
      ["free", 0, 0],
      ["launch", 99, 990],
      ["growth", 249, 2490],
      ["professional", 499, 4990],
      ["business", 799, 7990],
      ["enterprise", null, null],
    ]);
  });

  it("hands self-service plans to registration with only plan and interval", () => {
    for (const slug of ["free", "launch", "growth", "professional", "business"] as const) {
      const plan = getPlan(slug);
      expect(plan).toBeDefined();
      const url = new URL(registrationUrl(plan!, "annual"));
      expect(url.origin + url.pathname).toBe(appUrls.register);
      expect(Object.fromEntries(url.searchParams.entries())).toEqual({
        plan: slug,
        billing_cycle: slug === "free" ? "monthly" : "annual",
      });
      expect(url.search).not.toMatch(/price|amount|currency/i);
    }
  });

  it("uses the governed acquisition labels for every plan", () => {
    expect(plans.map((plan) => [plan.slug, plan.primaryAction.label])).toEqual([
      ["free", "Get Started Free"],
      ["launch", "Get Started"],
      ["growth", "Get Started"],
      ["professional", "Get Started"],
      ["business", "Get Started"],
      ["enterprise", "Contact Sales"],
    ]);
  });

  it("keeps Enterprise on the quote path", () => {
    const enterprise = getPlan("enterprise");
    expect(enterprise).toBeDefined();
    expect(registrationUrl(enterprise!, "monthly")).toBe("/request-quote?plan=enterprise");
  });
});
