import { describe, expect, it } from "vitest";

import { canonicalPlanManifest, canonicalPlanManifestSha256 } from "./canonical-plan-manifest";
import { comparison, getPlan, plans } from "./pricing";

describe("canonical public plan manifest", () => {
  it("contains the six governed plan identities and bound manifest metadata", () => {
    expect(canonicalPlanManifest.version).toBe("2026-10-26");
    expect(canonicalPlanManifest.currency_code).toBe("USD");
    expect(canonicalPlanManifestSha256).toBe(
      "4361bfe4df719a85519cc4cef96bbf56fd7161f29209dd7e0a6d1e3607b692cf",
    );
    expect(Object.keys(canonicalPlanManifest.plans)).toEqual([
      "free",
      "launch",
      "growth",
      "professional",
      "business",
      "enterprise",
    ]);
  });

  it("keeps public pricing and entitlement presentation aligned", () => {
    expect(plans.map((plan) => [plan.slug, plan.monthly, plan.annual])).toEqual([
      ["free", 0, 0],
      ["launch", 99, 990],
      ["growth", 249, 2490],
      ["professional", 499, 4990],
      ["business", 799, 7990],
      ["enterprise", null, null],
    ]);
    for (const slug of ["free", "launch", "growth", "professional", "business", "enterprise"]) {
      expect(getPlan(slug)?.frameworkEntitlement, slug).toBe("All available frameworks");
    }
    expect(getPlan("launch")?.githubRepositoryEntitlement).toBe("Up to 1 authorised repository");
    expect(getPlan("growth")?.githubRepositoryEntitlement).toBe("Up to 3 authorised repositories");
  });

  it("uses the governed matrix in comparison rows", () => {
    const rows = comparison.flatMap((group) => group.rows);
    const frameworks = rows.find((row) => row.label === "Activated frameworks");
    const github = rows.find((row) => row.label === "GitHub repositories");
    const reuse = rows.find((row) => row.label === "Cross-framework control reuse");

    expect(frameworks?.values).toEqual({
      free: "All available frameworks",
      launch: "All available frameworks",
      growth: "All available frameworks",
      professional: "All available frameworks",
      business: "All available frameworks",
      enterprise: "All available frameworks",
    });
    expect(github?.values).toEqual({
      free: "No GitHub connector",
      launch: "Up to 1 authorised repository",
      growth: "Up to 3 authorised repositories",
      professional: "All authorised repositories",
      business: "All authorised repositories",
      enterprise: "All authorised repositories",
    });
    expect(reuse?.values).toEqual({
      free: "—",
      launch: "Included",
      growth: "Included",
      professional: "Included",
      business: "Included",
      enterprise: "Included",
    });
  });
});
