import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

import { appUrls } from "@/config/site";
import { canonicalPlanManifest } from "@/data/canonical-plan-manifest";
import { getPlan, plans, registrationUrl } from "@/data/pricing";

const root = resolve(process.cwd(), "src");

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return entry === "__tests__" ? [] : sourceFiles(path);
    return /\.(ts|tsx)$/.test(entry) && !/\.test\./.test(entry) ? [path] : [];
  });
}

// Legal documents are published verbatim from the governed legal registry and are not marketing copy.
const customerFacing = sourceFiles(root).filter((path) => !/legal/i.test(path));

describe("website to subscription journey", () => {
  it("never offers a free trial on any customer-facing page", () => {
    for (const file of customerFacing) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/start (your )?free trial|free trial|trial period|try (it )?free for/i);
    }
  });

  it("shows no Australian-dollar pricing anywhere in customer-facing source", () => {
    for (const file of customerFacing) {
      const text = readFileSync(file, "utf8");
      expect(text, file).not.toMatch(/\bAUD\b|\bA\$|\bAU\$|Australian dollars?/);
    }
    expect(canonicalPlanManifest.currency_code).toBe("USD");
  });

  it("states no framework-count restriction: every plan has all available frameworks", () => {
    for (const plan of Object.values(canonicalPlanManifest.plans)) {
      expect(plan.framework_entitlement).toEqual({ mode: "all_available", limit: null });
    }
    for (const file of ["src/data/pricing.ts", "src/data/plan-details.ts"]) {
      const text = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(text, file).not.toMatch(/\b(1|one|2|two|3|three|single)\s+(activated\s+)?frameworks?\b/i);
    }
  });

  it("uses the governed acquisition label for every plan", () => {
    expect(Object.fromEntries(plans.map((plan) => [plan.slug, plan.primaryAction.label]))).toEqual({
      free: "Create Free Workspace",
      launch: "Subscribe to Launch",
      growth: "Subscribe to Growth",
      professional: "Subscribe to Professional",
      business: "Subscribe to Business",
      enterprise: "Request a Quote",
    });
  });

  it("carries the selected plan and billing interval, and nothing else, into registration", () => {
    for (const slug of ["launch", "growth", "professional", "business"] as const) {
      for (const billing of ["monthly", "annual"] as const) {
        const url = new URL(registrationUrl(getPlan(slug)!, billing));
        expect(url.origin + url.pathname).toBe(appUrls.register);
        expect([...url.searchParams.entries()]).toEqual([
          ["plan", slug],
          ["billing_cycle", billing],
        ]);
      }
    }
    // Free has no billing interval, and a Free choice never carries a paid plan
    const free = new URL(registrationUrl(getPlan("free")!, "annual"));
    expect(Object.fromEntries(free.searchParams.entries())).toEqual({ plan: "free", billing_cycle: "monthly" });
    // the default (monthly) action of every card is the same link the card builds for the monthly toggle
    for (const plan of plans.filter((p) => !p.quoteOnly)) {
      expect(plan.primaryAction.to).toBe(registrationUrl(plan, "monthly"));
    }
  });

  it("keeps Enterprise on the quote path and never in self-service registration", () => {
    const enterprise = getPlan("enterprise")!;
    expect(enterprise.quoteOnly).toBe(true);
    expect(registrationUrl(enterprise, "annual")).toBe("/request-quote?plan=enterprise");
    expect(enterprise.primaryAction.label).toBe("Request a Quote");
  });

  it("builds the billing-aware links on the pricing and plan pages from the single link builder", () => {
    const pricing = readFileSync(resolve(process.cwd(), "src/routes/pricing.tsx"), "utf8");
    const planPage = readFileSync(resolve(process.cwd(), "src/routes/plans.$slug.tsx"), "utf8");
    expect(pricing).toContain("registrationUrl(p, billing)");
    expect(pricing).toContain("search={{ billing }}");
    expect(planPage).toContain("registrationUrl(plan, billing)");
    expect(planPage).toContain('search["billing"] === "annual"');
  });

  it("labels every Free signup surface Create Free Workspace", () => {
    for (const file of ["src/components/site/Header.tsx", "src/components/site/cta.tsx", "src/routes/index.tsx", "src/routes/pricing.tsx", "src/routes/start.tsx"]) {
      const text = readFileSync(resolve(process.cwd(), file), "utf8");
      expect(text, file).toContain("Create Free Workspace");
      expect(text, file).not.toMatch(/Start Free\b|Get Started Free/);
    }
  });
});
