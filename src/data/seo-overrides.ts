/**
 * Search metadata for template-driven pages (features, frameworks, industries, solutions).
 *
 * Titles are <= 60 characters, use one "| NOVA Compliance" brand suffix, and lead with the
 * category/intent phrase buyers search for. Descriptions keep NOVA's positioning: readiness and
 * evidence support, never certification or guaranteed compliance - certificates, attestations and
 * regulatory conclusions stay with accredited, independent or regulatory parties.
 * `src/lib/__tests__/seo-metadata.test.ts` enforces length, uniqueness and claim hygiene.
 */
type Seo = { title: string; description?: string };

export const featureSeo: Record<string, Seo> = {
  "framework-management": { title: "Framework Management Software | NOVA Compliance" },
  controls: { title: "Controls and Control Testing Software | NOVA Compliance" },
  evidence: { title: "Compliance Evidence Management | NOVA Compliance" },
  policies: { title: "Policy Management Software | NOVA Compliance" },
  "risk-management": { title: "Compliance Risk Management Software | NOVA Compliance" },
  "asset-governance": { title: "Asset Governance for Compliance | NOVA Compliance" },
  reporting: { title: "Compliance Reporting and Readiness | NOVA Compliance" },
  "trust-centre": { title: "Trust Centre for Customer Assurance | NOVA Compliance" },
  "auditor-portal": { title: "Auditor Portal for Evidence Review | NOVA Compliance" },
  "ai-assistant": {
    title: "NOVA AI: AI Compliance Assistant | NOVA Compliance",
    description:
      "NOVA AI helps interpret requirements, summarise evidence and draft policy and control text, with human review and approval at every decision.",
  },
};

export const frameworkSeo: Record<string, Seo> = {
  "soc-2": {
    title: "SOC 2 Readiness Software | NOVA Compliance",
    description:
      "Map Trust Services Criteria to controls, collect reviewed evidence and track SOC 2 readiness. The attestation remains with your independent auditor.",
  },
  "iso-27001": {
    title: "ISO 27001 Compliance Software | NOVA Compliance",
    description:
      "Manage ISO/IEC 27001 controls, risks, policies and evidence in one workspace to prepare for audit. Certification is issued by an accredited body.",
  },
  "essential-eight": {
    title: "Essential Eight Compliance Software | NOVA Compliance",
    description:
      "Assess and evidence the ACSC Essential Eight by maturity level, with owned controls and reviewer-validated evidence for your assessment.",
  },
  "iso-42001": {
    title: "ISO 42001 AI Governance Software | NOVA Compliance",
    description:
      "Prepare for ISO/IEC 42001 with AI governance controls, policies and evidence. NOVA supports readiness; certification is issued by an accredited body.",
  },
  gdpr: { title: "GDPR Compliance Software | NOVA Compliance" },
  "pci-dss": { title: "PCI DSS v4.0.1 Compliance Software | NOVA Compliance" },
  hipaa: { title: "HIPAA Compliance Software | NOVA Compliance" },
  cmmc: { title: "CMMC Compliance Software | NOVA Compliance" },
};

export const industrySeo: Record<string, Seo> = {
  technology: { title: "Technology Compliance Software | NOVA Compliance" },
  "financial-services": { title: "Financial Services Compliance Software | NOVA Compliance" },
  healthcare: { title: "Healthcare Compliance Software | NOVA Compliance" },
  "government-suppliers": { title: "Government Supplier Compliance | NOVA Compliance" },
  "professional-services": { title: "Professional Services Compliance | NOVA Compliance" },
};

export const solutionSeo: Record<string, Seo> = {
  "startups-saas": { title: "Compliance for Startups and SaaS | NOVA Compliance" },
  "technology-smes": { title: "Compliance for Technology SMEs | NOVA Compliance" },
  "regulated-organisations": { title: "Compliance for Regulated Organisations | NOVA Compliance" },
  "service-providers": { title: "Compliance for MSPs, MSSPs and Advisers | NOVA Compliance" },
  "compliance-teams": { title: "Software for Compliance Teams | NOVA Compliance" },
  executives: { title: "Compliance Reporting for Executives | NOVA Compliance" },
  auditors: { title: "Evidence Review for Auditors | NOVA Compliance" },
};
