import { site } from "@/config/site";

export const currency = "AUD";

export type Plan = {
  slug: string;
  name: string;
  summary: string;
  /** Indicative monthly amount in AUD, or null when the plan is quote-only. */
  monthly: number | null;
  /** Indicative amount per month when billed annually. */
  annual: number | null;
  quoteOnly?: boolean;
  highlight?: boolean;
  /** True while the amount has not been approved by Eredox. */
  requiresApproval: boolean;
  bestFor: string;
  includes: string[];
  support: string;
  cta: { label: string; to: string };
};

export const plans: Plan[] = [
  {
    slug: "free",
    name: "Free",
    summary: "Evaluate the workflow with a single framework and a small control set.",
    monthly: 0,
    annual: 0,
    requiresApproval: false,
    bestFor: "Teams assessing whether the workflow fits before committing",
    includes: [
      "One activated framework",
      "Core control library",
      "Manual evidence upload",
      "Single administrator",
    ],
    support: "Documentation and community resources",
    cta: { label: "Start free", to: "/start" },
  },
  {
    slug: "launch",
    name: "Launch",
    summary: "A first certification or attestation programme run properly from the start.",
    monthly: 99,
    annual: 82,
    requiresApproval: true,
    bestFor: "Startups preparing for their first enterprise security review",
    includes: [
      "One activated framework",
      "Control ownership and review cadence",
      "Evidence mapping and reviewer validation",
      "Policy versioning and approval",
      "Readiness reporting",
    ],
    support: "Email support during business hours",
    cta: { label: "Start free", to: "/start" },
  },
  {
    slug: "growth",
    name: "Growth",
    summary: "Multiple frameworks on one shared control set, with reuse across requirements.",
    monthly: 249,
    annual: 207,
    highlight: true,
    requiresApproval: true,
    bestFor: "Technology SMEs maintaining more than one obligation",
    includes: [
      "Multiple activated frameworks",
      "Cross-framework control and evidence reuse",
      "Risk register with treatment and acceptance",
      "GitHub evidence connector",
      "Trend and gap reporting",
    ],
    support: "Email support with prioritised response",
    cta: { label: "Book a demo", to: "/book-demo" },
  },
  {
    slug: "professional",
    name: "Professional",
    summary: "Assurance-grade operation with external review workflows included.",
    monthly: 499,
    annual: 416,
    requiresApproval: true,
    bestFor: "Organisations undergoing recurring external assessment",
    includes: [
      "Everything in Growth",
      "Auditor Portal with scoped engagement access",
      "Trust Centre publication",
      "Asset register and classification",
      "Advanced role-based access",
    ],
    support: "Priority support with a named contact",
    cta: { label: "Book a demo", to: "/book-demo" },
  },
  {
    slug: "business",
    name: "Business",
    summary: "Broader scope, more users and deeper governance across business units.",
    monthly: 799,
    annual: 665,
    requiresApproval: true,
    bestFor: "Regulated organisations with several teams inside one programme",
    includes: [
      "Everything in Professional",
      "Extended user and role capacity",
      "Multiple scopes within one tenant",
      "AI assistance across policies, evidence and gap identification",
      "Executive and board reporting views",
    ],
    support: "Priority support with onboarding assistance",
    cta: { label: "Contact sales", to: "/contact" },
  },
  {
    slug: "enterprise",
    name: "Enterprise",
    summary: "Quoted per organisation against scope, users and assurance requirements.",
    monthly: null,
    annual: null,
    quoteOnly: true,
    requiresApproval: false,
    bestFor: "Complex environments with bespoke scope and assurance obligations",
    includes: [
      "Everything in Business",
      "Scope defined per organisation",
      "Commercial terms agreed with Eredox",
      "Structured onboarding programme",
    ],
    support: "Agreed support arrangements",
    cta: { label: "Request a quote", to: "/contact" },
  },
];

export type ComparisonGroup = {
  group: string;
  rows: { label: string; values: Record<string, string> }[];
};

const y = "Included";
const n = "—";

export const comparison: ComparisonGroup[] = [
  {
    group: "Frameworks and controls",
    rows: [
      { label: "Activated frameworks", values: { free: "1", launch: "1", growth: "Multiple", professional: "Multiple", business: "Multiple", enterprise: "Defined per scope" } },
      { label: "Shared control library", values: { free: y, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Cross-framework control reuse", values: { free: n, launch: n, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Control testing records", values: { free: n, launch: y, growth: y, professional: y, business: y, enterprise: y } },
    ],
  },
  {
    group: "Evidence and policy",
    rows: [
      { label: "Manual evidence upload", values: { free: y, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "Reviewer validation", values: { free: n, launch: y, growth: y, professional: y, business: y, enterprise: y } },
      { label: "GitHub evidence connector", values: { free: n, launch: n, growth: y, professional: y, business: y, enterprise: y } },
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
