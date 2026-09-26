import { site } from "@/config/site";
import {
  canonicalPlanManifest,
  frameworkEntitlementLabel,
  githubRepositoryEntitlementLabel,
  type CanonicalPlan,
} from "@/data/canonical-plan-manifest";

export const currency = "AUD";

export type Plan = {
  slug: string;
  name: string;
  summary: string;
  /** Indicative monthly amount in AUD, or null when the plan is quote-only. */
  monthly: CanonicalPlan["price_monthly"];
  /** Indicative annual total in AUD when billed annually. */
  annual: CanonicalPlan["price_annual"];
  quoteOnly?: boolean;
  highlight?: boolean;
  /** True while the amount has not been approved by Eredox. */
  requiresApproval: boolean;
  bestFor: string;
  includes: string[];
  support: string;
  primaryAction: { label: string; to: string };
  detailPath: string;
  frameworkEntitlement: string;
  githubRepositoryEntitlement: string;
  maxUsers: number | null;
  maxControls: number | null;
  crossFrameworkReuseEnabled: boolean;
};

export const plans: Plan[] = [
  {
    slug: "free",
    name: "Free",
    summary: "Evaluate the workflow with a single framework and a small control set.",
    monthly: canonicalPlanManifest.plans.free.price_monthly,
    annual: canonicalPlanManifest.plans.free.price_annual,
    requiresApproval: false,
    bestFor: "Teams assessing whether the workflow fits before committing",
    includes: [
      "One activated framework",
      "Core control library",
      "Manual evidence upload",
      "Up to 2 users, including one administrator",
    ],
    support: "Documentation and community resources",
    primaryAction: { label: "Explore Free access", to: "/start" },
    detailPath: "/plans/free",
    frameworkEntitlement: frameworkEntitlementLabel(canonicalPlanManifest.plans.free),
    githubRepositoryEntitlement: githubRepositoryEntitlementLabel(canonicalPlanManifest.plans.free),
    maxUsers: canonicalPlanManifest.plans.free.max_users,
    maxControls: canonicalPlanManifest.plans.free.max_controls,
    crossFrameworkReuseEnabled: canonicalPlanManifest.plans.free.cross_framework_reuse_enabled,
  },
  {
    slug: "launch",
    name: "Launch",
    summary: "A first certification or attestation programme run properly from the start.",
    monthly: canonicalPlanManifest.plans.launch.price_monthly,
    annual: canonicalPlanManifest.plans.launch.price_annual,
    requiresApproval: true,
    bestFor: "Startups preparing for their first enterprise security review",
    includes: [
      "3 activated frameworks",
      "Up to 1 authorised GitHub repository",
      "Control ownership and review cadence",
      "Evidence mapping and reviewer validation",
      "Policy versioning and approval",
      "Readiness reporting",
    ],
    support: "Email support during business hours",
    primaryAction: { label: "Contact sales", to: "/contact?plan=launch" },
    detailPath: "/plans/launch",
    frameworkEntitlement: frameworkEntitlementLabel(canonicalPlanManifest.plans.launch),
    githubRepositoryEntitlement: githubRepositoryEntitlementLabel(canonicalPlanManifest.plans.launch),
    maxUsers: canonicalPlanManifest.plans.launch.max_users,
    maxControls: canonicalPlanManifest.plans.launch.max_controls,
    crossFrameworkReuseEnabled: canonicalPlanManifest.plans.launch.cross_framework_reuse_enabled,
  },
  {
    slug: "growth",
    name: "Growth",
    summary: "Three frameworks on one shared control set, with reuse across requirements.",
    monthly: canonicalPlanManifest.plans.growth.price_monthly,
    annual: canonicalPlanManifest.plans.growth.price_annual,
    highlight: true,
    requiresApproval: true,
    bestFor: "Technology SMEs maintaining more than one obligation",
    includes: [
      "3 activated frameworks",
      "Cross-framework control and evidence reuse",
      "Up to 3 authorised GitHub repositories",
      "Risk register with treatment and acceptance",
      "GitHub evidence connector",
      "Trend and gap reporting",
    ],
    support: "Email support with prioritised response",
    primaryAction: { label: "Contact sales", to: "/contact?plan=growth" },
    detailPath: "/plans/growth",
    frameworkEntitlement: frameworkEntitlementLabel(canonicalPlanManifest.plans.growth),
    githubRepositoryEntitlement: githubRepositoryEntitlementLabel(canonicalPlanManifest.plans.growth),
    maxUsers: canonicalPlanManifest.plans.growth.max_users,
    maxControls: canonicalPlanManifest.plans.growth.max_controls,
    crossFrameworkReuseEnabled: canonicalPlanManifest.plans.growth.cross_framework_reuse_enabled,
  },
  {
    slug: "professional",
    name: "Professional",
    summary: "Assurance-grade operation with external review workflows included.",
    monthly: canonicalPlanManifest.plans.professional.price_monthly,
    annual: canonicalPlanManifest.plans.professional.price_annual,
    requiresApproval: true,
    bestFor: "Organisations undergoing recurring external assessment",
    includes: [
      "All available frameworks",
      "All authorised GitHub repositories",
      "Auditor Portal with scoped engagement access",
      "Trust Centre publication",
      "Asset register and classification",
      "Advanced role-based access",
    ],
    support: "Priority support with a named contact",
    primaryAction: { label: "Contact sales", to: "/contact?plan=professional" },
    detailPath: "/plans/professional",
    frameworkEntitlement: frameworkEntitlementLabel(canonicalPlanManifest.plans.professional),
    githubRepositoryEntitlement: githubRepositoryEntitlementLabel(canonicalPlanManifest.plans.professional),
    maxUsers: canonicalPlanManifest.plans.professional.max_users,
    maxControls: canonicalPlanManifest.plans.professional.max_controls,
    crossFrameworkReuseEnabled: canonicalPlanManifest.plans.professional.cross_framework_reuse_enabled,
  },
  {
    slug: "business",
    name: "Business",
    summary: "Broader scope, more users and deeper governance across business units.",
    monthly: canonicalPlanManifest.plans.business.price_monthly,
    annual: canonicalPlanManifest.plans.business.price_annual,
    requiresApproval: true,
    bestFor: "Regulated organisations with several teams inside one programme",
    includes: [
      "All available frameworks",
      "All authorised GitHub repositories",
      "Extended user and role capacity",
      "Multiple scopes within one tenant",
      "AI assistance across policies, evidence and gap identification",
      "Executive and board reporting views",
    ],
    support: "Priority support with onboarding assistance",
    primaryAction: { label: "Contact sales", to: "/contact?plan=business" },
    detailPath: "/plans/business",
    frameworkEntitlement: frameworkEntitlementLabel(canonicalPlanManifest.plans.business),
    githubRepositoryEntitlement: githubRepositoryEntitlementLabel(canonicalPlanManifest.plans.business),
    maxUsers: canonicalPlanManifest.plans.business.max_users,
    maxControls: canonicalPlanManifest.plans.business.max_controls,
    crossFrameworkReuseEnabled: canonicalPlanManifest.plans.business.cross_framework_reuse_enabled,
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    summary: "Quoted per organisation against scope, users and assurance requirements.",
    monthly: canonicalPlanManifest.plans.enterprise.price_monthly,
    annual: canonicalPlanManifest.plans.enterprise.price_annual,
    quoteOnly: canonicalPlanManifest.plans.enterprise.quote_required,
    requiresApproval: false,
    bestFor: "Complex environments with bespoke scope and assurance obligations",
    includes: [
      "All authorised GitHub repositories",
      "Scope defined per organisation",
      "Commercial terms agreed with Eredox",
      "Structured onboarding programme",
    ],
    support: "Agreed support arrangements",
    primaryAction: { label: "Request a quote", to: "/request-quote?plan=enterprise" },
    detailPath: "/plans/enterprise",
    frameworkEntitlement: frameworkEntitlementLabel(canonicalPlanManifest.plans.enterprise),
    githubRepositoryEntitlement: githubRepositoryEntitlementLabel(canonicalPlanManifest.plans.enterprise),
    maxUsers: canonicalPlanManifest.plans.enterprise.max_users,
    maxControls: canonicalPlanManifest.plans.enterprise.max_controls,
    crossFrameworkReuseEnabled: canonicalPlanManifest.plans.enterprise.cross_framework_reuse_enabled,
  },
];

