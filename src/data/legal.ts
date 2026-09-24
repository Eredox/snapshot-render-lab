export type LegalDoc = {
  slug: string;
  title: string;
  navLabel: string;
  summary: string;
  status: "Published" | "Approved content pending";
  version?: string;
  effectiveDate?: string;
  lastReviewed?: string;
  sections: { heading: string; description: string; body?: string[] }[];
};

export const legalPendingNote =
  "This document is not currently published. Its operative content is not available in the public Legal Centre.";

export const legalDocs: LegalDoc[] = [
  {
    slug: "cookies",
    title: "Cookie and Similar Technologies Policy",
    navLabel: "Cookies",
    summary: "How the public website and NOVA application use cookies and similar technologies.",
    status: "Published",
    version: "1.0",
    effectiveDate: "2026-09-24",
    lastReviewed: "2026-09-24",
    sections: [
      {
        heading: "Purpose and scope",
        description:
          "This policy explains the technologies verified in the NOVA public website and application repositories.",
        body: [
          "This Cookie and Similar Technologies Policy explains how Eredox Pty Ltd uses cookies and similar browser technologies on the NOVA public marketing website at www.nova.eredox.com and in the separate authenticated NOVA application at nova.eredox.com.",
          "The surfaces are described separately because the public website does not provide authenticated application access. This policy records current verified behaviour; it is not a promise that a future provider or feature will be introduced.",
        ],
      },
      {
        heading: "Cookies and similar technologies",
        description: "The terms used in this policy.",
        body: [
          "A cookie is a small value stored by a website in a browser and sent back with later requests. Similar technologies include browser local storage, session storage, pixels, scripts and other client-side mechanisms that remember a choice or recognise a browser.",
          "The public website currently uses browser local storage for its consent record. Repository inspection found no public-site session storage, tracking pixel, analytics tag, marketing tag or embedded third-party application.",
        ],
      },
      {
        heading: "Verified public website technologies",
        description: "Current customer-facing technologies on www.nova.eredox.com.",
        body: [
          "Technology: localStorage key nova-cookie-consent-v1. Domain/surface: the NOVA public website. Type: first-party browser local storage. Purpose: stores the necessary flag, analytics and marketing choices, and the decision timestamp so the consent banner does not reappear on every page. Provider: Eredox/NOVA website code. Duration: no fixed expiry is configured; it remains until the browser, user or browser privacy controls remove it. Consent required: the storage is used to record the consent choice; it does not load any non-essential provider. Current status: implemented.",
          "No first-party cookie is set by the public website consent component. No public-site sessionStorage key was found. The public site has no authenticated session and does not store an access or refresh token in browser storage.",
        ],
      },
      {
        heading: "Strictly necessary, authentication and session technologies",
        description: "Technologies required for the public site or application to work.",
        body: [
          "On the public website, the consent record is the only verified browser storage used by the cookie-consent experience. The site does not require an authentication cookie to display its public pages.",
          "In the authenticated NOVA application, the repository verifies two first-party cookies: nova_session, an HttpOnly server-side session reference, and nova_csrf, a readable CSRF value for protecting state-changing cookie-authenticated requests. Both have an eight-hour default maximum age in the application configuration and are deleted on logout. They are application technologies, not public marketing-site technologies.",
          "The application also uses localStorage for tenant-scoped onboarding handoff notes and user-scoped getting-started progress, and sessionStorage for the sidebar-collapse preference and trial-banner dismissal. These are interface/workflow preferences, not authentication tokens, and the repository does not configure a fixed expiry for the localStorage values; sessionStorage is cleared by the browser at the end of its session.",
          "The application has separate portal session and CSRF cookies for the dedicated portal boundary, each configured with an eight-hour default maximum age. Its external policy-review workflow uses the first-party nova_policy_ext cookie with an eight-hour maximum and an expiry no later than the invitation expiry. These are not set by the public website.",
        ],
      },
      {
        heading: "Functional technologies",
        description:
          "Non-essential technologies that remember preferences or provide optional features.",
        body: [
          "No separate functional cookie or preference storage for theme, language or similar site settings was found on the public website. The consent record is used only for consent state.",
        ],
      },
      {
        heading: "Analytics technologies",
        description: "Current measurement status.",
        body: [
          "No analytics provider is configured or loaded on the public website. Repository inspection found no Google Analytics, PostHog, Mixpanel, Amplitude or equivalent integration. Selecting Analytics in the preference panel therefore does not currently load an analytics technology.",
        ],
      },
      {
        heading: "Marketing technologies",
        description: "Current campaign and advertising status.",
        body: [
          "No marketing provider, advertising pixel, retargeting tag or consent-management platform is configured or loaded on the public website. Selecting Marketing therefore does not currently load a marketing technology.",
        ],
      },
      {
        heading: "Consent behaviour and preference storage",
        description: "How the public-site consent banner works.",
        body: [
          "The public website presents a consent banner when no consent record is present. Necessary is always active. A visitor can reject non-essential categories, accept all categories, or open Manage preferences and save separate Analytics and Marketing choices.",
          "The current implementation stores the choices in localStorage under nova-cookie-consent-v1 together with a decidedAt timestamp. Because no non-essential providers are configured, no analytics or marketing technology is loaded before or after a choice. Consent to the banner is separate from acceptance of the NOVA Terms and acknowledgement of the Privacy Policy.",
          "Preferences can be changed or withdrawn at any time using the Cookie preferences control in the public-site footer. If storage is unavailable, the site continues without saving the preference record and the banner may appear again.",
        ],
      },
      {
        heading: "Browser controls",
        description: "Additional controls available to visitors.",
        body: [
          "Visitors can block, delete or restrict cookies and local storage through their browser privacy settings. Clearing site data will remove the public-site consent record and may cause the consent banner to appear again. Browser controls may also affect site functionality.",
        ],
      },
      {
        heading: "Third-party technologies",
        description: "External resources and embedded services verified in the public site.",
        body: [
          "The public website loads the Roboto font stylesheet from Google Fonts domains through a stylesheet and preconnect links. This is an external resource request, not an analytics or marketing provider configured by NOVA; this policy does not assert what cookies, if any, a visitor's browser or that provider may apply outside the NOVA website.",
          "No third-party embedded forms, video players, social widgets, CRM submission endpoint, analytics provider or marketing provider is configured. Public forms validate in the browser and show a configuration notice while the form endpoint is unset. The Sign in link opens the separate NOVA application; it is not an embedded application session on the public site.",
        ],
      },
      {
        heading: "Retention",
        description: "Retention periods that can be verified from the repositories.",
        body: [
          "The public-site consent localStorage record has no configured expiry and remains until removed by the visitor, browser settings or storage failure. No analytics or marketing retention period exists because those providers are not configured.",
          "The authenticated application session cookies have an eight-hour default maximum age in the application configuration. The application stores the opaque session record server-side in Redis and removes the cookies on logout. Other application or workflow retention is governed by the application and its Privacy Policy; it is not a public-site cookie duration.",
        ],
      },
      {
        heading: "Future providers and changes",
        description: "How a future technology would be handled.",
        body: [
          "If Eredox introduces an analytics, marketing, functional or other non-essential provider, the provider and purpose will be reviewed before enablement, the consent experience and this policy will be updated where required, and the provider will not be described here as current before it is actually configured.",
        ],
      },
      {
        heading: "Relationship with the Privacy Policy",
        description: "How this policy fits with the broader privacy notice.",
        body: [
          "This policy describes browser technologies. The Privacy Policy explains the broader processing of personal information by Eredox in connection with the public website and authenticated NOVA application. If the documents address the same subject, they should be read together.",
        ],
      },
      {
        heading: "Contact, effective date and version",
        description: "Policy administration details.",
        body: [
          "Questions or concerns about this policy can be raised through the public website Contact page. Version 1.0 is effective from 24 September 2026 and was last reviewed on 24 September 2026.",
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
    summary: "Our current approach to making the public website usable for everyone.",
    status: "Published",
    version: "1.0",
    effectiveDate: "2026-09-24",
    lastReviewed: "2026-09-24",
    sections: [
      {
        heading: "Our commitment and scope",
        description: "Eredox's commitment to the NOVA public website.",
        body: [
          "Eredox Pty Ltd is committed to improving the accessibility and usability of the NOVA public marketing website. This statement covers the customer-facing pages served from www.nova.eredox.com, including the public navigation, forms, Legal Centre and content linked from those pages.",
          "We aim to support WCAG 2.2 Level AA through the existing design and implementation approach. This is an aim, not a certification or a claim of verified full conformance; no independent conformance assessment has been completed.",
        ],
      },
      {
        heading: "Keyboard navigation, skip navigation and focus",
        description: "Keyboard and focus practices present in the public site.",
        body: [
          "The site provides a Skip to main content link on every page. Navigation controls are native links and buttons, the desktop menus can be opened with keyboard controls, and menus close when Escape is pressed. The mobile menu and expandable sections expose their state through aria-expanded and related attributes.",
          "Global focus-visible styling provides a visible outline, and public interactive controls use keyboard-focusable native elements. A manual keyboard pass remains part of ongoing improvement rather than evidence of formal conformance.",
        ],
      },
      {
        heading: "Structure and semantics",
        description: "How content structure supports assistive technology.",
        body: [
          "The public site uses semantic header, main, nav, footer, section, article, heading, list, form, label and button elements where appropriate. Page templates provide a logical heading structure with a page-level H1 and section headings, and navigation landmarks carry accessible labels.",
        ],
      },
      {
        heading: "Alternative text",
        description: "How meaningful and decorative visuals are handled.",
        body: [
          "Meaningful homepage audience photography and interface imagery use descriptive alternative text. Decorative icons and illustrations are marked as hidden from assistive technology where their meaning is already conveyed by nearby text or they add no information. This remains subject to review as new content is added.",
        ],
      },
      {
        heading: "Responsive layout, reflow and text resizing",
        description: "Behaviour across viewport sizes and browser zoom.",
        body: [
          "The public site uses responsive layouts, stacked mobile cards and reflowing content at the configured breakpoints. Main content avoids requiring a fixed desktop viewport, and the legal documents preserve readable line lengths while allowing long sections to reflow. Visitors can use browser text resizing or zoom; there is no separate text-size control.",
        ],
      },
      {
        heading: "Colour and non-colour cues",
        description: "How information is communicated.",
        body: [
          "The design does not rely on colour alone for primary navigation, headings, links, status labels or calls to action; text, structure, icons or controls provide additional cues. Colour contrast and component combinations remain subject to ongoing review and have not been independently certified.",
        ],
      },
      {
        heading: "Forms and labels",
        description: "Public form implementation practices.",
        body: [
          "Public contact and booking forms use visible labels, native inputs and buttons, keyboard-focusable controls and validation messaging. Form delivery is not currently connected to a CRM or external submission provider in this repository; visitors are shown a configuration notice when a delivery endpoint is unavailable.",
        ],
      },
      {
        heading: "Reduced motion and touch targets",
        description: "Motion and pointer interaction considerations.",
        body: [
          "The stylesheet includes a prefers-reduced-motion rule that removes or shortens non-essential transitions and animation for visitors who request reduced motion. Header, menu and primary action controls use touch-sized targets, including a minimum 44-pixel class where applied.",
        ],
      },
      {
        heading: "Downloads, external and third-party content",
        description: "Content outside the public site's direct control.",
        body: [
          "The public site does not claim accessibility conformance for external sites, the separate authenticated NOVA application, the Google Fonts resource, or any future third-party content. Any downloadable or linked material should be assessed for accessibility in its source format; the Legal Centre currently presents HTML documents on the public site.",
        ],
      },
      {
        heading: "Known limitations and testing approach",
        description: "What has and has not been verified.",
        body: [
          "Complex comparison tables may require horizontal scrolling on small screens. Some third-party or externally linked content is outside the public site's control. No independent WCAG audit or formal conformance statement has been completed.",
          "The implementation is checked through source review, TypeScript checks, targeted and full automated tests, production builds, responsive review and keyboard-oriented checks during development. These checks do not replace testing with assistive technologies or an independent accessibility assessment.",
        ],
      },
      {
        heading: "Feedback and ongoing improvement",
        description: "How to report an accessibility barrier.",
        body: [
          "If you encounter an accessibility barrier, contact Eredox through the public website Contact page and describe the page, the task you were trying to complete, and the assistive technology or browser involved if known. We use reports to prioritise corrections and ongoing accessibility improvements.",
          "Version 1.0 is effective from 24 September 2026 and was last reviewed on 24 September 2026.",
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

export const publicLegalDocs = legalDocs.filter((doc) => doc.status === "Published");

export const subprocessors: Array<{ name: string; purpose: string; location: string }> = [];

export function getLegalDoc(slug: string): LegalDoc | undefined {
  return legalDocs.find((d) => d.slug === slug);
}
