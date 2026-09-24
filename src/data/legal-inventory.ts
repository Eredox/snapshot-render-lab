export type LegalInventoryEntry = {
  documentName: string;
  sourceLocation: string;
  version: string | null;
  approvalStatus: string;
  operativeContentAvailable: boolean;
  publicRoute: string | null;
  publiclyVisible: boolean;
};

/** Reconciled legal estate; incomplete entries are deliberately not public routes. */
export const legalInventory: LegalInventoryEntry[] = [
  {
    documentName: "NOVA Global Master SaaS Terms and Conditions",
    sourceLocation:
      "src/data/legal-published.ts (promoted from application frontend/src/content/legal/global/terms.ts)",
    version: "1.1",
    approvalStatus: "Founder-approved; published_current",
    operativeContentAvailable: true,
    publicRoute: "/legal/terms",
    publiclyVisible: true,
  },
  {
    documentName: "NOVA Global Privacy Policy",
    sourceLocation:
      "src/data/legal-published.ts (promoted from application frontend/src/content/legal/global/privacy.ts)",
    version: "1.1",
    approvalStatus: "Founder-approved; published_current",
    operativeContentAvailable: true,
    publicRoute: "/legal/privacy",
    publiclyVisible: true,
  },
  {
    documentName: "Cookie and Similar Technologies Policy",
    sourceLocation:
      "src/data/legal.ts, informed by application docs/legal/NOVA_COOKIE_AND_STORAGE_TECHNOLOGY_INVENTORY.md",
    version: "1.0",
    approvalStatus: "Published public-site policy",
    operativeContentAvailable: true,
    publicRoute: "/legal/cookies",
    publiclyVisible: true,
  },
  {
    documentName: "Accessibility Statement",
    sourceLocation: "src/data/legal.ts and verified public-site implementation",
    version: "1.0",
    approvalStatus: "Published public-site statement; WCAG 2.2 AA stated as an aim only",
    operativeContentAvailable: true,
    publicRoute: "/legal/accessibility",
    publiclyVisible: true,
  },
  {
    documentName: "Data Processing Addendum",
    sourceLocation:
      "Application frontend/src/content/legal/documentTypes.ts; no operative content file found",
    version: null,
    approvalStatus: "Approved content pending; scaffold only",
    operativeContentAvailable: false,
    publicRoute: "/legal/dpa",
    publiclyVisible: false,
  },
  {
    documentName: "Acceptable Use Policy",
    sourceLocation:
      "Application frontend/src/content/legal/documentTypes.ts; no operative content file found",
    version: null,
    approvalStatus: "Not created; no operative content found",
    operativeContentAvailable: false,
    publicRoute: null,
    publiclyVisible: false,
  },
  {
    documentName: "Service Level Agreement",
    sourceLocation:
      "Application frontend/src/content/legal/documentTypes.ts; no operative content file found",
    version: null,
    approvalStatus: "Not created; no operative content found",
    operativeContentAvailable: false,
    publicRoute: null,
    publiclyVisible: false,
  },
  {
    documentName: "Security and Shared Responsibility Schedule",
    sourceLocation:
      "Application frontend/src/content/legal/documentTypes.ts; no operative content file found",
    version: null,
    approvalStatus: "Not created; no operative content found",
    operativeContentAvailable: false,
    publicRoute: null,
    publiclyVisible: false,
  },
  {
    documentName: "AI Features Addendum",
    sourceLocation:
      "Application frontend/src/content/legal/documentTypes.ts; public repository scaffold src/data/legal.ts",
    version: null,
    approvalStatus: "Approved content pending; scaffold only",
    operativeContentAvailable: false,
    publicRoute: "/legal/ai-features",
    publiclyVisible: false,
  },
  {
    documentName: "Subprocessors",
    sourceLocation:
      "Application docs/legal/NOVA_SUBPROCESSOR_REGISTER.md; no approved public schedule",
    version: null,
    approvalStatus: "Approved content pending; internal register only",
    operativeContentAvailable: false,
    publicRoute: "/legal/subprocessors",
    publiclyVisible: false,
  },
  {
    documentName: "Regional/country privacy addenda",
    sourceLocation:
      "Application frontend/src/content/legal/documentTypes.ts; no regional content files found",
    version: null,
    approvalStatus: "Not created; no operative content found",
    operativeContentAvailable: false,
    publicRoute: null,
    publiclyVisible: false,
  },
];
