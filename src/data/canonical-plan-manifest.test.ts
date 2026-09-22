import { describe, expect, it } from "vitest";

import { canonicalPlanManifest, canonicalPlanManifestSha256 } from "./canonical-plan-manifest";
import { comparison, getPlan, plans } from "./pricing";

describe("canonical public plan manifest", () => {
  it("contains the six governed plan identities and bound manifest metadata", () => {
    expect(canonicalPlanManifest.version).toBe("2026-09-22");
    expect(canonicalPlanManifestSha256).toBe(
      "54a41affccca6cb8a209b3bb72e974b6db2d62ab2692ab2660a4d8e1b44eceec",
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
    expect(getPlan("launch")?.frameworkEntitlement).toBe("3 activated frameworks");
    expect(getPlan("launch")?.githubRepositoryEntitlement).toBe("Up to 1 authorised repository");
    expect(getPlan("growth")?.githubRepositoryEntitlement).toBe("Up to 3 authorised repositories");
    expect(getPlan("professional")?.frameworkEntitlement).toBe("All available frameworks");
    expect(getPlan("enterprise")?.frameworkEntitlement).toBe("Frameworks defined by agreed scope");
  });

  it("uses the governed matrix in comparison rows", () => {
    const rows = comparison.flatMap((group) => group.rows);
    const frameworks = rows.find((row) => row.label === "Activated frameworks");
    const github = rows.find((row) => row.label === "GitHub repositories");
    const reuse = rows.find((row) => row.label === "Cross-framework control reuse");

    expect(frameworks?.values).toEqual({
      free: "1 framework",
      launch: "3 frameworks",
      growth: "3 frameworks",
      professional: "All available frameworks",
      business: "All available frameworks",
      enterprise: "Frameworks defined by agreed scope",
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
