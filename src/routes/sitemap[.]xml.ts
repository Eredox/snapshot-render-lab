import { createFileRoute } from "@tanstack/react-router";
import { staticRoutes, dynamicRoutes } from "@/config/navigation";
import { publishedResources, resourcePath, typeRoutes } from "@/data/resources";
import { legalDocs } from "@/data/legal";
import { siteUrl } from "@/config/site";

/** Resource detail URLs are emitted only for published items, from one place. */
function sitemapUrls(): { loc: string; lastmod?: string }[] {
  const resourceSections = Object.values(typeRoutes);
  const isResourceDetail = (path: string) =>
    resourceSections.some((base) => path.startsWith(`${base}/`));

  /** Empty sections are noindex, so they stay out of the sitemap. */
  const excluded = new Set<string>([
    "/404",
    "/book-demo/confirmed",
    "/resources/case-studies",
    "/resources/webinars",
  ]);
  const excludedDynamicPrefixes = [
    "/plans",
    ...legalDocs
      .filter((doc) => doc.status === "Approved content pending")
      .map((doc) => `/legal/${doc.slug}`),
  ];

  const staticUrls = staticRoutes.filter((r) => !excluded.has(r)).map((r) => ({ loc: r }));

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

  const seen = new Set<string>();
  return [...staticUrls, ...dynamicUrls, ...resourceUrls].filter((u) => {
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
