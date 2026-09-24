import { publicLegalDocs } from "./legal";
import { publishedPrivacy, publishedTerms } from "./legal-published";

export type PublishedSiteLegalDocument = {
  slug: "terms" | "privacy" | "cookies" | "accessibility";
  title: string;
  navLabel: string;
  summary: string;
  route: string;
  version: string;
  effectiveDate: string;
};

/** One public registry for the Legal Centre, footer and sitemap. */
export const publishedLegalRegistry: PublishedSiteLegalDocument[] = [
  {
    slug: "terms",
    title: publishedTerms.metadata.title,
    navLabel: "Terms",
    summary: "NOVA Global Master SaaS Terms and Conditions for customers and authorised users.",
    route: "/legal/terms",
    version: publishedTerms.metadata.version,
    effectiveDate: publishedTerms.metadata.effective_date,
  },
  {
    slug: "privacy",
    title: publishedPrivacy.metadata.title,
    navLabel: "Privacy",
    summary: "NOVA Global Privacy Policy explaining how Eredox handles personal information.",
    route: "/legal/privacy",
    version: publishedPrivacy.metadata.version,
    effectiveDate: publishedPrivacy.metadata.effective_date,
  },
  ...publicLegalDocs.map((doc) => ({
    slug: doc.slug as "cookies" | "accessibility",
    title: doc.title,
    navLabel: doc.navLabel,
    summary: doc.summary,
    route: `/legal/${doc.slug}`,
    version: doc.version ?? "",
    effectiveDate: doc.effectiveDate ?? "",
  })),
];

export const publishedLegalRoutes = publishedLegalRegistry.map((document) => document.route);
