import { features } from "@/data/features";
import { frameworks } from "@/data/frameworks";
import { solutions } from "@/data/solutions";
import { legalDocs } from "@/data/legal";
import { resources } from "@/data/resources";
import { appUrls } from "@/config/site";

/**
 * Central route and navigation registry.
 *
 * Every internal link rendered anywhere on the site must come from here (or
 * from the data files this file reads), so the menus and the router cannot
 * drift apart. `src/routes/__tests__/route-integrity.test.ts` validates that
 * each entry resolves to a registered route or a configured dynamic entry.
 */

export type NavItem = {
  label: string;
  /** Internal path beginning with "/" or an absolute external URL. */
  to: string;
  external?: boolean;
  description?: string;
  badge?: string;
};

export type NavGroup = { label: string; items: NavItem[] };

/** Static routes that exist as files under src/routes. */
export const staticRoutes = [
  "/",
  "/platform",
  "/features",
  "/integrations",
  "/pricing",
  "/security",
  "/responsible-ai",
  "/trust",
  "/about",
  "/support",
  "/contact",
  "/book-demo",
  "/start",
  "/status",
  "/404",
  "/frameworks",
  "/solutions",
  "/resources",
  "/resources/faq",
  "/resources/guides",
  "/resources/product-updates",
  "/legal",
] as const;

/** Dynamic route templates and the slugs configured for each. */
export const dynamicRoutes: { pattern: string; slugs: string[] }[] = [
  { pattern: "/features/$slug", slugs: features.map((f) => f.slug) },
  { pattern: "/frameworks/$slug", slugs: frameworks.map((f) => f.slug) },
  { pattern: "/solutions/$slug", slugs: solutions.map((s) => s.slug) },
  { pattern: "/resources/$slug", slugs: resources.map((r) => r.slug) },
  { pattern: "/legal/$slug", slugs: legalDocs.map((d) => d.slug) },
];

/** Every internal path the site can legitimately resolve. */
export const allRoutes: string[] = [
  ...staticRoutes,
  ...dynamicRoutes.flatMap((d) => d.slugs.map((s) => `${d.pattern.replace("/$slug", "")}/${s}`)),
];

export const platformMenu: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { label: "Platform overview", to: "/platform", description: "How the parts connect" },
      { label: "All features", to: "/features", description: "Every capability in one list" },
      { label: "Integrations", to: "/integrations", description: "Connectors and their status" },
    ],
  },
  {
    label: "Capabilities",
    items: features.map((f) => ({
      label: f.navLabel,
      to: f.path,
      description: f.summary.split(",")[0],
      badge: f.availability === "Available now" ? undefined : f.availability,
    })),
  },
];

export const frameworksMenu: NavItem[] = [
  { label: "All frameworks", to: "/frameworks", description: "Coverage, filters and availability" },
  ...frameworks.map((f) => ({
    label: f.name,
    to: `/frameworks/${f.slug}`,
    description: f.jurisdictions.join(" · "),
    badge: f.availability === "Planned" ? "Planned" : undefined,
  })),
];

export const solutionsMenu: NavItem[] = [
  { label: "All solutions", to: "/solutions", description: "By organisation and by role" },
  ...solutions.map((s) => ({ label: s.navLabel, to: s.path, description: s.audience })),
];

export const trustMenu: NavItem[] = [
  { label: "Security", to: "/security", description: "Practices in place today" },
  { label: "Responsible AI", to: "/responsible-ai", description: "Oversight and limitations" },
  { label: "Trust and assurance", to: "/trust", description: "How we support customer assurance" },
];

export const resourcesMenu: NavItem[] = [
  { label: "Resource library", to: "/resources", description: "Guides and explainers" },
  { label: "Guides", to: "/resources/guides", description: "Practical, hands-on material" },
  { label: "Product updates", to: "/resources/product-updates", description: "Release information" },
  { label: "FAQ", to: "/resources/faq", description: "Questions we are asked most" },
  { label: "About Eredox", to: "/about", description: "Who builds NOVA" },
  { label: "Support", to: "/support", description: "Getting help" },
  { label: "Contact", to: "/contact", description: "Talk to us" },
];

export type HeaderEntry =
  | { kind: "dropdown"; label: string; id: string; groups: NavGroup[] }
  | { kind: "link"; label: string; to: string };

export const headerNav: HeaderEntry[] = [
  { kind: "dropdown", label: "Platform", id: "platform", groups: platformMenu },
  { kind: "dropdown", label: "Frameworks", id: "frameworks", groups: [{ label: "Frameworks", items: frameworksMenu }] },
  { kind: "dropdown", label: "Solutions", id: "solutions", groups: [{ label: "Solutions", items: solutionsMenu }] },
  { kind: "dropdown", label: "Trust", id: "trust", groups: [{ label: "Trust", items: trustMenu }] },
  { kind: "dropdown", label: "Resources", id: "resources", groups: [{ label: "Resources", items: resourcesMenu }] },
  { kind: "link", label: "Pricing", to: "/pricing" },
];

/** External application destinations — rendered distinctly from internal routes. */
export const externalNav: NavItem[] = [
  { label: "Sign in", to: appUrls.app, external: true },
];

export const footerColumns: NavGroup[] = [
  {
    label: "Product",
    items: [
      { label: "Platform", to: "/platform" },
      { label: "Features", to: "/features" },
      { label: "Integrations", to: "/integrations" },
      { label: "Frameworks", to: "/frameworks" },
      { label: "Solutions", to: "/solutions" },
      { label: "Pricing", to: "/pricing" },
    ],
  },
  {
    label: "Trust",
    items: [
      { label: "Security", to: "/security" },
      { label: "Responsible AI", to: "/responsible-ai" },
      { label: "Trust and assurance", to: "/trust" },
      { label: "System status", to: "/status" },
    ],
  },
  {
    label: "Company",
    items: [
      { label: "About", to: "/about" },
      { label: "Resources", to: "/resources" },
      { label: "FAQ", to: "/resources/faq" },
      { label: "Support", to: "/support" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    label: "Legal",
    items: [
      { label: "Legal centre", to: "/legal" },
      ...legalDocs.map((d) => ({ label: d.navLabel, to: `/legal/${d.slug}` })),
    ],
  },
];

/** Every internal link in the primary navigation surfaces, for validation. */
export function collectInternalNavPaths(): string[] {
  const paths: string[] = [];
  for (const entry of headerNav) {
    if (entry.kind === "link") paths.push(entry.to);
    else for (const g of entry.groups) for (const i of g.items) paths.push(i.to);
  }
  for (const col of footerColumns) for (const i of col.items) paths.push(i.to);
  paths.push("/start", "/book-demo", "/contact", "/support", "/");
  return Array.from(new Set(paths));
}
