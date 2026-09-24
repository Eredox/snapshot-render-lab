export type Industry = {
  slug: string;
  name: string;
  summary: string;
  challenges: string[];
  frameworks: string[];
};

/** Canonical industry catalogue used by the index, detail routes and sitemap. */
export const industries: Industry[] = [
  {
    slug: "technology",
    name: "Technology",
    summary:
      "Move fast without losing track of security reviews, customer questionnaires and framework readiness.",
    challenges: [
      "Responding to repetitive customer security questionnaires",
      "Preparing for first SOC 2 or ISO 27001 readiness review",
      "Maintaining evidence as the product and team change",
      "Demonstrating security posture to enterprise buyers",
    ],
    frameworks: ["soc-2", "iso-iec-27001", "essential-eight"],
  },
  {
    slug: "financial-services",
    name: "Financial services",
    summary:
      "Build a defensible record around data protection, operational resilience and regulatory expectations.",
    challenges: [
      "Mapping controls across prudential and privacy obligations",
      "Keeping evidence fresh for periodic assurance reviews",
      "Demonstrating governance to regulators and auditors",
      "Managing third-party and supply-chain risk",
    ],
    frameworks: ["iso-iec-27001", "essential-eight"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    summary:
      "Manage privacy, security and governance obligations with clear evidence ownership and reviewer validation.",
    challenges: [
      "Protecting patient data while enabling access",
      "Tracking policy approvals and workforce training",
      "Preparing for privacy and security assessments",
      "Maintaining audit trails for sensitive decisions",
    ],
    frameworks: ["iso-iec-27001"],
  },
  {
    slug: "government-suppliers",
    name: "Government suppliers",
    summary:
      "Demonstrate capability and readiness through structured evidence rather than ad-hoc documentation.",
    challenges: [
      "Responding to procurement security requirements",
      "Aligning with national cyber security guidance",
      "Maintaining consistent assurance across contracts",
      "Demonstrating Essential Eight or equivalent maturity",
    ],
    frameworks: ["essential-eight", "iso-iec-27001"],
  },
  {
    slug: "professional-services",
    name: "Professional services",
    summary:
      "Maintain assurance for clients across multiple engagements with reusable evidence and consistent controls.",
    challenges: [
      "Reusing evidence across multiple client audits",
      "Keeping client data handling controls current",
      "Demonstrating governance without a dedicated security team",
      "Preparing consultant access and privilege policies",
    ],
    frameworks: ["iso-iec-27001", "soc-2"],
  },
];

export const industrySlugs = industries.map((industry) => industry.slug);
