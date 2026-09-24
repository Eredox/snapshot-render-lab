export type LegalDoc = {
  slug: string;
  title: string;
  navLabel: string;
  summary: string;
  status: "Published" | "Approved content pending";
  lastReviewed?: string;
  /** Clearly labelled locations where approved operative content is to be placed. */
  sections: { heading: string; description: string; body?: string[] }[];
};

export const legalPendingNote =
  "The operative wording of this document is prepared and approved by Eredox. The structure below marks where that approved content is published. No clause is drafted or implied here.";

export const legalDocs: LegalDoc[] = [
  {
    slug: "cookies",
    title: "Cookie Policy",
    navLabel: "Cookies",
    summary: "The cookies this website uses and how to control them.",
    status: "Published",
    lastReviewed: "2026-08-20",
    sections: [
      {
        heading: "Categories used on this website",
        description: "What each category does and whether it operates before consent.",
        body: [
          "Necessary cookies and equivalent local storage are required for the website to function, including remembering your cookie choice itself. These operate without consent because the site cannot work without them.",
          "Analytics cookies would help us understand how the site is used. No analytics provider is configured on this website at present, so none are set.",
          "Marketing cookies would support campaign measurement. No marketing provider is configured on this website at present, so none are set.",
        ],
      },
      {
        heading: "Consent behaviour",
        description: "What happens when you make a choice.",
        body: [
          "Non-essential categories remain switched off until you enable them. Your choice is stored locally in your browser so the banner does not reappear on every page.",
          "You can change or withdraw your choice at any time using the Cookie preferences link in the footer.",
        ],
      },
      {
        heading: "Third-party providers",
        description: "Providers that would set cookies once configured.",
        body: [
          "Where a provider is introduced in future, it will be listed on the subprocessors page and reflected in the categories above before it is enabled.",
        ],
      },
    ],
  },
  {
    slug: "dpa",
    title: "Data Processing Addendum",
    navLabel: "DPA",
    summary:
      "Processing terms applying where Eredox processes personal data on a customer's behalf.",
    status: "Approved content pending",
    sections: [
      {
        heading: "Roles of the parties",
        description: "Identification of controller and processor roles.",
      },
      {
        heading: "Scope and duration of processing",
        description: "Subject matter, nature, purpose and duration of processing.",
      },
      {
        heading: "Categories of data and data subjects",
        description: "Types of personal data and categories of individuals.",
      },
      {
        heading: "Processor obligations",
        description: "Obligations relating to instructions, confidentiality and security.",
      },
      {
        heading: "Subprocessing",
        description: "Authorisation, notification and flow-down obligations for subprocessors.",
      },
      {
        heading: "International transfers",
        description: "Mechanisms relied upon for cross-border transfers.",
      },
      {
        heading: "Assistance and audit",
        description: "Assistance with data subject rights, impact assessments and audit rights.",
      },
      {
        heading: "Breach notification",
        description: "Notification obligations following a personal data breach.",
      },
      {
        heading: "Return and deletion",
        description: "Treatment of personal data at the end of the engagement.",
      },
    ],
  },
  {
    slug: "ai-features",
    title: "AI Features Addendum",
    navLabel: "AI Features Addendum",
    summary: "Terms specific to the use of AI-assisted capability within NOVA.",
    status: "Approved content pending",
    sections: [
      {
        heading: "Scope of AI features",
        description: "Which capabilities are AI-assisted and how they are made available.",
      },
      {
        heading: "Inputs and grounding",
        description: "What workspace content the assistant may use as input.",
      },
      {
        heading: "Output status",
        description:
          "Confirmation that output is a draft for human review, not an approval or determination.",
      },
      {
        heading: "Human approval requirements",
        description:
          "Actions that must be performed by a person, including approval, acceptance and readiness declarations.",
      },
      {
        heading: "Limitations",
        description:
          "Known limitations of AI-assisted output and the customer's review responsibility.",
      },
      {
        heading: "Data handling for AI processing",
        description: "How workspace content is handled when AI features are used.",
      },
      {
        heading: "Accountability",
        description:
          "Allocation of responsibility for decisions taken on the basis of AI-assisted output.",
      },
    ],
  },
  {
    slug: "accessibility",
    title: "Accessibility Statement",
    navLabel: "Accessibility",
    summary: "Our approach to making this website usable for everyone.",
    status: "Published",
    lastReviewed: "2026-08-20",
    sections: [
      {
        heading: "Our approach",
        description: "What we aim for on this website.",
        body: [
          "This website is built to be operable with a keyboard alone, readable at increased text sizes, and usable with assistive technology. Colour is not used as the only way to convey meaning, and interactive controls are sized for touch.",
          "We aim to meet the Web Content Accessibility Guidelines at level AA. We describe this as an aim rather than a certification, because no independent conformance assessment of this website has been performed.",
        ],
      },
      {
        heading: "Specific measures in place",
        description: "Practices applied throughout the site.",
        body: [
          "A skip-to-content link is provided on every page, headings follow a single logical hierarchy, and every page has one H1.",
          "Navigation menus can be operated with the keyboard and closed with the Escape key. Focus is visible on all interactive elements.",
          "Animation respects the reduced-motion preference; where a visual is animated, a static composition is shown instead when that preference is set.",
          "Images and decorative illustrations carry appropriate alternative text or are hidden from assistive technology where they add no information.",
        ],
      },
      {
        heading: "Known limitations",
        description: "Where we know improvement is needed.",
        body: [
          "Complex comparison tables require horizontal scrolling on small screens.",
          "Documents linked from this site are subject to the accessibility of the source format.",
        ],
      },
      {
        heading: "Feedback",
        description: "How to tell us about a barrier.",
        body: [
          "If you encounter an accessibility barrier on this website, contact us through the contact page and describe the page and the difficulty. We treat accessibility reports as defects.",
        ],
      },
    ],
  },
  {
    slug: "subprocessors",
    title: "Subprocessors",
    navLabel: "Subprocessors",
    summary: "Third parties engaged by Eredox to process customer data.",
    status: "Approved content pending",
    sections: [
      {
        heading: "Current subprocessors",
        description:
          "The published list of engaged subprocessors, their purpose and processing location.",
      },
      {
        heading: "Notification of changes",
        description: "How customers are notified before a new subprocessor is engaged.",
      },
      {
        heading: "Objection process",
        description: "How a customer may raise an objection to a proposed subprocessor.",
      },
    ],
  },
];

/** No subprocessor list has been approved for publication yet. */
export const subprocessors: Array<{ name: string; purpose: string; location: string }> = [];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
