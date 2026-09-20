import { site } from "@/config/site";

/**
 * SEO helpers.
 *
 * Rules enforced here:
 * - the page title is emitted as a meta entry, never a top-level `title`
 * - canonical + og:url are relative and self-referencing on leaf routes only
 * - JSON-LD is emitted through `scripts`, not inline in the body
 */

export type MetaEntry = Record<string, string>;

export function pageMeta(opts: { title: string; description: string; path: string }) {
  const { title, description, path } = opts;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: path },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ] as MetaEntry[],
    links: [{ rel: "canonical", href: path }],
  };
}

export function ldScript(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}

export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}

export function breadcrumbSchema(items: { label: string; to: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.to,
    })),
  };
}

export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: site.productName,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: site.tagline,
    publisher: { "@type": "Organization", name: site.company },
  };
}

import { siteUrl } from "@/config/site";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path: string): string {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Page meta with absolute canonical/og:url, for indexable article pages. */
export function articleMeta(opts: { title: string; description: string; path: string }) {
  const url = absoluteUrl(opts.path);
  return {
    meta: [
      { title: opts.title },
      { name: "description", content: opts.description },
      { property: "og:title", content: opts.title },
      { property: "og:description", content: opts.description },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: opts.title },
      { name: "twitter:description", content: opts.description },
    ] as MetaEntry[],
    links: [{ rel: "canonical", href: url }],
  };
}

export function blogPostingSchema(opts: {
  title: string;
  description: string;
  path: string;
  published?: string;
  modified?: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.description,
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(opts.path) },
    url: absoluteUrl(opts.path),
    ...(opts.published && { datePublished: opts.published }),
    ...(opts.modified && { dateModified: opts.modified }),
    ...(opts.section && { articleSection: opts.section }),
    author: { "@type": "Organization", name: site.company },
    publisher: { "@type": "Organization", name: site.company },
  };
}