export function getPlan(slug: string): Plan | undefined {
  return plans.find((plan) => plan.slug === slug);
}

export type ComparisonGroup = {
  group: string;
  rows: { label: string; values: Record<string, string> }[];
};

const y = "Included";
const n = "—";
const planBySlug = Object.fromEntries(plans.map((plan) => [plan.slug, plan])) as Record<string, Plan>;
const frameworkComparisonValue = (slug: string) => planBySlug[slug]!.frameworkEntitlement.replace(" activated", "");
const githubComparisonValue = (slug: string) => planBySlug[slug]!.githubRepositoryEntitlement;

export const comparison: ComparisonGroup[] = [
  {
    group: "Frameworks and controls",
    rows: [
      { label: "Activated frameworks", values: { free: frameworkComparisonValue("free"), launch: frameworkComparisonValue("launch"), growth: frameworkComparisonValue("growth"), professional: frameworkComparisonValue("professional"), business: frameworkComparisonValue("business"), enterprise: frameworkComparisonValue("enterprise") } },
      { label: "Shared control library", values: { free: y, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Cross-framework control reuse", values: { free: n, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Control testing records", values: { free: n, launch: y, growth: y, professional: y, business: y, enterprise: y } },
    ],
  },
  {
    group: "Evidence and policy",
    rows: [
      { label: "Manual evidence upload", values: { free: y, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Reviewer validation", values: { free: n, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "GitHub repositories", values: { free: githubComparisonValue("free"), launch: githubComparisonValue("launch"), growth: githubComparisonValue("growth"), professional: githubComparisonValue("professional"), business: githubComparisonValue("business"), enterprise: githubComparisonValue("enterprise") } },
      { label: "Policy versioning and approval", values: { free: n, launch: y, growth: y, professional: y, business: y, enterprise: y } },
    ],
  },
  {
    group: "Risk and assets",
    rows: [
      { label: "Risk register", values: { free: n, launch: n, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Explicit acceptance records", values: { free: n, launch: n, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Asset register", values: { free: n, launch: n, growth: n, professional: y, business: y, enterprise: y } },
    ],
  },
  {
    group: "Assurance and external review",
    rows: [
      { label: "Readiness reporting", values: { free: n, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Trust Centre publication", values: { free: n, launch: n, growth: n, professional: y, business: y, enterprise: y } },
      { label: "Auditor Portal", values: { free: n, launch: n, growth: n, professional: y, business: y, enterprise: y } },
      { label: "Executive and board views", values: { free: n, launch: n, growth: n, professional: n, business: y, enterprise: y } },
    ],
  },
  {
    group: "AI assistance",
    rows: [
      { label: "Requirement explanation", values: { free: y, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Evidence interpretation", values: { free: n, launch: n, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Policy and control drafting", values: { free: n, launch: n, growth: n, professional: y, business: y, enterprise: y } },
      { label: "Gap identification", values: { free: n, launch: n, growth: n, professional: y, business: y, enterprise: y } },
    ],
  },
];

export const supportComparison = [
  { plan: "Free", channel: "Documentation and community resources", response: "No response commitment", onboarding: "Self-service" },
  { plan: "Launch", channel: "Email during business hours", response: "Best-effort within business hours", onboarding: "Self-service with guided setup material" },
  { plan: "Growth", channel: "Email with prioritised queue", response: "Prioritised over standard queue", onboarding: "Guided setup session" },
  { plan: "Professional", channel: "Priority support with a named contact", response: "Prioritised handling", onboarding: "Structured onboarding" },
  { plan: "Business", channel: "Priority support with onboarding assistance", response: "Prioritised handling", onboarding: "Structured onboarding with programme review" },
  { plan: "Enterprise", channel: "Agreed support arrangements", response: "Agreed with Eredox", onboarding: "Agreed programme" },
];

export const pricingFaqs = [
  {
    question: "Are these prices final?",
    answer: site.pricingApprovalNote,
  },
  {
    question: "What does annual billing change?",
    answer:
      "Annual billing shows a lower effective monthly amount for the same entitlements. The plan contents do not change between billing periods.",
  },
  {
    question: "Can we change plan later?",
    answer:
      "Yes. Plans are subscription entitlements rather than separate products, so moving between them changes what is enabled in the same workspace.",
  },
  {
    question: "Why is Enterprise quote-only?",
    answer:
      "Enterprise scope varies substantially by organisation — number of frameworks, users, business units and assurance obligations. Quoting per organisation avoids publishing a number that would not apply to most buyers.",
  },
  {
    question: "Does a paid plan mean we will pass an audit?",
    answer:
      "No. NOVA assists with readiness and evidence management. Certification, attestation and regulatory conclusions remain with authorised independent, regulatory or customer-appointed parties.",
  },
  {
    question: "Do you charge for auditor access?",
    answer:
      "Auditor Portal access is part of the plans that include it. Access is scoped to the engagement rather than sold per external user.",
  },
];
