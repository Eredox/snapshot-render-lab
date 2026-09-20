import { site, siteUrl } from "@/config/site";

/**
 * SEO helpers.
 *
 * Rules enforced here:
 * - the page title is emitted as a meta entry, never a top-level `title`
 * - canonical + og:url are absolute and self-referencing on leaf routes only
 * - JSON-LD is emitted through `scripts`, not inline in the body
 */

export type MetaEntry = Record<string, string>;

/** Default 1200x630 share image, served from /public. */
export const defaultShareImage = `${siteUrl}/og/nova-share.jpg`;

/** Stable schema.org node identifiers, so entities link to each other. */
export const organizationId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;
export const softwareId = `${siteUrl}/#software`;

export function pageMeta(opts: { title: string; description: string; path: string; image?: string }) {
  const { title, description, path } = opts;
  const url = absoluteUrl(path);
  const image = opts.image ?? defaultShareImage;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: url },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:image", content: image },
    ] as MetaEntry[],
    links: [{ rel: "canonical", href: url }],
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
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.label,
        item: absoluteUrl(item.to),
      })),
    ],
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId,
    name: site.company,
    url: siteUrl,
    logo: { "@type": "ImageObject", url: defaultShareImage },
    description: site.ownership,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    name: site.productName,
    url: siteUrl,
    description: site.tagline,
    inLanguage: "en-AU",
    publisher: { "@id": organizationId },
  };
}

export function softwareSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": softwareId,
    name: site.productName,
    url: siteUrl,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: site.tagline,
    image: defaultShareImage,
    isPartOf: { "@id": websiteId },
    publisher: { "@id": organizationId },
    provider: { "@id": organizationId },
  };
}

/** Product + Offer schema for the subscription plans. */
export function pricingSchema(opts: {
  currency: string;
  plans: { slug: string; name: string; summary: string; monthly: number | null; quoteOnly?: boolean }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}/pricing#product`,
    name: site.productName,
    description: site.tagline,
    url: absoluteUrl("/pricing"),
    image: defaultShareImage,
    brand: { "@id": organizationId },
    isSimilarTo: { "@id": softwareId },
    offers: opts.plans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      description: p.summary,
      url: absoluteUrl("/pricing"),
      priceCurrency: opts.currency,
      ...(p.quoteOnly || p.monthly === null
        ? { availability: "https://schema.org/InStock", priceSpecification: { "@type": "PriceSpecification", priceCurrency: opts.currency } }
        : {
            price: String(p.monthly),
            availability: "https://schema.org/InStock",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: String(p.monthly),
              priceCurrency: opts.currency,
              unitCode: "MON",
              billingIncrement: 1,
            },
          }),
      seller: { "@id": organizationId },
    })),
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
