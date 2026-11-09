/** Page-specific topics and suggested questions for the public NOVA AI Information Assistant (shared by client and server). */

export const ASSISTANT_QUESTION_LIMIT = 7;
export const ASSISTANT_NUDGE_AFTER = 5;
export const ASSISTANT_MAX_QUESTION_CHARS = 400;

export type AssistantTopic = {
  key: string;
  label: string;
  /** One short, page-relevant sentence shown under the heading. */
  blurb: string;
  /** Page-relevant NOVA destination for the primary "next step" link. */
  explore: { label: string; to: string };
  questions: [string, string, string];
};

const demo = { label: "See NOVA in Action", to: "/book-demo" };

const generic: AssistantTopic = {
  key: "general",
  blurb: "Have a question about NOVA Compliance, compliance frameworks or how NOVA can support your team? Ask NOVA.",
  explore: demo,
  label: "NOVA Compliance",
  questions: [
    "What does NOVA Compliance do?",
    "Which compliance frameworks does NOVA support?",
    "How does NOVA AI work alongside my team?",
  ],
};

const topics: { match: (path: string) => boolean; topic: AssistantTopic }[] = [
  {
    match: (p) => p === "/frameworks/iso-27001",
    topic: {
      key: "iso-27001",
      blurb: "Have a question about ISO 27001 implementation, controls or audit evidence? Ask NOVA.",
      explore: { label: "Explore ISO 27001 support", to: "/frameworks/iso-27001" },
      label: "ISO 27001",
      questions: [
        "How does NOVA support ISO 27001 implementation?",
        "How are ISO 27001 controls tracked in NOVA?",
        "What audit evidence can NOVA help me organise for ISO 27001?",
      ],
    },
  },
  {
    match: (p) => p === "/frameworks/iso-42001",
    topic: {
      key: "iso-42001",
      blurb: "Have a question about ISO 42001, AI governance or AI risk? Ask NOVA.",
      explore: { label: "Explore ISO 42001 support", to: "/frameworks/iso-42001" },
      label: "ISO 42001",
      questions: [
        "How does NOVA support ISO 42001 AI governance?",
        "How does NOVA help manage AI risk?",
        "What management system requirements does ISO 42001 include?",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/frameworks/"),
    topic: {
      key: "framework",
      blurb: "Have a question about this framework, its controls or the evidence it needs? Ask NOVA.",
      explore: { label: "Explore all frameworks", to: "/frameworks" },
      label: "this framework",
      questions: [
        "How does NOVA support this framework?",
        "Which controls and evidence does it involve?",
        "Can I reuse work across other frameworks?",
      ],
    },
  },
  {
    match: (p) => p === "/frameworks" || p.startsWith("/compliance-journey"),
    topic: {
      key: "frameworks",
      blurb: "Not sure which framework to start with, or how NOVA reuses work across them? Ask NOVA.",
      explore: { label: "Explore frameworks", to: "/frameworks" },
      label: "compliance frameworks",
      questions: [
        "Which framework should I start with?",
        "Which frameworks does NOVA support now?",
        "Can NOVA reuse evidence across frameworks?",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/features/risk-management"),
    topic: {
      key: "risk-management",
      blurb: "Have a question about risk assessments, treatment or risk ownership? Ask NOVA.",
      explore: { label: "Explore Risk Management", to: "/features/risk-management" },
      label: "Risk Management",
      questions: [
        "How does NOVA support risk assessments?",
        "How are risks treated and tracked?",
        "How does NOVA assign risk ownership?",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/features/policies"),
    topic: {
      key: "policies",
      blurb: "Have a question about creating, approving or reviewing policies? Ask NOVA.",
      explore: { label: "Explore Policies", to: "/features/policies" },
      label: "Policies",
      questions: [
        "How does NOVA help create policies?",
        "How does policy approval work?",
        "How are policy reviews scheduled?",
      ],
    },
  },
  {
    match: (p) => p === "/pricing" || p.startsWith("/plans/") || p === "/compare",
    topic: {
      key: "pricing",
      blurb: "Have a question about plans, features or how to see NOVA in a demonstration? Ask NOVA.",
      explore: demo,
      label: "Pricing",
      questions: [
        "What features does each plan include?",
        "How do the plans compare?",
        "How can I see a demonstration of NOVA?",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/features"),
    topic: {
      key: "features",
      blurb: "Have a question about what this part of NOVA does or how it fits your team? Ask NOVA.",
      explore: { label: "Explore NOVA features", to: "/features" },
      label: "NOVA features",
      questions: [
        "What does this part of NOVA do?",
        "How does it work with my team's existing processes?",
        "Which plans include it?",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/resources"),
    topic: {
      key: "knowledge-centre",
      blurb: "Have a question about this article or how it applies in NOVA? Ask NOVA.",
      explore: { label: "Explore the Knowledge Centre", to: "/resources" },
      label: "this article",
      questions: [
        "Can you summarise the key points of this article?",
        "How does this topic apply in NOVA?",
        "What should I do next on this topic?",
      ],
    },
  },
  {
    match: (p) => p.startsWith("/security") || p.startsWith("/trust") || p === "/responsible-ai",
    topic: {
      key: "trust",
      blurb: "Have a question about security, trust or how NOVA keeps people in control of AI? Ask NOVA.",
      explore: { label: "Explore Trust", to: "/trust" },
      label: "security and trust",
      questions: [
        "How does NOVA approach security and trust?",
        "How does NOVA keep humans in control of AI?",
        "Where can I find NOVA's legal and privacy documents?",
      ],
    },
  },
];

/** Removes query, hash and trailing slash. */
export function normalisePath(path: string): string {
  const only = (path.split(/[?#]/, 1)[0] ?? "/").replace(/\/+$/, "");
  return only || "/";
}

export function topicForPath(path: string): AssistantTopic {
  const p = normalisePath(path);
  return topics.find((entry) => entry.match(p))?.topic ?? generic;
}
