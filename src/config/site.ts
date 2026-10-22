/**
 * Single source of truth for product identity, external application URLs and
 * form/analytics configuration. Nothing here may be invented in a component.
 */

export const novaAiCopy = {
  heroTitle: "Meet NOVA AI. Your compliance teammate.",
  heroDescription: "Working alongside you, every step of your compliance journey.",
  positioningTitle: "Your goals. Your decisions. NOVA AI by your side.",
  positioningBody:
    "NOVA AI works alongside you to understand requirements, explore evidence, prepare policies, investigate gaps and help achieve your compliance goals. You review suggestions together before they enter a governed approval path.",
  readinessStatement: "NOVA accelerates your launch preparation, but final decisions remain human.",
  whatNovaDoes:
    "What NOVA does: Supports and accelerates compliance readiness preparation by helping organise evidence, identify gaps, and inform decision-making.",
  whatYouControl:
    "What you control: You retain final authority and accountability for policy approvals, risk acceptance, launch decisions, and all statements made to auditors, regulators, or customers.",
  authorityStatement:
    "You retain final authority over approvals, risk acceptance, policies, readiness and all decisions made for your organisation.",
  availabilityNote: "NOVA AI availability follows the plan entitlement shown on the Pricing page.",
} as const;

export const site = {
  productName: "NOVA Compliance",
  shortName: "NOVA",
  company: "Eredox Pty Ltd",
  tagline: "Governed, evidence-led compliance management for growing and regulated organisations.",
  ownership: "NOVA Compliance is developed and operated by Eredox Pty Ltd.",
  humanStatement: novaAiCopy.readinessStatement,
  frameworkDisclaimer:
    "NOVA assists with readiness and evidence management. Certification, attestation and regulatory conclusions remain with authorised independent, regulatory or customer-appointed parties.",
  illustrativeCaption:
    "Illustrative interface concept. Values shown are examples, not customer data.",
  pricingApprovalNote:
    "Published NOVA plan prices are shown in USD.",
} as const;

/** External application destinations. These are real applications, not site routes. */
export const appUrls = {
  app: "https://nova.eredox.com",
  crm: "https://crm.nova.eredox.com",
  ai: "https://ai.nova.eredox.com",
  register: "https://nova.eredox.com/register",
} as const;

/** Customer-facing legal documents hosted by this public website. */
export const publicLegalRoutes = {
  terms: "/legal/terms",
  privacy: "/legal/privacy",
} as const;

/**
 * Client-side forms post here. Delivery and all credentials remain server-side.
 */
export const formsConfig = {
  endpoint: "/api/forms" as string | null,
  fallbackEmail: "compliance@eredox.com",
} as const;

export const analyticsConfig = {
  enabled: false,
  provider: null as string | null,
} as const;

/** No social profiles have been supplied; nothing is rendered while this is empty. */
export const socialLinks: Array<{ label: string; href: string }> = [];

export const contactRoutes = {
  general: "/contact",
  demo: "/book-demo",
  start: "/start",
  support: "/support",
} as const;

/** Absolute public origin, used for canonical URLs, sitemap and structured data. */
export const siteUrl = "https://www.nova.eredox.com";
