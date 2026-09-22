/**
 * Single governed source for every public resource item.
 *
 * Taxonomy rules (enforced by src/routes/__tests__/resource-taxonomy.test.ts):
 * - each resource has exactly ONE type
 * - each type maps to exactly ONE route section, so every item has one
 *   canonical URL and no text is duplicated across sections
 * - "Explainer" no longer exists as a type; those items are blog articles with
 *   a category, which is where explanatory writing belongs
 */

import { site } from "@/config/site";
import { governedFrameworkCatalogue } from "@/data/framework-catalogue";
import { frameworks } from "@/data/frameworks";
import { integrations } from "@/data/integrations";
import { features } from "@/data/features";
import { pricingFaqs, supportComparison } from "@/data/pricing";

export type ResourceType =
  | "Blog article"
  | "Guide"
  | "Product update"
  | "Case study"
  | "Webinar";

export type ResourceStatus = "Published" | "Coming soon";

export type ResourceSection = { heading: string; paragraphs: string[]; points?: string[] };

export type Resource = {
  slug: string;
  title: string;
  type: ResourceType;
  /** Editorial category, used for blog articles. Not a second taxonomy. */
  category?: string;
  status: ResourceStatus;
  summary: string;
  readingTime?: string;
  /** ISO date. Only set where the date is genuine. */
  published?: string;
  modified?: string;
  seoTitle?: string;
  seoDescription?: string;
  /** Body sections. Only populated for published entries. */
  sections?: ResourceSection[];
  relatedFrameworks?: { label: string; to: string }[];
  relatedFeatures?: { label: string; to: string }[];
  featured?: boolean;
};

export const resourceTypes: ResourceType[] = [
  "Blog article",
  "Guide",
  "Product update",
  "Case study",
  "Webinar",
];

/** The one route section that owns each type. */
export const typeRoutes: Record<ResourceType, string> = {
  "Blog article": "/resources/blog",
  Guide: "/resources/guides",
  "Product update": "/resources/product-updates",
  "Case study": "/resources/case-studies",
  Webinar: "/resources/webinars",
};

export const typeLabels: Record<ResourceType, string> = {
  "Blog article": "Blog",
  Guide: "Guides",
  "Product update": "Product updates",
  "Case study": "Case studies",
  Webinar: "Webinars",
};

export const emptyStateMessage =
  "Resources are being prepared. Contact Eredox for a NOVA compliance workflow demonstration.";

export const publisher = "Eredox Pty Ltd";

/** Blog categories in use. Adding an article uses one of these. */
export const blogCategories = [
  "Frameworks",
  "Evidence",
  "Risk",
  "Responsible AI",
  "Programme management",
] as const;

/**
 * Editorial backlog. These are planning topics only — nothing here is
 * published, and none of them render as an article until written and approved.
 */
export const plannedBlogTopics: { title: string; category: string }[] = [
  { title: "What is ISO/IEC 27001 and who needs it?", category: "Frameworks" },
  { title: "SOC 2 compared with ISO/IEC 27001", category: "Frameworks" },
  { title: "What is compliance evidence?", category: "Evidence" },
  { title: "Preparing for a SOC 2 Type II period", category: "Frameworks" },
  { title: "Understanding Essential Eight maturity", category: "Frameworks" },
  { title: "ISO/IEC 42001 and AI management systems", category: "Responsible AI" },
  { title: "How control mapping reduces duplicate compliance work", category: "Programme management" },
  { title: "What makes evidence audit-ready?", category: "Evidence" },
  { title: "What is risk acceptance?", category: "Risk" },
  { title: "Human oversight in AI-assisted compliance", category: "Responsible AI" },
  { title: "Managing multiple compliance frameworks", category: "Programme management" },
  { title: "Compliance readiness compared with certification", category: "Programme management" },
];

