export type ResourceType = "Guide" | "Product update" | "Explainer";

export type Resource = {
  slug: string;
  title: string;
  type: ResourceType;
  status: "Published" | "Coming soon";
  summary: string;
  readingTime?: string;
  published?: string;
  /** Body sections. Only populated for published entries. */
  sections?: { heading: string; paragraphs: string[]; points?: string[] }[];
};

export const resourceTypes: ResourceType[] = ["Guide", "Product update", "Explainer"];

export const emptyStateMessage =
  "Resources are being prepared. Contact Eredox for a NOVA compliance workflow demonstration.";

export const resources: Resource[] = [
  {
    slug: "evidence-that-survives-an-audit",
    title: "Evidence that survives an audit",
    type: "Guide",
    status: "Published",
    published: "2026-07-14",
    readingTime: "6 min read",
    summary:
      "What separates an artefact an assessor accepts from one that generates a follow-up request, and how to capture the difference at collection time.",
    sections: [
      {
        heading: "The problem is provenance, not volume",
        paragraphs: [
          "Organisations rarely fail an assessment because they had too little evidence. They struggle because the evidence they have cannot answer the three questions an assessor asks of every artefact: what does this show, when did it apply, and how do I know it is genuine?",
          "A screenshot with no date, no system context and no indication of who produced it forces the assessor to ask for something else. Each of those follow-ups costs days.",
        ],
      },
      {
        heading: "Capture context at collection time",
        paragraphs: [
          "The cheapest moment to record context is when the artefact is produced. Retrofitting it months later is guesswork.",
        ],
        points: [
          "What the artefact demonstrates, stated plainly",
          "The period it covers, not just the date it was exported",
          "The system or process it came from",
          "The person who produced it and the person who reviewed it",
        ],
      },
      {
        heading: "Map to the control, not the framework",
        paragraphs: [
          "Filing evidence by framework guarantees duplication, because the same artefact often supports requirements in several frameworks. Mapping to the control instead means one item can be relied on wherever it legitimately applies, and the mapping records exactly where that is.",
        ],
      },
      {
        heading: "Review is what makes it count",
        paragraphs: [
          "Evidence that nobody has examined is a file, not assurance. A short review step — does this artefact actually demonstrate the control as described — catches mismatches while there is still time to correct them.",
          "NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
        ],
      },
      {
        heading: "Plan for staleness",
        paragraphs: [
          "Period-of-time assessments fail on stale artefacts more often than on missing ones. Give each evidence type a freshness expectation and treat an expiring item as a task, not a surprise.",
        ],
      },
    ],
  },
  {
    slug: "choosing-your-first-framework",
    title: "Choosing your first compliance framework",
    type: "Explainer",
    status: "Published",
    published: "2026-08-05",
    readingTime: "5 min read",
    summary:
      "SOC 2, ISO/IEC 27001 or Essential Eight — how the choice usually gets made, and the questions worth answering before committing.",
    sections: [
      {
        heading: "Let the buyer decide, mostly",
        paragraphs: [
          "The most reliable signal is what your customers actually ask for. Enterprise buyers in the United States typically ask for a SOC 2 report; international and government-adjacent buyers more often ask for ISO/IEC 27001 certification; Australian government supply chains commonly reference Essential Eight maturity.",
          "Choosing a framework nobody has asked for produces effort without commercial return.",
        ],
      },
      {
        heading: "Understand what each one is",
        paragraphs: [
          "SOC 2 results in an examination report from an independent accounting firm, describing controls against the Trust Services Criteria. ISO/IEC 27001 results in certification of a management system by an accredited body. Essential Eight is an assessment of maturity against eight prioritised mitigation strategies.",
          "They are not interchangeable, and none of them is a statement that an organisation is secure.",
        ],
      },
      {
        heading: "Questions worth answering first",
        paragraphs: ["A short internal discussion prevents a long correction later."],
        points: [
          "Which buyers are blocked today, and what exactly did they ask for?",
          "What scope can we honestly commit to and maintain?",
          "Who will own controls day to day once the project ends?",
          "What is already in place that simply is not documented?",
        ],
      },
      {
        heading: "Scope narrowly and honestly",
        paragraphs: [
          "A narrow scope that is genuinely maintained is more valuable than a broad scope that decays. Scope can be extended once the operating rhythm exists.",
        ],
      },
      {
        heading: "Expect to reuse the work",
        paragraphs: [
          "Access control, change management, incident response and backup evidence carry across frameworks. The second framework is substantially cheaper than the first when the control set is shared rather than rebuilt.",
        ],
      },
    ],
  },
  {
    slug: "control-ownership-in-small-teams",
    title: "Control ownership in small teams",
    type: "Guide",
    status: "Coming soon",
    summary: "Assigning meaningful accountability when the same three people own everything.",
  },
  {
    slug: "preparing-for-a-type-ii-period",
    title: "Preparing for a SOC 2 Type II period",
    type: "Guide",
    status: "Coming soon",
    summary: "What changes when the assessment covers a period rather than a point in time.",
  },
  {
    slug: "risk-acceptance-that-holds-up",
    title: "Risk acceptance that holds up",
    type: "Explainer",
    status: "Coming soon",
    summary: "Recording acceptance as a decision with an owner, a basis and a review date.",
  },
  {
    slug: "nova-platform-update",
    title: "NOVA platform update",
    type: "Product update",
    status: "Coming soon",
    summary: "Release notes will be published here once the first public release note is approved.",
  },
  {
    slug: "human-oversight-in-ai-assisted-compliance",
    title: "Human oversight in AI-assisted compliance",
    type: "Explainer",
    status: "Coming soon",
    summary: "Where the boundary sits between assistance and approval, and why it must be explicit.",
  },
];

