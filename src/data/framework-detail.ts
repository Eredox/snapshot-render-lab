/**
 * Deep, framework-specific detail for the four frameworks available in NOVA today.
 *
 * `src/data/frameworks.ts` holds the shared shape rendered for every framework.
 * This file adds the structure, maturity model, delivery journey, evidence table
 * and questions that are genuinely specific to a single standard. Content here is
 * descriptive of the published standards and of NOVA's own behaviour. It must not
 * claim certification, guaranteed compliance or capability that does not exist.
 */

export type StructureItem = { code: string; title: string; body: string };
export type EvidenceRow = { artefact: string; source: string; cadence: string };
export type JourneyStep = { phase: string; body: string };
export type Faq = { question: string; answer: string };

export type FrameworkDetail = {
  slug: string;
  /** How the standard itself is organised. */
  structure: { label: string; intro: string; items: StructureItem[] };
  /** Only where the standard defines graded levels. */
  maturity?: { label: string; intro: string; levels: { name: string; body: string }[] };
  evidence: { intro: string; rows: EvidenceRow[] };
  journey: JourneyStep[];
  faqs: Faq[];
};

export const frameworkDetails: FrameworkDetail[] = [
  {
    slug: "soc-2",
    structure: {
      label: "Trust Services Criteria",
      intro:
        "Security is always in scope. The remaining four categories are added only where an organisation makes commitments that call for them, and that scope decision is recorded in NOVA before evidence collection begins.",
      items: [
        {
          code: "Security",
          title: "Common Criteria",
          body: "Protection of information and systems against unauthorised access, disclosure and damage. Required in every SOC 2 examination.",
        },
        {
          code: "Availability",
          title: "Availability",
          body: "The system is available for operation and use as committed. Covers capacity, monitoring and recovery arrangements.",
        },
        {
          code: "Confidentiality",
          title: "Confidentiality",
          body: "Information designated as confidential is protected through its lifecycle, including retention and disposal.",
        },
        {
          code: "Processing integrity",
          title: "Processing integrity",
          body: "Processing is complete, valid, accurate, timely and authorised in relation to the service commitments.",
        },
        {
          code: "Privacy",
          title: "Privacy",
          body: "Personal information is collected, used, retained, disclosed and disposed of in line with stated notice and commitments.",
        },
      ],
    },
    evidence: {
      intro:
        "A Type II report describes a period, so each artefact carries the dates it covers, its source and the reviewer who validated it.",
      rows: [
        { artefact: "User access review", source: "Identity provider export or connector", cadence: "Quarterly" },
        { artefact: "Change approval record", source: "Source control or ticketing", cadence: "Per change" },
        { artefact: "Incident record", source: "Incident tooling or manual upload", cadence: "Per incident" },
        { artefact: "Vulnerability scan output", source: "Scanning tool", cadence: "Monthly" },
        { artefact: "Policy approval", source: "NOVA policy register", cadence: "Annual" },
        { artefact: "Vendor review", source: "NOVA vendor register", cadence: "Annual" },
      ],
    },
    journey: [
      { phase: "Scope", body: "Decide which criteria categories your commitments require, and record why each was included or excluded." },
      { phase: "Design", body: "Assign an owner and an operating expectation to every control, and close obvious design gaps first." },
      { phase: "Observation period", body: "Collect evidence continuously across the period the report will cover, with dates retained." },
      { phase: "Readiness review", body: "Review exceptions and remediation before the examining firm begins fieldwork." },
      { phase: "Examination", body: "Grant the firm scoped access through the Auditor Portal rather than assembling a request pack by hand." },
    ],
    faqs: [
      {
        question: "Does NOVA issue a SOC 2 report?",
        answer:
          "No. A SOC 2 report is issued by an independent public accounting firm. NOVA maintains the control and evidence record that the examination draws on, and gives the firm scoped access to it.",
      },
      {
        question: "What is the difference between Type I and Type II?",
        answer:
          "Type I addresses the suitability of control design at a point in time. Type II also addresses operating effectiveness over a period, which is why continuous, dated evidence matters.",
      },
      {
        question: "Can evidence be reused for other frameworks?",
        answer:
          "Where a single artefact genuinely satisfies more than one control it can be mapped to both. NOVA shows the mapping so reuse is visible and reviewable rather than assumed.",
      },
    ],
  },
  {
    slug: "iso-27001",
    structure: {
      label: "Management system clauses and Annex A themes",
      intro:
        "Certification assesses the management system clauses alongside the Annex A controls determined to be applicable in the Statement of Applicability.",
      items: [
        { code: "Clauses 4–5", title: "Context and leadership", body: "Interested parties, scope boundaries, the information security policy and assigned responsibilities." },
        { code: "Clauses 6–7", title: "Planning and support", body: "Risk assessment and treatment methodology, objectives, competence, awareness and documented information." },
        { code: "Clauses 8–10", title: "Operation and improvement", body: "Operational planning, internal audit, management review, nonconformity and corrective action." },
        { code: "Annex A.5", title: "Organisational controls", body: "Policies, roles, supplier relationships, incident management and continuity arrangements." },
        { code: "Annex A.6", title: "People controls", body: "Screening, terms of employment, awareness, disciplinary process and post-employment obligations." },
        { code: "Annex A.7", title: "Physical controls", body: "Secure areas, equipment protection, clear desk and secure disposal." },
        { code: "Annex A.8", title: "Technological controls", body: "Access control, cryptography, logging, secure development and network security." },
      ],
    },
    evidence: {
      intro:
        "The Statement of Applicability anchors the record: each applicable control needs implementation evidence, and each exclusion needs a justification.",
      rows: [
        { artefact: "Statement of Applicability", source: "NOVA control register", cadence: "On change" },
        { artefact: "Risk register and treatment plan", source: "NOVA risk module", cadence: "Quarterly review" },
        { artefact: "Internal audit report", source: "Internal or external auditor", cadence: "Annual programme" },
        { artefact: "Management review minutes", source: "Manual upload", cadence: "Annual" },
        { artefact: "Awareness training records", source: "Learning platform export", cadence: "Annual" },
        { artefact: "Supplier assessment", source: "NOVA vendor register", cadence: "Annual" },
      ],
    },
    journey: [
      { phase: "Define scope", body: "Set the boundaries of the management system and the interested parties it must satisfy." },
      { phase: "Assess risk", body: "Run the risk assessment, agree treatments and record residual risk acceptance." },
      { phase: "Build the SoA", body: "Decide which Annex A controls apply, justify exclusions and link implementation evidence." },
      { phase: "Operate and audit", body: "Run the controls, complete the internal audit programme and hold management review." },
      { phase: "Stage 1 and Stage 2", body: "The certification body reviews documentation, then tests implementation. Surveillance audits follow." },
    ],
    faqs: [
      {
        question: "Does NOVA certify our ISMS?",
        answer:
          "No. Certification is granted only by an accredited certification body. NOVA maintains the management system record — scope, risk, Statement of Applicability, audit and review — that the body assesses.",
      },
      {
        question: "Do we have to implement every Annex A control?",
        answer:
          "No. Annex A is a reference set. You determine applicability through risk assessment and record the reasoning in the Statement of Applicability, which NOVA keeps beside the controls it refers to.",
      },
      {
        question: "How does this relate to ISO/IEC 42001?",
        answer:
          "Both use the same management system clause structure, so an existing ISO/IEC 27001 programme can be extended to AI governance rather than rebuilt.",
      },
    ],
  },
  {
    slug: "iso-42001",
    structure: {
      label: "AI management system areas",
      intro:
        "ISO/IEC 42001 follows the familiar management system structure and adds requirements specific to the governance of AI systems across their lifecycle.",
      items: [
        { code: "Policy", title: "AI policy and roles", body: "Governance intent, accountable roles and the approval path for putting an AI system into use." },
        { code: "Inventory", title: "AI system inventory", body: "Each AI system recorded with owner, purpose, lifecycle stage and approval history." },
        { code: "Impact", title: "AI system impact assessment", body: "Assessment of effects on individuals, groups and the organisation, reviewed and dated." },
        { code: "Data", title: "Data governance", body: "Provenance, quality and appropriateness of data used for training, tuning and operation." },
        { code: "Lifecycle", title: "Lifecycle controls", body: "Requirements applied at design, development, deployment, monitoring and retirement." },
        { code: "Oversight", title: "Human oversight", body: "Defined points where a person must review, approve or override an automated output." },
      ],
    },
    evidence: {
      intro:
        "Oversight is the distinguishing evidence class: the record must show where a person intervened, not only that a policy said they could.",
      rows: [
        { artefact: "AI system inventory entry", source: "NOVA AI register", cadence: "On change" },
        { artefact: "Impact assessment", source: "Manual upload with reviewer", cadence: "Per system, on change" },
        { artefact: "Human review or override record", source: "NOVA workflow record", cadence: "Per decision" },
        { artefact: "Data provenance assessment", source: "Manual upload", cadence: "Per dataset" },
        { artefact: "Model or prompt change approval", source: "Source control or ticketing", cadence: "Per change" },
        { artefact: "Monitoring review", source: "NOVA control record", cadence: "Quarterly" },
      ],
    },
    journey: [
      { phase: "Inventory", body: "Identify every AI system in development or use, with an accountable owner for each." },
      { phase: "Assess impact", body: "Complete an impact assessment per system and have it reviewed before deployment." },
      { phase: "Set oversight points", body: "Document where human approval is mandatory in each AI-assisted workflow." },
      { phase: "Extend the ISMS", body: "Reuse the existing management system clauses instead of standing up a second programme." },
      { phase: "Monitor and review", body: "Keep monitoring, review and retirement records current as systems change." },
    ],
    faqs: [
      {
        question: "Do we need ISO/IEC 27001 first?",
        answer:
          "It is not a prerequisite, but the shared clause structure means organisations already certified to ISO/IEC 27001 typically extend that management system rather than build a new one.",
      },
      {
        question: "Does the NOVA assistant make compliance decisions?",
        answer:
          "No. The assistant drafts and summarises. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions, and those approvals are recorded.",
      },
      {
        question: "What counts as an AI system for the inventory?",
        answer:
          "Any system your organisation develops, provides or uses where automated output influences a decision or a product behaviour. The inventory records purpose and lifecycle stage for each.",
      },
    ],
  },
  {
    slug: "essential-eight",
    structure: {
      label: "The eight mitigation strategies",
      intro:
        "The Australian Cyber Security Centre groups the eight strategies by the outcome they support. Maturity is expected to be achieved consistently across all eight rather than unevenly.",
      items: [
        { code: "1", title: "Application control", body: "Prevent execution of unapproved applications, scripts, installers and drivers." },
        { code: "2", title: "Patch applications", body: "Apply patches to internet-facing and other applications within defined timeframes." },
        { code: "3", title: "Configure macro settings", body: "Restrict Microsoft Office macros to vetted sources and block them from the internet." },
        { code: "4", title: "User application hardening", body: "Harden browsers and common applications by disabling risky features." },
        { code: "5", title: "Restrict administrative privileges", body: "Limit, validate and regularly review privileged access to what the role requires." },
        { code: "6", title: "Patch operating systems", body: "Apply operating system patches within the timeframe set for the risk level." },
        { code: "7", title: "Multi-factor authentication", body: "Require multi-factor authentication for remote access and privileged actions." },
        { code: "8", title: "Regular backups", body: "Back up data, software and configuration, and test restoration regularly." },
      ],
    },
    maturity: {
      label: "Maturity levels",
      intro:
        "Each strategy is assessed against a maturity level rather than a simple present-or-absent test. NOVA records the target level and the current assessed level per strategy.",
      levels: [
        { name: "Maturity Level Zero", body: "Weaknesses remain that an adversary could readily exploit. The strategy is not aligned to the intent of the model." },
        { name: "Maturity Level One", body: "Partly aligned with the intent of the strategy, addressing adversaries using widely available techniques." },
        { name: "Maturity Level Two", body: "Mostly aligned, addressing adversaries prepared to invest more time and to work around weaker controls." },
        { name: "Maturity Level Three", body: "Fully aligned, addressing adaptive adversaries who target specific weaknesses and privileged credentials." },
      ],
    },
    evidence: {
      intro:
        "Essential Eight evidence is largely technical and time-bound, so the date range each artefact covers is recorded alongside it.",
      rows: [
        { artefact: "Patch compliance report", source: "Endpoint or patch tooling", cadence: "Monthly" },
        { artefact: "Application control baseline", source: "Configuration export", cadence: "On change" },
        { artefact: "Macro and browser hardening settings", source: "Configuration export", cadence: "Quarterly" },
        { artefact: "Privileged access review", source: "Identity provider export", cadence: "Quarterly" },
        { artefact: "Multi-factor coverage report", source: "Identity provider export", cadence: "Monthly" },
        { artefact: "Backup restoration test", source: "Manual upload with result", cadence: "Quarterly" },
      ],
    },
    journey: [
      { phase: "Set the target", body: "Agree the maturity level required by your buyers or obligations, per strategy." },
      { phase: "Assess current state", body: "Record the current assessed level with the evidence that supports it." },
      { phase: "Plan uplift", body: "Raise uplift actions with owners and due dates for each gap between current and target." },
      { phase: "Evidence continuously", body: "Attach patching, hardening, access and backup evidence to the strategy it supports." },
      { phase: "Report progression", body: "Show maturity movement over time from the evidence record rather than a point-in-time claim." },
    ],
    faqs: [
      {
        question: "Which maturity level should we target?",
        answer:
          "It depends on the requirement you are meeting. Australian government supply chain requirements commonly reference a specific level; commercial buyers vary. NOVA records the target you set per strategy.",
      },
      {
        question: "Is an Essential Eight assessment an audit?",
        answer:
          "Not in itself. Assessments may be performed internally or by an external assessor. NOVA maintains the assessed levels and supporting evidence either way.",
      },
      {
        question: "Does this overlap with ISO/IEC 27001?",
        answer:
          "Substantially. Patching, access, backup and hardening evidence supports ISO/IEC 27001 technological controls and the SOC 2 security criteria as well.",
      },
    ],
  },
];

export function getFrameworkDetail(slug: string): FrameworkDetail | undefined {
  return frameworkDetails.find((d) => d.slug === slug);
}
