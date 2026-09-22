/**
 * Public-safe snapshot generated from backend/app/core/plans.py.
 *
 * Source manifest version: 2026-09-22
 * Source manifest SHA-256: 54a41affccca6cb8a209b3bb72e974b6db2d62ab2692ab2660a4d8e1b44eceec
 *
 * This file intentionally excludes internal billing and model details. The
 * entitlement modes are authoritative; consumers must not infer meaning from
 * null limits.
 */

export type FrameworkEntitlementMode = "capped" | "all_available" | "agreed_scope";
export type GitHubRepositoryEntitlementMode = "none" | "capped" | "all_authorised";

export type Entitlement<TMode extends string> = {
  mode: TMode;
  limit: number | null;
};

export type CanonicalPlan = {
  label: string;
  price_monthly: number | null;
  price_annual: number | null;
  max_users: number | null;
  max_frameworks: number | null;
  max_controls: number | null;
  max_connectors: number | null;
  framework_entitlement: Entitlement<FrameworkEntitlementMode>;
  github_repository_entitlement: Entitlement<GitHubRepositoryEntitlementMode>;
  cross_framework_reuse_enabled: boolean;
  ai_agents_enabled: boolean;
  trust_center_enabled: boolean;
  auditor_portal_enabled: boolean;
  software_assurance_enabled: boolean;
  software_assurance_full_evidence_pack_enabled: boolean;
  support_level: string;
  billing_available: boolean;
  quote_required: boolean;
};

export const canonicalPlanManifestVersion = "2026-09-22";
export const canonicalPlanManifestSha256 =
  "54a41affccca6cb8a209b3bb72e974b6db2d62ab2692ab2660a4d8e1b44eceec";

export const canonicalPlanManifest = {
  version: canonicalPlanManifestVersion,
  plans: {
    free: {
      label: "Free",
      price_monthly: 0,
      price_annual: 0,
      max_users: 2,
      max_frameworks: 1,
      max_controls: 10,
      max_connectors: 1,
      framework_entitlement: { mode: "capped", limit: 1 },
      github_repository_entitlement: { mode: "none", limit: 0 },
      cross_framework_reuse_enabled: false,
      ai_agents_enabled: false,
      trust_center_enabled: false,
      auditor_portal_enabled: false,
      software_assurance_enabled: false,
      software_assurance_full_evidence_pack_enabled: false,
      support_level: "self_service",
      billing_available: false,
      quote_required: false,
    },
    launch: {
      label: "Launch",
      price_monthly: 99,
      price_annual: 990,
      max_users: 5,
      max_frameworks: 3,
      max_controls: 50,
      max_connectors: 1,
      framework_entitlement: { mode: "capped", limit: 3 },
      github_repository_entitlement: { mode: "capped", limit: 1 },
      cross_framework_reuse_enabled: true,
      ai_agents_enabled: false,
      trust_center_enabled: false,
      auditor_portal_enabled: false,
      software_assurance_enabled: true,
      software_assurance_full_evidence_pack_enabled: false,
      support_level: "standard",
      billing_available: true,
      quote_required: false,
    },
    growth: {
      label: "Growth",
      price_monthly: 249,
      price_annual: 2490,
      max_users: 15,
      max_frameworks: 3,
      max_controls: 200,
      max_connectors: 3,
      framework_entitlement: { mode: "capped", limit: 3 },
      github_repository_entitlement: { mode: "capped", limit: 3 },
      cross_framework_reuse_enabled: true,
      ai_agents_enabled: true,
      trust_center_enabled: false,
      auditor_portal_enabled: false,
      software_assurance_enabled: true,
      software_assurance_full_evidence_pack_enabled: false,
      support_level: "standard",
      billing_available: true,
      quote_required: false,
    },
    professional: {
      label: "Professional",
      price_monthly: 499,
      price_annual: 4990,
      max_users: 30,
      max_frameworks: null,
      max_controls: null,
      max_connectors: null,
      framework_entitlement: { mode: "all_available", limit: null },
      github_repository_entitlement: { mode: "all_authorised", limit: null },
      cross_framework_reuse_enabled: true,
      ai_agents_enabled: true,
      trust_center_enabled: true,
      auditor_portal_enabled: true,
      software_assurance_enabled: true,
      software_assurance_full_evidence_pack_enabled: false,
      support_level: "priority",
      billing_available: true,
      quote_required: false,
    },
    business: {
      label: "Business",
      price_monthly: 799,
      price_annual: 7990,
      max_users: null,
      max_frameworks: null,
      max_controls: null,
      max_connectors: null,
      framework_entitlement: { mode: "all_available", limit: null },
      github_repository_entitlement: { mode: "all_authorised", limit: null },
      cross_framework_reuse_enabled: true,
      ai_agents_enabled: true,
      trust_center_enabled: true,
      auditor_portal_enabled: true,
      software_assurance_enabled: true,
      software_assurance_full_evidence_pack_enabled: false,
      support_level: "priority_plus_implementation",
      billing_available: true,
      quote_required: false,
    },
    enterprise: {
      label: "Enterprise",
      price_monthly: null,
      price_annual: null,
      max_users: null,
      max_frameworks: null,
      max_controls: null,
      max_connectors: null,
      framework_entitlement: { mode: "agreed_scope", limit: null },
      github_repository_entitlement: { mode: "all_authorised", limit: null },
      cross_framework_reuse_enabled: true,
      ai_agents_enabled: true,
      trust_center_enabled: true,
      auditor_portal_enabled: true,
      software_assurance_enabled: true,
      software_assurance_full_evidence_pack_enabled: true,
      support_level: "enhanced_agreed",
      billing_available: false,
      quote_required: true,
    },
  },
} as const satisfies {
  version: string;
  plans: Record<string, CanonicalPlan>;
};

export type CanonicalPlanId = keyof typeof canonicalPlanManifest.plans;

export function frameworkEntitlementLabel(plan: CanonicalPlan): string {
  switch (plan.framework_entitlement.mode) {
    case "capped":
      return `${plan.framework_entitlement.limit} activated ${plan.framework_entitlement.limit === 1 ? "framework" : "frameworks"}`;
    case "all_available":
      return "All available frameworks";
    case "agreed_scope":
      return "Frameworks defined by agreed scope";
  }
}

export function githubRepositoryEntitlementLabel(plan: CanonicalPlan): string {
  switch (plan.github_repository_entitlement.mode) {
    case "none":
      return "No GitHub connector";
    case "capped":
      return `Up to ${plan.github_repository_entitlement.limit} authorised ${plan.github_repository_entitlement.limit === 1 ? "repository" : "repositories"}`;
    case "all_authorised":
      return "All authorised repositories";
  }
}