export function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

export const publishedResources = resources.filter((r) => r.status === "Published");

export type FaqCategory = { category: string; items: { question: string; answer: string }[] };

export const faqCategories: FaqCategory[] = [
  {
    category: "About NOVA",
    items: [
      {
        question: "What does NOVA Compliance do?",
        answer:
          "NOVA brings frameworks, controls, evidence, policies, risks, assets, reporting and external assurance into one governed workspace. It helps an organisation understand what is ready, what needs attention and what should happen next.",
      },
      {
        question: "Who develops and operates NOVA?",
        answer:
          "NOVA Compliance is developed and operated by Eredox Pty Ltd. It is an independent Eredox product.",
      },
      {
        question: "Can NOVA be used outside Australia?",
        answer:
          "Yes. The frameworks currently available include internationally recognised standards, and the workspace model is not jurisdiction-specific. Some frameworks are regional by nature, and each framework page states its jurisdiction.",
      },
    ],
  },
  {
    category: "Frameworks",
    items: [
      {
        question: "Which frameworks are available today?",
        answer:
          "SOC 2, ISO/IEC 27001, Essential Eight and ISO/IEC 42001 are available now.",
      },
      {
        question: "Which frameworks are planned?",
        answer:
          "The NIST Cybersecurity Framework, HIPAA and the Australian Government Information Security Manual are planned. They are labelled as planned throughout the site and are not operational today.",
      },
      {
        question: "Can one control satisfy several frameworks?",
        answer:
          "Yes. Controls are shared and mapped to the requirements they satisfy across every activated framework, so evidence is reused rather than collected repeatedly.",
      },
      {
        question: "Does NOVA certify our organisation?",
        answer:
          "No. NOVA assists with readiness and evidence management. Certification, attestation and regulatory conclusions remain with authorised independent, regulatory or customer-appointed parties.",
      },
    ],
  },
  {
    category: "Evidence and workflow",
    items: [
      {
        question: "How is evidence collected?",
        answer:
          "Evidence can be uploaded manually with structured metadata, and collected through available connectors. Manual upload with reviewer validation is the baseline; the integrations page states the status of each connector.",
      },
      {
        question: "Does evidence count as soon as it is uploaded?",
        answer:
          "No. A reviewer validates each item against the control expectation. Until that review occurs the item is held but does not contribute to readiness.",
      },
      {
        question: "What happens to old evidence?",
        answer:
          "Evidence carries a freshness expectation. Items approaching or past that expectation are surfaced so they can be refreshed before an assessment.",
      },
    ],
  },
  {
    category: "AI and human approval",
    items: [
      {
        question: "What does the AI assistant actually do?",
        answer:
          "It interprets and summarises evidence, prepares policy and control description drafts, identifies likely gaps against activated requirements and explains what a requirement is asking for. It works from the governed content in your workspace.",
      },
      {
        question: "Can the assistant approve anything?",
        answer:
          "No. Approval of policies, acceptance of risk, declarations of readiness and any external statement are human actions. NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
      },
      {
        question: "What are the assistant's limitations?",
        answer:
          "It can misinterpret an artefact, miss context that was never recorded in the workspace, or produce a draft that reads well but is not accurate for your environment. Every output requires review.",
      },
    ],
  },
  {
    category: "Security and access",
    items: [
      {
        question: "Is our data separated from other organisations?",
        answer:
          "NOVA operates a tenant model. Evidence, controls, policies and reporting are scoped to your tenant, with role-based access inside it.",
      },
      {
        question: "Can auditors access our workspace?",
        answer:
          "Yes, through the Auditor Portal. Access is scoped to the engagement and stays inside your tenant boundary, with requests and findings tracked in one workflow.",
      },
      {
        question: "Is Eredox certified?",
        answer:
          "The security page describes the practices in place. We do not claim certifications that Eredox has not obtained, and no certification is asserted on this website.",
      },
    ],
  },
  {
    category: "Commercial and support",
    items: [
      {
        question: "How is NOVA priced?",
        answer:
          "NOVA is a subscription with entitlements per plan. Indicative amounts are shown on the pricing page and require Eredox approval before they are contractually binding. Enterprise is quoted per organisation.",
      },
      {
        question: "What support is included?",
        answer:
          "Support varies by plan, from documentation and community resources on Free through to agreed arrangements on Enterprise. The pricing page includes a support comparison.",
      },
      {
        question: "What is the Trust Centre?",
        answer:
          "It is where approved assurance information can be published to customers and prospects without exposing the underlying confidential evidence. Publication requires explicit approval.",
      },
    ],
  },
];