export const resources: Resource[] = [
  {
    slug: "choosing-your-first-framework",
    title: "Choosing your first compliance framework",
    type: "Blog article",
    category: "Frameworks",
    status: "Published",
    published: "2026-08-05",
    modified: "2026-08-05",
    readingTime: "5 min read",
    featured: true,
    seoTitle: "Choosing your first compliance framework — SOC 2, ISO 27001 or Essential Eight",
    seoDescription:
      "How organisations usually choose between SOC 2, ISO/IEC 27001 and Essential Eight, and the questions worth answering before committing to one.",
    summary:
      "SOC 2, ISO/IEC 27001 or Essential Eight — how the choice usually gets made, and the questions worth answering before committing.",
    relatedFrameworks: [
      { label: "SOC 2 in NOVA", to: "/frameworks/soc-2" },
      { label: "ISO/IEC 27001 in NOVA", to: "/frameworks/iso-27001" },
      { label: "All frameworks", to: "/frameworks" },
    ],
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
          "NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.",
        ],
      },
    ],
  },
  {
    slug: "risk-acceptance-that-holds-up",
    title: "Risk acceptance that holds up",
    type: "Blog article",
    category: "Risk",
    status: "Coming soon",
    summary: "Recording acceptance as a decision with an owner, a basis and a review date.",
  },
  {
    slug: "human-oversight-in-ai-assisted-compliance",
    title: "Human oversight in AI-assisted compliance",
    type: "Blog article",
    category: "Responsible AI",
    status: "Coming soon",
    summary: "Where the boundary sits between assistance and approval, and why it must be explicit.",
  },
  {
    slug: "evidence-that-survives-an-audit",
    title: "Evidence that survives an audit",
    type: "Guide",
    status: "Published",
    published: "2026-07-14",
    modified: "2026-07-14",
    readingTime: "6 min read",
    summary:
      "What separates an artefact an assessor accepts from one that generates a follow-up request, and how to capture the difference at collection time.",
    relatedFeatures: [{ label: "Evidence management", to: "/features" }],
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
    slug: "nova-platform-update",
    title: "NOVA platform update",
    type: "Product update",
    status: "Coming soon",
    summary: "Release notes will be published here once the first public release note is approved.",
  },
];

/** The canonical path for a resource, derived from its single type. */
export function resourcePath(resource: Resource): string {
  return `${typeRoutes[resource.type]}/${resource.slug}`;
}

export function byType(type: ResourceType): Resource[] {
  return resources.filter((r) => r.type === type);
}

export function publishedByType(type: ResourceType): Resource[] {
  return resources.filter((r) => r.type === type && r.status === "Published");
}

export function getResource(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}

/** Every published item, in reverse publication order. */
export const publishedResources = resources
  .filter((r) => r.status === "Published")
  .sort((a, b) => (b.published ?? "").localeCompare(a.published ?? ""));

/**
 * Permanent redirects for URLs that existed before the taxonomy was
 * normalised. Old path -> current canonical path.
 */
export const legacyResourceRedirects: Record<string, string> = {
  "/resources/case-studies/choosing-your-first-framework": "/resources/blog/choosing-your-first-framework",
  "/resources/case-studies/risk-acceptance-that-holds-up": "/resources/blog/risk-acceptance-that-holds-up",
  "/resources/case-studies/human-oversight-in-ai-assisted-compliance":
    "/resources/blog/human-oversight-in-ai-assisted-compliance",
  "/resources/blog/nova-platform-update": "/resources/product-updates/nova-platform-update",
  "/resources/webinars/evidence-that-survives-an-audit": "/resources/guides/evidence-that-survives-an-audit",
  "/resources/webinars/control-ownership-in-small-teams": "/resources/guides/control-ownership-in-small-teams",
  "/resources/webinars/preparing-for-a-type-ii-period": "/resources/guides/preparing-for-a-type-ii-period",
};

export type FaqLink = { label: string; to: string };
export type FaqItem = { question: string; answer: string; shortAnswer?: string; links?: FaqLink[] };
export type FaqCategory = { category: string; items: FaqItem[] };

const availableFrameworkNames = frameworks
  .filter((framework) => framework.availability === "Available now")
  .map((framework) => framework.name)
  .join(", ");
const configurableFrameworkNames = frameworks
  .filter((framework) => framework.availability === "Available connected to your data")
  .map((framework) => framework.name)
  .join(", ");
const availableIntegrationNames = integrations
  .filter((integration) => integration.status === "Available now")
  .map((integration) => integration.name)
  .join(", ");
const aiAssistant = features.find((feature) => feature.slug === "ai-assistant");
const aiCapabilityNames = aiAssistant?.capabilities.map((capability) => capability.title.toLowerCase()).join(", ") ?? "requirement explanation and drafting support";
const planSupport = supportComparison.map((support) => `${support.plan}: ${support.channel}`).join("; ");
const auditorAccessAnswer = pricingFaqs.find((faq) => faq.question === "Do you charge for auditor access?")?.answer ?? "Auditor access follows the entitlements shown on the pricing page.";

