export type Solution = {
  slug: string;
  path: string;
  name: string;
  navLabel: string;
  audience: "Organisation" | "Role";
  summary: string;
  intro: string;
  challenges: { title: string; body: string }[];
  workflow: { step: string; title: string; body: string }[];
  capabilities: string[];
  governance: string;
  implementation: { title: string; body: string }[];
  relatedFrameworks: string[];
  relatedFeatures: string[];
};

export const solutions: Solution[] = [
  {
    slug: "startups-saas",
    path: "/solutions/startups-saas",
    name: "Startups and SaaS",
    navLabel: "Startups and SaaS",
    audience: "Organisation",
    summary: "Get through your first enterprise security review without pausing the product roadmap.",
    intro:
      "For an early-stage SaaS company, compliance usually arrives as a blocker: a prospect asks for a SOC 2 report and the deal stalls. The problem is rarely that the company is insecure. It is that nothing is written down in a form anyone outside the team can verify.",
    challenges: [
      { title: "Compliance appears mid-deal", body: "The first serious questionnaire lands when a contract is already in motion, with no programme in place to answer it." },
      { title: "No dedicated compliance owner", body: "The work falls to an engineering lead or founder who already has a full role." },
      { title: "Practices exist but are undocumented", body: "Access is controlled and changes are reviewed, but none of it is evidenced." },
      { title: "Fear of committing to the wrong framework", body: "Choosing SOC 2 or ISO/IEC 27001 too early can waste months of effort." },
    ],
    workflow: [
      { step: "01", title: "Pick one framework", body: "Activate the framework your buyers actually ask for, and record the scope narrowly and honestly." },
      { step: "02", title: "Write down what you already do", body: "Turn existing practice into described controls with named owners before adding anything new." },
      { step: "03", title: "Collect evidence as you work", body: "Capture access reviews, change approvals and incident records as they happen rather than reconstructing them later." },
      { step: "04", title: "Report the gap", body: "Use readiness reporting to decide when to engage an assessor, instead of guessing." },
    ],
    capabilities: [
      "Single-framework activation with narrow, defensible scope",
      "Control ownership that fits a small team",
      "GitHub evidence connector for engineering artefacts",
      "Trust Centre publication to shorten questionnaire cycles",
    ],
    governance:
      "A small team benefits most from clear approval boundaries. NOVA drafts; a named person approves. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    implementation: [
      { title: "Weeks 1–2", body: "Activate the framework, agree scope and assign control ownership." },
      { title: "Weeks 3–6", body: "Describe controls, upload existing evidence and close obvious gaps." },
      { title: "Ongoing", body: "Maintain evidence freshness and use readiness reporting to time the assessment." },
    ],
    relatedFrameworks: ["soc-2", "iso-27001"],
    relatedFeatures: ["framework-management", "evidence", "trust-centre"],
  },
  {
    slug: "technology-smes",
    path: "/solutions/technology-smes",
    name: "Technology SMEs",
    navLabel: "Technology SMEs",
    audience: "Organisation",
    summary: "Consolidate several overlapping obligations into one control set your team can actually maintain.",
    intro:
      "Established technology SMEs typically carry more than one obligation at once: a certification to maintain, a government buyer with its own baseline, and a growing list of customer-specific commitments. Running them separately multiplies the workload without improving security.",
    challenges: [
      { title: "Parallel programmes", body: "Each framework has its own spreadsheet, owner and evidence folder." },
      { title: "Evidence collected repeatedly", body: "The same access review is gathered three times for three audiences." },
      { title: "Maintenance falls behind", body: "Certification is achieved and then decays until the surveillance audit approaches." },
      { title: "Reporting is manual", body: "Leadership asks for status and someone spends two days assembling it." },
    ],
    workflow: [
      { step: "01", title: "Consolidate the control set", body: "Map every activated framework onto one shared set of controls with single owners." },
      { step: "02", title: "Map evidence once", body: "Point each artefact at every requirement it legitimately supports." },
      { step: "03", title: "Set a maintenance cadence", body: "Give controls review frequencies and evidence freshness expectations." },
      { step: "04", title: "Report continuously", body: "Replace the quarterly assembly exercise with reporting from live records." },
    ],
    capabilities: [
      "Cross-framework control reuse",
      "Evidence mapped to multiple requirements",
      "Review cadence and freshness tracking",
      "Readiness reporting derived from live records",
    ],
    governance:
      "Consolidation increases the consequence of each control, so ownership and approval must be explicit. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    implementation: [
      { title: "Phase 1", body: "Inventory existing controls and remove duplicates across programmes." },
      { title: "Phase 2", body: "Activate all applicable frameworks and complete requirement mapping." },
      { title: "Phase 3", body: "Establish maintenance cadence and reporting for leadership." },
    ],
    relatedFrameworks: ["iso-27001", "soc-2", "essential-eight"],
    relatedFeatures: ["framework-management", "controls", "reporting"],
  },
  {
    slug: "regulated-organisations",
    path: "/solutions/regulated-organisations",
    name: "Regulated organisations",
    navLabel: "Regulated organisations",
    audience: "Organisation",
    summary: "Maintain a defensible record where the question is not only what you did, but how you can prove it.",
    intro:
      "In a regulated environment the standard of proof is higher. It is not enough to operate a control well; the organisation must be able to demonstrate, after the fact, who was accountable, what was decided and on what basis.",
    challenges: [
      { title: "Evidence must survive scrutiny", body: "Artefacts need provenance, dates and a reviewer, not just a file name." },
      { title: "Decisions must be attributable", body: "Risk acceptance and scope exclusions require a named decision-maker." },
      { title: "Multiple oversight audiences", body: "Regulators, internal audit, boards and customers each ask differently." },
      { title: "Change must be governed", body: "Undocumented change is the most common source of findings." },
    ],
    workflow: [
      { step: "01", title: "Establish the governance record", body: "Controls, policies and risks carry named owners, approval history and review dates." },
      { step: "02", title: "Enforce reviewed evidence", body: "Evidence counts only after a person validates it against the control expectation." },
      { step: "03", title: "Record decisions explicitly", body: "Acceptance, exclusion and treatment are recorded actions with accountable people." },
      { step: "04", title: "Report to each audience", body: "Produce the view each oversight audience needs from the same underlying record." },
    ],
    capabilities: [
      "Reviewed evidence with retained provenance",
      "Explicit risk acceptance records",
      "Policy approval history per version",
      "Auditor Portal for scoped external review",
    ],
    governance:
      "Accountability cannot be delegated to software. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    implementation: [
      { title: "Establish", body: "Define scope, ownership and the evidence standard the organisation will hold itself to." },
      { title: "Operate", body: "Run control testing, evidence review and risk cycles on a fixed cadence." },
      { title: "Demonstrate", body: "Use scoped auditor access and reporting for each oversight audience." },
    ],
    relatedFrameworks: ["iso-27001", "soc-2", "iso-42001"],
    relatedFeatures: ["controls", "risk-management", "auditor-portal"],
  },
  {
    slug: "service-providers",
    path: "/solutions/service-providers",
    name: "MSPs, MSSPs and advisers",
    navLabel: "MSPs, MSSPs and advisers",
    audience: "Organisation",
    summary: "Run consistent compliance engagements across clients without rebuilding the method every time.",
    intro:
      "Providers and advisers carry two burdens at once: their own compliance posture, and the delivery of compliance work for clients. Consistency is the differentiator, and consistency is hard when each engagement lives in its own set of documents.",
    challenges: [
      { title: "Method varies by consultant", body: "Quality depends on who is delivering rather than on a defined approach." },
      { title: "Client evidence is scattered", body: "Artefacts arrive by email and end up outside any governed structure." },
      { title: "Progress is hard to report", body: "Clients ask where they stand and the answer requires a manual review." },
      { title: "Own posture is neglected", body: "The provider's own programme is always the lowest priority." },
    ],
    workflow: [
      { step: "01", title: "Standardise the method", body: "Use one control and evidence structure as the basis for every engagement." },
      { step: "02", title: "Keep client records separated", body: "Each client's workspace is tenant-isolated with role-based access." },
      { step: "03", title: "Track engagement progress", body: "Use readiness reporting as the recurring client status conversation." },
      { step: "04", title: "Maintain your own programme", body: "Apply the same discipline to the provider's own posture." },
    ],
    capabilities: [
      "Tenant separation between client environments",
      "Role-based access for consultants and client staff",
      "Repeatable control and evidence structure",
      "Readiness reporting suitable for client updates",
    ],
    governance:
      "Advisory output remains advice. The client organisation owns its decisions. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    implementation: [
      { title: "Define", body: "Agree the standard engagement structure your team will use." },
      { title: "Deliver", body: "Onboard clients into isolated workspaces with scoped access." },
      { title: "Review", body: "Use reporting for recurring client status and internal quality review." },
    ],
    relatedFrameworks: ["essential-eight", "iso-27001", "soc-2"],
    relatedFeatures: ["framework-management", "evidence", "reporting"],
  },
  {
    slug: "compliance-teams",
    path: "/solutions/compliance-teams",
    name: "Compliance teams",
    navLabel: "Compliance teams",
    audience: "Role",
    summary: "Spend less time chasing artefacts and more time on the judgement only you can apply.",
    intro:
      "Compliance managers rarely lack knowledge of what needs to happen. They lack a structure that keeps evidence current between assessments and a way to see, at any moment, which controls are actually supported.",
    challenges: [
      { title: "Chasing evidence", body: "A significant share of the role is spent requesting artefacts from other teams." },
      { title: "No live view of status", body: "Readiness is only known during the weeks around an assessment." },
      { title: "Repetitive drafting", body: "Policy and control description writing consumes time that judgement should get." },
      { title: "Handover risk", body: "Programme knowledge sits with one person." },
    ],
    workflow: [
      { step: "01", title: "Distribute ownership", body: "Give every control a named owner so evidence requests have a destination." },
      { step: "02", title: "Automate what is real", body: "Use available connectors for engineering evidence and keep the rest structured and manual." },
      { step: "03", title: "Use AI for drafts", body: "Let the assistant prepare descriptions and summaries, then apply your own judgement." },
      { step: "04", title: "Make status visible", body: "Publish readiness internally so gaps are a shared problem." },
    ],
    capabilities: [
      "Control ownership and review cadence",
      "Evidence requests with accountable owners",
      "AI-drafted policy and control descriptions for review",
      "Live readiness and gap reporting",
    ],
    governance:
      "The assistant speeds preparation; it does not carry accountability. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    implementation: [
      { title: "First month", body: "Assign ownership across the control set and set review cadences." },
      { title: "Second month", body: "Backfill evidence and validate it against control expectations." },
      { title: "Ongoing", body: "Operate the review cycle and report gaps continuously." },
    ],
    relatedFrameworks: ["iso-27001", "soc-2"],
    relatedFeatures: ["controls", "evidence", "ai-assistant"],
  },
  {
    slug: "executives",
    path: "/solutions/executives",
    name: "Executives and boards",
    navLabel: "Executives and boards",
    audience: "Role",
    summary: "See a compliance position that can be traced back to records, not a colour on a slide.",
    intro:
      "Boards and executives are accountable for statements they cannot personally verify. What they need is not more detail, but a position that is derived from records and can be examined if challenged.",
    challenges: [
      { title: "Status without provenance", body: "A dashboard colour that cannot be traced to underlying evidence." },
      { title: "Reporting lag", body: "Quarterly packs describe a position that has already changed." },
      { title: "Unclear accountability", body: "It is not obvious who owns an outstanding gap." },
      { title: "Overstated automation", body: "Claims that a tool has handled compliance obscure real exposure." },
    ],
    workflow: [
      { step: "01", title: "Agree what is reported", body: "Define the frameworks and scope the board will be briefed on." },
      { step: "02", title: "Derive status from records", body: "Readiness comes from control and evidence state, not manual assertion." },
      { step: "03", title: "Attach ownership to gaps", body: "Every outstanding item names a responsible person and a date." },
      { step: "04", title: "Record the decision", body: "Risk acceptance at executive level is captured as an explicit record." },
    ],
    capabilities: [
      "Executive readiness summaries from live records",
      "Gap lists with named owners and dates",
      "Explicit risk acceptance records",
      "Trend history for board reporting",
    ],
    governance:
      "Automation does not transfer accountability. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    implementation: [
      { title: "Define", body: "Agree the reporting scope and cadence with the compliance function." },
      { title: "Operate", body: "Review readiness and gap ownership at each meeting." },
      { title: "Decide", body: "Record acceptance decisions where residual risk is retained." },
    ],
    relatedFrameworks: ["iso-27001", "iso-42001"],
    relatedFeatures: ["reporting", "risk-management", "trust-centre"],
  },
  {
    slug: "auditors",
    path: "/solutions/auditors",
    name: "Auditors and assessors",
    navLabel: "Auditors and assessors",
    audience: "Role",
    summary: "Receive structured, traceable evidence instead of a shared folder and a long email thread.",
    intro:
      "Fieldwork time is largely consumed by chasing and reconciling artefacts. When evidence arrives with provenance and a clear mapping to controls, the engagement moves faster for everyone involved.",
    challenges: [
      { title: "Unstructured submissions", body: "Artefacts arrive without dates, sources or a stated purpose." },
      { title: "Duplicate requests", body: "The same item is requested and sent multiple times." },
      { title: "No outstanding list", body: "Both sides maintain a private view of what remains." },
      { title: "Findings lose context", body: "Observations end in a document rather than against the control concerned." },
    ],
    workflow: [
      { step: "01", title: "Receive scoped access", body: "Access is granted for the engagement and limited to its scope." },
      { step: "02", title: "Raise structured requests", body: "Requests are tracked with owners and status visible to both sides." },
      { step: "03", title: "Review mapped evidence", body: "Artefacts arrive already mapped to the control and period they support." },
      { step: "04", title: "Record findings in place", body: "Findings attach to controls and can drive remediation actions." },
    ],
    capabilities: [
      "Engagement-scoped access inside the client tenant",
      "Structured evidence requests with status",
      "Evidence with provenance and control mapping",
      "Findings recorded against controls",
    ],
    governance:
      "The client organisation approves what is released and remains responsible for its assertions. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
    implementation: [
      { title: "Engagement setup", body: "The client grants scoped access for the defined engagement." },
      { title: "Fieldwork", body: "Requests, submissions and clarifications run in one tracked workflow." },
      { title: "Close", body: "Findings and remediation commitments are recorded against controls." },
    ],
    relatedFrameworks: ["soc-2", "iso-27001"],
    relatedFeatures: ["auditor-portal", "evidence", "controls"],
  },
];

export function getSolution(slug: string): Solution | undefined {
  return solutions.find((s) => s.slug === slug);
}
