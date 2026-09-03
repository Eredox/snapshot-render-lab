export type FeatureSection = { title: string; body: string; points?: string[] };

export type Feature = {
  slug: string;
  path: string;
  name: string;
  navLabel: string;
  availability: "Available now" | "Partly available" | "Planned";
  summary: string;
  problem: string;
  workflow: FeatureSection[];
  capabilities: { title: string; body: string }[];
  humanResponsibilities: string[];
  related: string[];
  relatedFrameworks?: string[];
};

export const features: Feature[] = [
  {
    slug: "framework-management",
    path: "/features/framework-management",
    name: "Framework management",
    navLabel: "Framework management",
    availability: "Available now",
    summary:
      "Activate the frameworks your organisation works towards, record scope, and map requirements once instead of maintaining parallel programmes.",
    problem:
      "Most organisations end up running each framework as a separate project, with its own spreadsheet, its own evidence folder and its own version of the truth. The same control is described three different ways, and nobody can say confidently which requirements are actually covered.",
    workflow: [
      {
        title: "Activate what applies",
        body: "Choose the frameworks in scope for your organisation and record why they apply. Scope decisions stay attached to the framework rather than living in a document somebody has to find.",
      },
      {
        title: "Map requirements to controls",
        body: "Requirements point at the controls that satisfy them. When one control serves several frameworks, the mapping is explicit and the evidence behind it is shared rather than duplicated.",
        points: [
          "Requirement-to-control mapping maintained in one structure",
          "Shared controls visible across every framework that relies on them",
          "Scope inclusions and exclusions recorded with a rationale",
        ],
      },
      {
        title: "See coverage honestly",
        body: "Coverage reflects the state of the underlying controls and evidence. A requirement is not covered because someone ticked a box; it is covered because the control behind it is implemented and evidenced.",
      },
    ],
    capabilities: [
      { title: "Multi-framework activation", body: "Run several frameworks in one workspace with a shared control set." },
      { title: "Scope records", body: "Document what is in scope, what is excluded, and why." },
      { title: "Requirement mapping", body: "Trace each requirement to the controls and evidence behind it." },
      { title: "Reuse visibility", body: "See which controls carry weight across multiple frameworks before you change them." },
    ],
    humanResponsibilities: [
      "Deciding which frameworks the organisation commits to",
      "Approving scope inclusions and exclusions",
      "Confirming that a mapping genuinely satisfies the requirement",
    ],
    related: ["controls", "evidence", "reporting"],
    relatedFrameworks: ["soc-2", "iso-27001", "essential-eight", "iso-42001"],
  },
  {
    slug: "controls",
    path: "/features/controls",
    name: "Controls and control testing",
    navLabel: "Controls and control testing",
    availability: "Available now",
    summary:
      "Define what each control is expected to do, who owns it, how often it is tested, and whether the last test passed.",
    problem:
      "A control list without owners and testing is an inventory, not a programme. When an assessor asks how a control operates, the answer is usually reconstructed from memory by whoever happens to be available.",
    workflow: [
      {
        title: "Describe the operating expectation",
        body: "Each control records what it does, how frequently it operates and what a satisfactory result looks like. That description is the reference point for every later test.",
      },
      {
        title: "Assign accountable ownership",
        body: "Ownership sits with a person, not a team inbox. Owners see what they are responsible for and when the next review falls due.",
        points: [
          "Named owner with review cadence per control",
          "Implementation status maintained against the described expectation",
          "History retained when a control description or owner changes",
        ],
      },
      {
        title: "Test and record the result",
        body: "Test results are recorded against the control with the tester, the date and the evidence examined. Failures create remediation items instead of disappearing into a report.",
      },
    ],
    capabilities: [
      { title: "Control library", body: "One control set shared across activated frameworks." },
      { title: "Ownership and cadence", body: "Named owners, review frequency and due dates." },
      { title: "Test records", body: "Test outcomes with tester, date and the evidence examined." },
      { title: "Remediation tracking", body: "Failed tests generate tracked actions with owners." },
    ],
    humanResponsibilities: [
      "Approving control descriptions and operating expectations",
      "Performing and signing off control tests",
      "Deciding whether a deficiency is remediated or accepted",
    ],
    related: ["framework-management", "evidence", "risk-management"],
    relatedFrameworks: ["soc-2", "iso-27001"],
  },
  {
    slug: "evidence",
    path: "/features/evidence",
    name: "Evidence management",
    navLabel: "Evidence management",
    availability: "Available now",
    summary:
      "Collect evidence into governed storage, map it to the controls it supports, and have a person validate it before it counts.",
    problem:
      "Evidence usually lives in shared drives, ticket attachments and email threads. During an assessment it is gathered again from scratch, and nobody can prove when a screenshot was taken or which control it was meant to support.",
    workflow: [
      {
        title: "Collect with context",
        body: "Evidence is uploaded with the metadata that makes it usable later: what it shows, the period it covers, where it came from and who provided it.",
      },
      {
        title: "Map to controls",
        body: "Each item is mapped to the controls it supports. One well-chosen artefact can satisfy requirements in several frameworks at once, and the mapping shows exactly where it is relied upon.",
        points: [
          "Manual upload with structured metadata — available now",
          "GitHub evidence connector — available now",
          "Additional connectors — see the integrations page for status",
        ],
      },
      {
        title: "Review before it counts",
        body: "A reviewer validates the item against the control expectation. Until that review happens the evidence is held but not treated as satisfying anything.",
      },
      {
        title: "Keep it current",
        body: "Evidence carries a freshness expectation. Items that age out are flagged so a period-of-time assessment does not fail on stale artefacts.",
      },
    ],
    capabilities: [
      { title: "Governed storage", body: "Evidence held inside the tenant boundary with role-based access." },
      { title: "Control mapping", body: "Reuse one artefact across every requirement it legitimately supports." },
      { title: "Reviewer validation", body: "A human review step before evidence counts towards readiness." },
      { title: "Freshness tracking", body: "Ageing evidence is surfaced before an assessment finds it." },
    ],
    humanResponsibilities: [
      "Validating that evidence actually demonstrates the control",
      "Deciding when evidence must be refreshed",
      "Approving what may be shared with an auditor or customer",
    ],
    related: ["controls", "auditor-portal", "reporting"],
    relatedFrameworks: ["soc-2", "iso-27001", "essential-eight"],
  },
  {
    slug: "policies",
    path: "/features/policies",
    name: "Policy management",
    navLabel: "Policy management",
    availability: "Available now",
    summary:
      "Govern policy intent with versioning, approval routing and scheduled review, so the published policy is the approved one.",
    problem:
      "Policies drift. A draft becomes the working version, the approved copy sits in a different folder, and the review date passes unnoticed until an assessor asks when the document was last approved.",
    workflow: [
      {
        title: "Draft and version",
        body: "Every change creates a version. The history shows what changed, who changed it and when, which is the question an assessor asks first.",
      },
      {
        title: "Route for approval",
        body: "Policies move through review to an approver. Approval is recorded against the specific version, not the document in general.",
        points: [
          "Version history retained in full",
          "Approval recorded per version with approver and date",
          "Scheduled review dates with advance notice",
        ],
      },
      {
        title: "Link to controls",
        body: "Policies connect to the controls that implement them, so a policy statement is traceable to the operational practice behind it.",
      },
    ],
    capabilities: [
      { title: "Version control", body: "Complete history with authorship and change dates." },
      { title: "Approval workflow", body: "Review and approval recorded against the version approved." },
      { title: "Review scheduling", body: "Cadence per document with notice before the date passes." },
      { title: "Control linkage", body: "Policy intent traceable to implementing controls." },
    ],
    humanResponsibilities: [
      "Authoring and approving policy content",
      "Deciding review frequency for each document",
      "Confirming a policy reflects how the organisation actually operates",
    ],
    related: ["controls", "ai-assistant", "trust-centre"],
    relatedFrameworks: ["iso-27001", "soc-2"],
  },
  {
    slug: "risk-management",
    path: "/features/risk-management",
    name: "Risk management",
    navLabel: "Risk management",
    availability: "Available now",
    summary:
      "Record risks with owners, assess them consistently, assign treatment, and capture acceptance as an explicit decision.",
    problem:
      "Risk registers are often assembled for an audit and abandoned afterwards. Treatment plans have no owner, and acceptance is implied by silence rather than recorded as a decision someone made.",
    workflow: [
      {
        title: "Identify and assess",
        body: "Risks are recorded against the assets, controls or processes they affect, and assessed using a consistent methodology so scores can be compared.",
      },
      {
        title: "Treat or accept, explicitly",
        body: "Each risk carries a treatment decision. Acceptance is a recorded action with a named accepter and a date, not an absence of activity.",
        points: [
          "Treatment plans with owners and target dates",
          "Explicit acceptance records retained in history",
          "Residual risk visible alongside inherent risk",
        ],
      },
      {
        title: "Review on a cadence",
        body: "Risks are reviewed on a schedule and when their context changes, with the review history retained for assurance.",
      },
    ],
    capabilities: [
      { title: "Risk register", body: "Central register linked to controls, assets and frameworks." },
      { title: "Consistent assessment", body: "One methodology applied across the register." },
      { title: "Treatment tracking", body: "Plans with owners, dates and progress." },
      { title: "Acceptance records", body: "Who accepted what, when, and on what basis." },
    ],
    humanResponsibilities: [
      "Assessing likelihood and impact",
      "Choosing treatment over acceptance",
      "Accepting residual risk on behalf of the organisation",
    ],
    related: ["controls", "asset-governance", "reporting"],
    relatedFrameworks: ["iso-27001", "iso-42001"],
  },
  {
    slug: "asset-governance",
    path: "/features/asset-governance",
    name: "Asset governance",
    navLabel: "Asset governance",
    availability: "Partly available",
    summary:
      "Maintain the register of systems, services and data stores your controls depend on, and relate them to risks and evidence.",
    problem:
      "Controls are described in the abstract while risk lives in specific systems. Without an asset register, scope arguments during an assessment cannot be settled with a record.",
    workflow: [
      {
        title: "Register what matters",
        body: "Record the systems, services and data stores in scope, with owners and classification. The register is maintained by people who know the environment.",
      },
      {
        title: "Relate to controls and risks",
        body: "Assets link to the controls protecting them and the risks affecting them, which makes scope discussions concrete.",
        points: [
          "Manual asset register with ownership and classification — available now",
          "Automated asset discovery — planned, not available today",
        ],
      },
      {
        title: "Keep the register honest",
        body: "Assets carry review dates so decommissioned systems leave the register instead of quietly inflating scope.",
      },
    ],
    capabilities: [
      { title: "Asset register", body: "Systems, services and data stores with owners." },
      { title: "Classification", body: "Sensitivity recorded to drive control selection." },
      { title: "Relationships", body: "Links to the controls and risks that apply." },
      { title: "Review cadence", body: "Scheduled confirmation that the register is current." },
    ],
    humanResponsibilities: [
      "Confirming what is genuinely in scope",
      "Classifying assets appropriately",
      "Retiring register entries when systems are decommissioned",
    ],
    related: ["risk-management", "controls", "integrations"],
    relatedFrameworks: ["iso-27001", "essential-eight"],
  },
  {
    slug: "reporting",
    path: "/features/reporting",
    name: "Reporting",
    navLabel: "Reporting",
    availability: "Available now",
    summary:
      "Readiness and coverage reporting derived from live control and evidence records, not from a separately maintained status sheet.",
    problem:
      "Board reporting is usually re-created by hand every quarter. By the time it is presented it is out of date, and it cannot be traced back to the records it summarises.",
    workflow: [
      {
        title: "Report from the record",
        body: "Readiness reflects control implementation status and validated evidence. Change the underlying record and the report follows.",
      },
      {
        title: "Show the gap, not just the score",
        body: "Reports identify what is outstanding and who owns it, so the output is a work list rather than a number.",
        points: [
          "Framework readiness and coverage views",
          "Outstanding items with owners and due dates",
          "Trend over time from retained history",
        ],
      },
      {
        title: "Support the decision",
        body: "Reporting informs a readiness decision made by people. NOVA never declares an organisation ready or certified.",
      },
    ],
    capabilities: [
      { title: "Readiness views", body: "Per-framework status derived from live records." },
      { title: "Gap reporting", body: "Outstanding requirements with accountable owners." },
      { title: "Trend history", body: "Progress over time from retained record history." },
      { title: "Executive summaries", body: "Board-appropriate views without re-keying data." },
    ],
    humanResponsibilities: [
      "Interpreting readiness in the organisation's context",
      "Deciding whether to proceed to assessment",
      "Approving anything reported externally",
    ],
    related: ["controls", "evidence", "trust-centre"],
    relatedFrameworks: ["soc-2", "iso-27001", "essential-eight"],
  },
  {
    slug: "trust-centre",
    path: "/features/trust-centre",
    name: "Trust Centre",
    navLabel: "Trust Centre",
    availability: "Available now",
    summary:
      "Publish approved assurance information to customers and prospects without exposing the underlying confidential evidence.",
    problem:
      "Security questionnaires arrive constantly and are answered individually, often inconsistently. Meanwhile the material customers actually want is confidential and cannot simply be attached to an email.",
    workflow: [
      {
        title: "Choose what may be published",
        body: "Publication is an approval decision. Only content explicitly approved for external disclosure appears, and the underlying evidence stays inside the tenant boundary.",
      },
      {
        title: "Answer once, reuse many times",
        body: "Common assurance questions are answered from approved content rather than rewritten per buyer.",
        points: [
          "Approval required before anything is published",
          "Confidential evidence never exposed through publication",
          "Content reviewed on a cadence so it does not go stale",
        ],
      },
      {
        title: "Keep it current",
        body: "Published content carries review dates, because an outdated assurance statement is worse than no statement.",
      },
    ],
    capabilities: [
      { title: "Approved publication", body: "Explicit approval before external visibility." },
      { title: "Assurance content library", body: "Reusable answers to recurring questions." },
      { title: "Disclosure boundaries", body: "Confidential evidence stays internal by default." },
      { title: "Review cadence", body: "Scheduled refresh of published statements." },
    ],
    humanResponsibilities: [
      "Approving every item published externally",
      "Deciding the disclosure boundary",
      "Confirming published statements remain accurate",
    ],
    related: ["evidence", "auditor-portal", "reporting"],
  },
  {
    slug: "auditor-portal",
    path: "/features/auditor-portal",
    name: "Auditor Portal",
    navLabel: "Auditor Portal",
    availability: "Available now",
    summary:
      "Give auditors and assessors scoped access to the evidence for an engagement, with requests and findings tracked in one workflow.",
    problem:
      "Audit fieldwork usually runs on email and shared folders. Requests are lost, the same artefact is sent three times, and nobody has a single view of what remains outstanding.",
    workflow: [
      {
        title: "Scope the engagement",
        body: "Access is granted for a defined engagement and scope. Auditors see what the engagement requires and nothing else, inside your tenant boundary.",
      },
      {
        title: "Track requests",
        body: "Evidence requests are raised, assigned and fulfilled in one place, so the outstanding list is always current.",
        points: [
          "Scoped, time-bounded access per engagement",
          "Requests with owners and status",
          "Findings recorded against the control they concern",
        ],
      },
      {
        title: "Record findings",
        body: "Findings attach to the control in question and can generate remediation actions, so the audit output feeds the programme instead of ending in a PDF.",
      },
    ],
    capabilities: [
      { title: "Scoped access", body: "Engagement-limited visibility inside your tenant." },
      { title: "Request workflow", body: "Structured evidence requests with owners." },
      { title: "Finding records", body: "Findings tied to controls and remediation." },
      { title: "Engagement history", body: "A retained record of what was provided and when." },
    ],
    humanResponsibilities: [
      "Approving auditor access and its scope",
      "Confirming what is released for review",
      "Agreeing findings and remediation commitments",
    ],
    related: ["evidence", "trust-centre", "controls"],
    relatedFrameworks: ["soc-2", "iso-27001"],
  },
  {
    slug: "ai-assistant",
    path: "/features/ai-assistant",
    name: "NOVA AI Assistant",
    navLabel: "NOVA AI Assistant",
    availability: "Available now",
    summary:
      "Assistance grounded in your governed workspace content: interpretation, drafting and gap identification, always for human approval.",
    problem:
      "Compliance work contains a large amount of reading, summarising and drafting. Doing it by hand is slow; doing it with an ungoverned general-purpose tool creates content nobody can trace or defend.",
    workflow: [
      {
        title: "Grounded in your records",
        body: "The assistant works from the governed content in your workspace — activated requirements, controls, policies and evidence — rather than from generic material.",
      },
      {
        title: "Drafts, not decisions",
        body: "Output is presented as a draft for review. Nothing is approved, published or marked as satisfied by the assistant.",
        points: [
          "Interprets and summarises uploaded evidence",
          "Prepares policy and control description drafts",
          "Identifies likely gaps against activated requirements",
          "Explains what a requirement is asking for",
        ],
      },
      {
        title: "Human approval is required",
        body: "Approval of policies, acceptance of risk, declaration of readiness and any external statement remain human actions. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
      },
    ],
    capabilities: [
      { title: "Evidence interpretation", body: "Summarise what an artefact shows and which control it may support." },
      { title: "Drafting support", body: "Policy and control description drafts for review." },
      { title: "Gap identification", body: "Likely gaps against activated requirements." },
      { title: "Requirement explanation", body: "Plain-language explanation of what a requirement asks for." },
    ],
    humanResponsibilities: [
      "Reviewing and approving every AI-produced draft",
      "Accepting or treating risk",
      "Declaring readiness for assessment",
      "Any statement made to a customer, auditor or regulator",
    ],
    related: ["policies", "evidence", "reporting"],
    relatedFrameworks: ["iso-42001"],
  },
];

export function getFeature(slug: string): Feature | undefined {
  return features.find((f) => f.slug === slug);
}