export const faqCategories: FaqCategory[] = [
  {
    category: "About NOVA",
    items: [
      {
        question: "What does NOVA Compliance do?",
        answer:
          "NOVA brings frameworks, controls, evidence, policies, risks, assets, ownership, testing, reporting and external assurance into one governed workspace. It maintains one connected compliance record instead of separate spreadsheets, folders and point-in-time status reports.",
        links: [{ label: "Explore the platform", to: "/platform" }],
      },
      {
        question: "What does NOVA actually do that spreadsheets and shared folders do not?",
        answer:
          "Spreadsheets and folders can store information, but they do not naturally maintain the relationships between requirements, controls, evidence, owners, policies, risks, test results, framework mappings and readiness reporting. NOVA maintains those relationships as governed records so changes and gaps can be traced across the programme.",
        shortAnswer:
          "NOVA connects requirements, controls, evidence, owners and readiness reporting as governed records, so changes and gaps can be traced instead of being scattered across spreadsheets and folders.",
        links: [{ label: "See the platform workflow", to: "/platform" }],
      },
      {
        question: "Who develops and operates NOVA?",
        answer: site.ownership,
      },
      {
        question: "Can NOVA be used outside Australia?",
        answer:
          "Yes. NOVA is designed for organisations operating across multiple jurisdictions and supports global, regional and organisation-specific requirements. Some frameworks are jurisdiction-specific, so applicability must still be determined by the organisation.",
      },
    ],
  },
  {
    category: "Getting started",
    items: [
      {
        question: "Do we need NOVA before we start an audit, or only once we are already compliant?",
        answer:
          "NOVA can be used before, during and after assessment: define scope, establish controls, assign owners, collect evidence, identify gaps, prepare for external review and maintain the programme afterwards. NOVA supports the work but does not make an organisation compliant by itself.",
      },
      {
        question: "Can NOVA replace our compliance consultant, vCISO or internal compliance team?",
        answer:
          "No. NOVA provides the governed system, workflows, evidence structure, control mapping and reporting. Human expertise may still be needed for scope, security design, remediation, interpretation, risk decisions and certification or attestation preparation.",
      },
      {
        question: "How long does it take to become audit-ready?",
        answer:
          "There is no fixed timeframe. Readiness depends on scope, existing controls, evidence history, remediation effort, staff availability, framework requirements and external assessor expectations. NOVA makes outstanding work visible and accountable but does not guarantee timing.",
      },
    ],
  },
  {
    category: "Frameworks & requirements",
    items: [
      {
        question: "What does \"27 available frameworks\" mean?",
        answer: `The governed NOVA catalogue contains ${governedFrameworkCatalogue.availableCount} framework capabilities across native and configurable support. ${governedFrameworkCatalogue.availabilityNote} Activation also depends on applicable requirements, entitlement and the evidence available for the customer scope.`,
        shortAnswer: `NOVA's governed catalogue contains ${governedFrameworkCatalogue.availableCount} framework capabilities across native and configurable support. Activation depends on scope, customer data, evidence and entitlement; it does not mean every framework is active for every customer.`,
        links: [{ label: "View framework availability", to: "/frameworks" }],
      },
      {
        question: "Which frameworks are available today?",
        answer: `${availableFrameworkNames} are available now in the governed inventory. ${configurableFrameworkNames} are available connected to your data or configuration. The wider catalogue contains additional capabilities, and activation depends on scope and evidence.`,
        links: [{ label: "Browse the framework library", to: "/frameworks" }],
      },
      {
        question: "Can we manage several frameworks at the same time?",
        answer:
          "Yes. NOVA uses a shared control model so one legitimate control and its validated evidence can support multiple requirements where they are genuinely applicable.",
      },
      {
        question: "What happens when the same control applies to several frameworks?",
        answer:
          "The control is maintained once and mapped to each applicable requirement. Ownership is maintained once, evidence can be reused where valid, testing affects every framework relying on the control, and gaps remain visible across mappings.",
      },
      {
        question: "Can one evidence item support several frameworks?",
        answer:
          "Yes, where it legitimately demonstrates the mapped control or requirement. The mapping remains explicit and reviewable; evidence is not reused automatically without validation.",
      },
      {
        question: "Can we add a framework, regulation, customer requirement or internal standard that is not already listed?",
        answer:
          "Yes, through the Custom Framework capability. Additional requirements can be modelled and connected to controls, evidence, risks, owners, policies and reporting. NOVA does not provide legal interpretation.",
        links: [{ label: "Learn about frameworks", to: "/frameworks" }],
      },
      {
        question: "Does NOVA certify our organisation?",
        answer: site.frameworkDisclaimer,
      },
      {
        question: "Does NOVA guarantee we will pass an audit?",
        answer:
          "No. NOVA helps organisations understand and evidence readiness, but the outcome depends on actual controls, evidence, scope and the independent assessment.",
      },
    ],
  },
  {
    category: "Evidence & automation",
    items: [
      {
        question: "What does NOVA actually automate, and what still needs human approval?",
        answer:
          "NOVA reduces repetitive collection, organisation and mapping work through governed connectors and evidence workflows. It can assist with collecting evidence, organising artefacts, mapping evidence to controls, surfacing gaps, reminders, review workflows and reporting from governed records. It does not approve evidence, accept risk, approve policies, certify the organisation or declare audit readiness. Human approval remains required.",
        shortAnswer:
          "NOVA can help collect, organise and map evidence, surface gaps and support review workflows. It does not approve evidence, accept risk or declare readiness; human approval remains required.",
        links: [
          { label: "Explore evidence management", to: "/features/evidence" },
          { label: "See connector status", to: "/integrations" },
        ],
      },
      {
        question: "Which integrations and connectors are available today?",
        answer: `${availableIntegrationNames} are available now in the governed integration inventory. Other connector categories remain clearly marked with their source status, including Planned where they are not available today.`,
        links: [{ label: "View integrations", to: "/integrations" }],
      },
      {
        question: "What happens if NOVA does not have a connector for one of our systems?",
        answer:
          "Evidence can still be uploaded manually with structured metadata and mapped to the relevant controls. A missing connector does not prevent the programme from operating.",
        links: [{ label: "See evidence management", to: "/features/evidence" }],
      },
      {
        question: "Does evidence count as soon as it is uploaded or collected?",
        answer:
          "No. A reviewer validates that the evidence actually demonstrates the control before it contributes to readiness. Until review occurs, the item is held but does not count.",
      },
      {
        question: "How does NOVA keep evidence current?",
        answer:
          "Evidence has freshness expectations and review history. Ageing or expired evidence is surfaced for refresh before assessment so the programme record reflects current operation rather than a historical snapshot.",
      },
      {
        question: "Can one evidence item be reused across several frameworks?",
        answer:
          "Yes, where the evidence genuinely supports a shared control. The mapping remains explicit and reviewable across every framework that relies on it.",
      },
    ],
  },
  {
    category: "Audit & assurance",
    items: [
      {
        question: "Do we still need an independent auditor or certification body?",
        answer:
          "Yes, where the chosen framework requires independent assurance. NOVA organises the programme, evidence and readiness record but does not replace an external auditor, assessor or certification body.",
        shortAnswer:
          "Yes, where the chosen framework requires it. NOVA organises evidence and readiness but does not replace an independent auditor, assessor or certification body.",
        links: [{ label: "Explore the Auditor Portal", to: "/features/auditor-portal" }],
      },
      {
        question: "How does an auditor work with NOVA?",
        answer:
          "The Auditor Portal provides scoped engagement access, evidence requests, findings and controlled collaboration inside the tenant boundary. It does not provide unrestricted access to the customer workspace.",
        links: [{ label: "See Auditor Portal", to: "/features/auditor-portal" }],
      },
      {
        question: "Can NOVA help reduce repeated security questionnaires?",
        answer:
          "Yes. The Trust Centre can publish approved assurance content so common customer questions can be answered without exposing confidential underlying evidence. Publication requires explicit approval.",
        links: [{ label: "Explore the Trust Centre", to: "/features/trust-centre" }],
      },
      {
        question: "What does readiness percentage mean?",
        answer:
          "Readiness is a decision-support indicator derived from the underlying control, test and validated evidence state. It is not certification, an audit outcome or a guarantee.",
      },
    ],
  },
  {
    category: "AI governance & human oversight",
    items: [
      {
        question: "How does NOVA help us govern AI use?",
        answer:
          "NOVA can connect AI requirements, policies, AI systems, risks, impact assessments, controls, owners, evidence, human oversight and monitoring. ISO/IEC 42001 is one relevant framework, but the same structure can support broader responsible-AI and organisational governance needs.",
        shortAnswer:
          "NOVA connects AI requirements, systems, risks, impact assessments, controls, evidence and human oversight in one governed record. ISO/IEC 42001 is one use case, not the only one.",
        links: [
          { label: "Explore AI governance", to: "/responsible-ai" },
          { label: "See the AI Assistant", to: "/features/ai-assistant" },
        ],
      },
      {
        question: "Can NOVA help if we use AI but are not seeking ISO/IEC 42001 certification?",
        answer:
          "Yes. Organisations can use the same governance structure for internal AI policy, customer requirements, risk management, responsible AI, contractual obligations and other governance requirements.",
      },
      {
        question: "Can NOVA's AI Assistant approve policies, evidence or risks?",
        answer: `No. ${site.humanStatement}`,
        links: [{ label: "Read the responsible AI position", to: "/responsible-ai" }],
      },
      {
        question: "What can the AI Assistant actually do?",
        answer: `The governed AI Assistant supports ${aiCapabilityNames}. It works from the governed content in the workspace and presents output for human review rather than autonomous approval.`,
        links: [{ label: "Explore the AI Assistant", to: "/features/ai-assistant" }],
      },
      {
        question: "What are the AI Assistant's limitations?",
        answer:
          "It can misunderstand context, produce an incorrect draft or miss information that is not available in the governed workspace. Outputs require human review before they are used, approved or published.",
      },
    ],
  },
  {
    category: "Security & trust",
    items: [
      {
        question: "Is our information separated from other NOVA customers?",
        answer:
          "Yes. Evidence, controls, policies, risks and reporting are scoped to the customer tenant with role-based access inside that tenant.",
        links: [{ label: "Read the security overview", to: "/security" }],
      },
      {
        question: "Can auditors see all of our information?",
        answer:
          "No. Auditor access is scoped to the engagement through the Auditor Portal and remains within the tenant boundary.",
        links: [{ label: "See scoped auditor access", to: "/features/auditor-portal" }],
      },
      {
        question: "What can we safely publish through the Trust Centre?",
        answer:
          "Only explicitly approved assurance information should be published. Confidential underlying evidence remains internal unless separately authorised.",
        links: [{ label: "Explore the Trust Centre", to: "/features/trust-centre" }],
      },
      {
        question: "Is Eredox certified?",
        answer:
          "The security and trust pages describe the practices in place. Eredox does not claim certifications that it has not obtained, and no unsupported certification is asserted on this website.",
        links: [{ label: "Review security practices", to: "/security" }],
      },
    ],
  },
  {
    category: "Commercial & support",
    items: [
      {
        question: "How is NOVA priced?",
        answer:
          "NOVA is priced as a subscription with entitlements per plan. The pricing page is the commercial authority for current indicative amounts, approval status, included capabilities and Enterprise scope.",
        links: [{ label: "View pricing", to: "/pricing" }],
      },
      {
        question: "Is the NOVA subscription the total cost of becoming certified?",
        answer:
          "No. External costs may include an auditor or certification body, consultants, remediation, internal staff time and technical implementation. The NOVA subscription covers the platform and plan entitlements.",
      },
      {
        question: "Can we change plans later?",
        answer: pricingFaqs.find((faq) => faq.question === "Can we change plan later?")?.answer ?? "Yes. Plans change entitlements in the same governed workspace rather than requiring the programme to be rebuilt.",
        links: [{ label: "Compare plans", to: "/pricing" }],
      },
      {
        question: "What support is included?",
        answer: `Support is plan-dependent: ${planSupport}. The pricing page remains the source of truth for current support arrangements.`,
        links: [{ label: "Compare support", to: "/pricing" }],
      },
      {
        question: "Do you charge separately for auditor access?",
        answer: auditorAccessAnswer,
        links: [{ label: "See pricing entitlements", to: "/pricing" }],
      },
    ],
  },
];

const homepageFaqQuestions = [
  "What does NOVA actually do that spreadsheets and shared folders do not?",
  "What does \"27 available frameworks\" mean?",
  "What does NOVA actually automate, and what still needs human approval?",
  "Do we still need an independent auditor or certification body?",
  "How does NOVA help us govern AI use?",
] as const;

export const homepageFaqItems: FaqItem[] = homepageFaqQuestions.map((question) => {
  const item = faqCategories.flatMap((category) => category.items).find((candidate) => candidate.question === question);
  if (!item) throw new Error(`Homepage FAQ question is not in the governed FAQ library: ${question}`);
  return { ...item, answer: item.shortAnswer ?? item.answer };
});
