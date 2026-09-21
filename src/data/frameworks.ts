export type Availability = "Available now" | "Available connected to your data" | "Custom framework available";

export type Framework = {
  slug: string;
  name: string;
  shortName: string;
  icon?: string;
  category:
    | "Security assurance"
    | "Information security"
    | "Cyber resilience"
    | "AI governance"
    | "Healthcare privacy"
    | "Privacy"
    | "Financial services"
    | "Government & defence";
  availability: Availability;
  jurisdictions: string[];
  description: string;
  overview: string[];
  intendedFor: string[];
  governanceAreas: { title: string; body: string }[];
  novaSupport: string[];
  controlsAndEvidence: string[];
  crossFramework: string[];
  keywords: string[];
};

export const frameworks: Framework[] = [
  {
    slug: "soc-2",
    name: "SOC 2",
    shortName: "SOC 2",
    icon: "/media/frameworks/soc-2.png",
    category: "Security assurance",
    availability: "Available now",
    jurisdictions: ["Global", "United States"],
    description:
      "Service organisation reporting against the Trust Services Criteria, used widely in enterprise procurement.",
    overview: [
      "SOC 2 examines whether a service organisation's controls are suitably designed and, for a Type II report, operating effectively over a period of time.",
      "The examination is performed by an independent public accounting firm against the Trust Services Criteria. Security is always in scope; availability, confidentiality, processing integrity and privacy are added according to the commitments an organisation makes to its customers.",
      "Because the report describes a period rather than a moment, the evidence record matters as much as the control design.",
    ],
    intendedFor: [
      "SaaS and technology providers selling to enterprise customers",
      "Service organisations that host or process customer data",
      "Organisations that repeatedly answer the same security questionnaires",
    ],
    governanceAreas: [
      { title: "Control environment", body: "Governance structures, accountability and the way management communicates expectations." },
      { title: "Risk assessment", body: "Identifying, analysing and responding to risks that threaten the service commitments." },
      { title: "Monitoring", body: "Ongoing and separate evaluations that detect control deficiencies before an examination does." },
      { title: "Logical and physical access", body: "Who can reach systems and data, how that access is granted, reviewed and removed." },
      { title: "Change and operations", body: "How changes are authorised, tested and released, and how incidents are handled." },
    ],
    novaSupport: [
      "Activate the Trust Services Criteria you commit to and record scope decisions in one place",
      "Assign an accountable owner and an operating expectation to every control",
      "Collect period-of-time evidence with dates, sources and reviewer validation",
      "Track exceptions and remediation before an examination begins",
      "Give the examining firm scoped access through the Auditor Portal",
    ],
    controlsAndEvidence: [
      "Access review records with the reviewer and date retained",
      "Change approvals linked to the change management control",
      "Incident records with timeline, impact assessment and closure",
      "Policy approvals showing who approved which version, and when",
    ],
    crossFramework: [
      "Access control, change management and incident response evidence is reusable against ISO/IEC 27001",
      "Patching, backup and application control evidence overlaps with Essential Eight",
    ],
    keywords: ["trust services criteria", "type ii", "attestation", "service organisation"],
  },
  {
    slug: "iso-27001",
    name: "ISO/IEC 27001",
    shortName: "ISO 27001",
    icon: "/media/frameworks/iso-27001.png",
    category: "Information security",
    availability: "Available now",
    jurisdictions: ["Global"],
    description:
      "The international standard for an information security management system, certified by an accredited body.",
    overview: [
      "ISO/IEC 27001 specifies the requirements for establishing, implementing, maintaining and continually improving an information security management system.",
      "Certification is granted by an accredited certification body following a two-stage audit and maintained through surveillance audits. The management system itself — context, leadership, planning, support, operation, evaluation and improvement — is assessed alongside the Annex A controls an organisation has determined to be applicable.",
      "The Statement of Applicability is central: it records which controls apply, why, and how they are implemented.",
    ],
    intendedFor: [
      "Organisations needing internationally recognised information security certification",
      "Suppliers to government, financial services and large enterprise",
      "Groups consolidating several security programmes under one management system",
    ],
    governanceAreas: [
      { title: "Context and scope", body: "Interested parties, boundaries of the management system and the issues that affect it." },
      { title: "Leadership and policy", body: "Management commitment, the information security policy and assigned responsibilities." },
      { title: "Risk management", body: "Risk assessment methodology, treatment plans and residual risk acceptance." },
      { title: "Annex A controls", body: "Organisational, people, physical and technological controls determined to be applicable." },
      { title: "Performance evaluation", body: "Internal audit, monitoring, measurement and management review." },
    ],
    novaSupport: [
      "Maintain the Statement of Applicability alongside the controls it refers to",
      "Run the risk assessment and treatment cycle with owners and acceptance records",
      "Keep policies versioned, approved and scheduled for review",
      "Plan internal audit activity and record findings against controls",
      "Produce management review inputs from live records instead of reassembling them",
    ],
    controlsAndEvidence: [
      "Risk register entries with treatment plans and explicit acceptance",
      "Statement of Applicability with justification for inclusion or exclusion",
      "Internal audit reports and corrective actions",
      "Awareness and competence records for people controls",
    ],
    crossFramework: [
      "Annex A control evidence maps extensively onto SOC 2 Trust Services Criteria",
      "Technical controls overlap with Essential Eight mitigation strategies",
      "The management system structure is reused when adding ISO/IEC 42001",
    ],
    keywords: ["isms", "annex a", "statement of applicability", "certification"],
  },
  {
    slug: "essential-eight",
    name: "Essential Eight",
    shortName: "Essential Eight",
    icon: "/media/frameworks/essential-eight.png",
    category: "Cyber resilience",
    availability: "Available now",
    jurisdictions: ["Australia"],
    description:
      "Eight prioritised mitigation strategies published by the Australian Cyber Security Centre, assessed by maturity level.",
    overview: [
      "The Essential Eight is a set of prioritised mitigation strategies that make it substantially harder for adversaries to compromise systems.",
      "Each strategy is assessed against maturity levels, so an organisation reports where it sits rather than simply whether a control exists. Maturity is expected to be achieved consistently across all eight strategies rather than unevenly.",
      "It is widely used in Australian government supply chains and increasingly requested by private-sector buyers.",
    ],
    intendedFor: [
      "Australian organisations and their suppliers",
      "Entities responding to government procurement requirements",
      "Teams that want a concrete technical baseline before broader certification",
    ],
    governanceAreas: [
      { title: "Application control", body: "Preventing execution of unapproved applications and scripts." },
      { title: "Patching", body: "Applications and operating systems patched within defined timeframes." },
      { title: "Configuration hardening", body: "Macro settings and user application hardening applied consistently." },
      { title: "Administrative privileges", body: "Restricting, reviewing and monitoring privileged access." },
      { title: "Authentication and recovery", body: "Multi-factor authentication and regular, tested backups." },
    ],
    novaSupport: [
      "Record the target maturity level and the current assessed level per strategy",
      "Hold configuration and patching evidence against the strategy it supports",
      "Track uplift actions with owners and due dates",
      "Report maturity progression over time from the evidence record",
    ],
    controlsAndEvidence: [
      "Patch compliance reporting with the date range it covers",
      "Backup test results including restoration verification",
      "Privileged access reviews with the approver recorded",
      "Application control and macro configuration baselines",
    ],
    crossFramework: [
      "Technical evidence supports ISO/IEC 27001 technological controls",
      "Backup, patching and access evidence is reusable for SOC 2 security criteria",
    ],
    keywords: ["acsc", "maturity level", "mitigation strategies", "australia"],
  },
  {
    slug: "iso-42001",
    name: "ISO/IEC 42001",
    shortName: "ISO 42001",
    icon: "/media/frameworks/iso-42001.png",
    category: "AI governance",
    availability: "Available now",
    jurisdictions: ["Global"],
    description:
      "The management system standard for artificial intelligence, covering governance of AI systems across their lifecycle.",
    overview: [
      "ISO/IEC 42001 specifies requirements for an artificial intelligence management system, addressing how an organisation governs the development, provision and use of AI systems.",
      "It follows the same management system structure as ISO/IEC 27001, which allows organisations to extend an existing programme rather than start a new one. Its distinguishing content covers AI-specific impact assessment, lifecycle governance and the responsibilities attached to automated outputs.",
      "It is increasingly relevant to organisations that embed AI features into products or rely on AI in decision workflows.",
    ],
    intendedFor: [
      "Organisations building or embedding AI capability into products",
      "Teams that must evidence human oversight of automated outputs",
      "Existing ISO/IEC 27001 holders extending governance to AI systems",
    ],
    governanceAreas: [
      { title: "AI policy and roles", body: "Governance intent, accountability and the roles that approve AI use." },
      { title: "Impact assessment", body: "Assessing effects of AI systems on individuals, groups and the organisation." },
      { title: "Lifecycle governance", body: "Requirements across design, development, deployment, monitoring and retirement." },
      { title: "Data governance", body: "Provenance, quality and appropriateness of the data used by AI systems." },
      { title: "Human oversight", body: "Where a person must review, approve or override an automated output." },
    ],
    novaSupport: [
      "Maintain AI system inventory entries with owner, purpose and lifecycle stage",
      "Hold impact assessments as reviewed evidence against the relevant controls",
      "Document where human approval is mandatory in each AI-assisted workflow",
      "Reuse the ISO/IEC 27001 management system structure already in place",
    ],
    controlsAndEvidence: [
      "AI system inventory records with approval history",
      "Impact assessment documents with reviewer and date",
      "Records of human review or override on automated outputs",
      "Data provenance and quality assessments",
    ],
    crossFramework: [
      "Shares the management system clauses with ISO/IEC 27001",
      "Human oversight records support the responsible AI position published in the Trust Centre",
    ],
    keywords: ["ai management system", "aims", "impact assessment", "human oversight"],
  },
  {
    slug: "gdpr",
    name: "GDPR — General Data Protection Regulation (EU) 2016/679",
    shortName: "GDPR",
    icon: "/media/frameworks/gdpr.png",
    category: "Privacy",
    availability: "Available connected to your data",
    jurisdictions: ["European Union / EEA"],
    description: "Regulatory privacy requirements for organisations handling personal data in the EU/EEA and related contexts.",
    overview: ["NOVA provides a structured GDPR readiness record for obligations, applicability decisions, evidence, risks and privacy governance."],
    intendedFor: ["Organisations handling EU/EEA personal data", "Teams maintaining records of processing and privacy evidence"],
    governanceAreas: [
      { title: "Accountability", body: "Record ownership, decisions, policies and review evidence for privacy obligations." },
      { title: "Data subject rights", body: "Track rights handling, requests, decisions and response evidence." },
      { title: "Processing governance", body: "Maintain processing, retention, transfer and processor records." },
    ],
    novaSupport: ["Map privacy requirements to evidence and policies", "Keep applicability and human review decisions visible", "Connect data inventory and incident records where available"],
    controlsAndEvidence: ["Records of processing activities", "Privacy notices and DPIA evidence", "Data subject request and breach registers"],
    crossFramework: ["Privacy and security evidence can be reused where it genuinely satisfies both GDPR obligations and security controls."],
    keywords: ["gdpr", "privacy", "data protection", "europe"],
  },
  {
    slug: "pci-dss",
    name: "PCI DSS v4.0.1 — Payment Card Industry Data Security Standard",
    shortName: "PCI DSS",
    icon: "/media/frameworks/pci-dss.png",
    category: "Financial services",
    availability: "Available connected to your data",
    jurisdictions: ["Global"],
    description: "Payment-card security readiness for environments that store, process or transmit cardholder data.",
    overview: ["NOVA supports PCI DSS readiness tracking with scope, requirements, evidence, targeted risk analysis and human review records."],
    intendedFor: ["Payment service providers", "Merchants and service providers with cardholder-data environments"],
    governanceAreas: [
      { title: "Scope", body: "Define the cardholder-data environment and connected systems before assessment work begins." },
      { title: "Security requirements", body: "Track technical and organisational requirements with owners and evidence." },
      { title: "Validation", body: "Keep review, remediation and assessor-facing records together." },
    ],
    novaSupport: ["Maintain requirement-level readiness records", "Link evidence, risks, policies and assets to the defined scope", "Keep future-dated requirement decisions visible"],
    controlsAndEvidence: ["Network and access reviews", "Vulnerability and configuration evidence", "Targeted risk analysis and remediation records"],
    crossFramework: ["Payment security evidence can overlap with SOC 2, ISO/IEC 27001 and Essential Eight controls where the scope is shared."],
    keywords: ["pci dss", "payment cards", "cardholder data", "v4.0.1"],
  },
  {
    slug: "hipaa",
    name: "HIPAA — Privacy, Security & Breach Notification",
    shortName: "HIPAA",
    icon: "/media/frameworks/hipaa.png",
    category: "Healthcare privacy",
    availability: "Available connected to your data",
    jurisdictions: ["United States"],
    description: "US healthcare privacy, security and breach-notification readiness for covered entities and business associates.",
    overview: ["NOVA supports HIPAA readiness records for Security Rule, Privacy Rule, Breach Notification Rule and business-associate obligations."],
    intendedFor: ["Covered entities handling protected health information", "Business associates processing health data for customers"],
    governanceAreas: [
      { title: "Security safeguards", body: "Track administrative, physical and technical safeguards with evidence." },
      { title: "Privacy and disclosure", body: "Record permitted-use, minimum-necessary and individual-rights decisions." },
      { title: "Breach response", body: "Maintain assessment, escalation and notification decision records." },
    ],
    novaSupport: ["Record safeguard applicability and human review", "Link ePHI system, access and training evidence", "Track breach assessment and business-associate governance"],
    controlsAndEvidence: ["Security risk analysis", "Access, MFA and audit-log reviews", "Business-associate and breach registers"],
    crossFramework: ["Access, incident, continuity and audit evidence can support related security frameworks where it is materially applicable."],
    keywords: ["hipaa", "phi", "security rule", "healthcare"],
  },
  {
    slug: "cmmc",
    name: "Cybersecurity Maturity Model Certification (CMMC)",
    shortName: "CMMC",
    icon: "/media/frameworks/cmmc.png",
    category: "Government & defence",
    availability: "Available connected to your data",
    jurisdictions: ["United States"],
    description: "US defence-industrial cybersecurity readiness across CMMC practices, scope, evidence and assessment preparation.",
    overview: ["NOVA supports CMMC readiness tracking with level-aware practices, scope records, evidence, risks and human-owned assessment decisions."],
    intendedFor: ["Defence industrial base organisations", "Suppliers handling FCI or CUI within an assessed boundary"],
    governanceAreas: [
      { title: "Assessment scope", body: "Record the system boundary, assets, dependencies and applicability decisions." },
      { title: "Maturity practices", body: "Track practices and evidence by target level with accountable owners." },
      { title: "Assessment preparation", body: "Keep SSP, POA&M, risk and review records ready for human assessment." },
    ],
    novaSupport: ["Maintain level-aware practice readiness", "Link scope assets, policies, risks and evidence", "Preserve the boundary that NOVA does not issue certification or official assessment results"],
    controlsAndEvidence: ["System security plan and scope records", "MFA, logging and vulnerability evidence", "POA&M and supplier-flowdown records"],
    crossFramework: ["CMMC evidence may overlap with Essential Eight, ISO/IEC 27001 and other security programmes where scope and requirements align."],
    keywords: ["cmmc", "defence industrial base", "cui", "maturity"],
  },
];

export const availabilityGroups: Availability[] = ["Available now", "Available connected to your data"];

export const frameworkCategories = Array.from(new Set(frameworks.map((f) => f.category)));

export function getFramework(slug: string): Framework | undefined {
  return frameworks.find((f) => f.slug === slug);
}

/** Illustrative only — example values used in interface concept visuals, never customer data. */
export const illustrativeReadiness = [
  { name: "SOC 2", label: "Readiness", value: 95 },
  { name: "ISO/IEC 27001", label: "Readiness", value: 85 },
  { name: "Essential Eight", label: "Maturity coverage", value: 90 },
  { name: "ISO/IEC 42001", label: "Readiness", value: 82 },
].filter((f) => f.value > 0);
