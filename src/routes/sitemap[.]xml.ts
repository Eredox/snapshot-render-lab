import { createFileRoute } from "@tanstack/react-router";
import { staticRoutes, dynamicRoutes } from "@/config/navigation";
import { publishedByType, publishedResources, resourcePath, typeRoutes } from "@/data/resources";
import { testimonials } from "@/data/testimonials";
import { publishedLegalRegistry } from "@/data/legal-registry";
import { siteUrl } from "@/config/site";

/** Resource detail URLs are emitted only for published items, from one place. */
export function sitemapUrls(): { loc: string; lastmod?: string }[] {
  const resourceSections = Object.values(typeRoutes);
  const isResourceDetail = (path: string) =>
    resourceSections.some((base) => path.startsWith(`${base}/`));

  /**
   * Empty sections and non-content pages are noindex, so they stay out of the sitemap. Sections
   * join the sitemap automatically (and lose their noindex) as soon as real content is published.
   */
  const excluded = new Set<string>([
    "/book-demo/confirmed",
    // No live status feed is connected; the page says so and is noindex.
    "/status",
    ...(testimonials.length === 0 ? ["/testimonials"] : []),
    ...(publishedByType("Product update").length === 0 ? ["/resources/product-updates"] : []),
    ...(publishedByType("Case study").length === 0 ? ["/resources/case-studies"] : []),
    ...(publishedByType("Webinar").length === 0 ? ["/resources/webinars"] : []),
  ]);
  const excludedDynamicPrefixes = ["/legal"];

  const staticUrls = staticRoutes
    .filter((r) => !excluded.has(r) && !r.startsWith("/legal/"))
    .map((r) => ({ loc: r }));

  const dynamicUrls = dynamicRoutes
    .flatMap((d) => d.slugs.map((s) => `${d.pattern.replace("/$slug", "")}/${s}`))
    .filter((path) => !isResourceDetail(path))
    .filter(
      (path) =>
        !excludedDynamicPrefixes.some((prefix) => path === prefix || path.startsWith(`${prefix}/`)),
    )
    .map((loc) => ({ loc }));

  const resourceUrls = publishedResources.map((r) => ({
    loc: resourcePath(r),
    ...(r.modified || r.published ? { lastmod: r.modified ?? r.published } : {}),
  }));

  const publishedLegalUrls = publishedLegalRegistry.map((document) => ({
    loc: document.route,
  }));

  const seen = new Set<string>();
  return [...staticUrls, ...publishedLegalUrls, ...dynamicUrls, ...resourceUrls].filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls()
  .map(
    (u) =>
      `  <url><loc>${siteUrl}${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ""}</url>`,
  )
  .join("\n")}
</urlset>
`;
        return new Response(body, {
          headers: { "content-type": "application/xml; charset=utf-8" },
        });
      },
    },
  },
});
