/**
 * Single source of truth for product identity, external application URLs and
 * form/analytics configuration. Nothing here may be invented in a component.
 */

export const site = {
  productName: "NOVA Compliance",
  shortName: "NOVA",
  company: "Eredox Pty Ltd",
  tagline:
    "Governed, evidence-led compliance management for growing and regulated organisations.",
  ownership: "NOVA Compliance is developed and operated by Eredox Pty Ltd.",
  humanStatement:
    "NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
  frameworkDisclaimer:
    "NOVA assists with readiness and evidence management. Certification, attestation and regulatory conclusions remain with authorised independent, regulatory or customer-appointed parties.",
  illustrativeCaption: "Illustrative interface concept. Values shown are examples, not customer data.",
  pricingApprovalNote:
    "Indicative amounts shown for planning purposes. All published prices require Eredox approval before they are contractually binding.",
} as const;

/** External application destinations. These are real applications, not site routes. */
export const appUrls = {
  app: "https://nova.eredox.com",
  crm: "https://crm.nova.eredox.com",
  ai: "https://ai.nova.eredox.com",
  /** Not supplied yet — keep null so no link is rendered until it exists. */
  register: null as string | null,
} as const;

/**
 * Client-side forms post here. While `endpoint` is null the forms validate
 * fully but never claim a successful submission — they show the configuration
 * notice instead. Set this to your form service endpoint to enable delivery.
 */
export const formsConfig = {
  endpoint: null as string | null,
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
