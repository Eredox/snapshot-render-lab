import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { byType, resourcePath } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/product-updates/")({
  head: () => ({
    ...pageMeta({
      title: "Product updates — NOVA Compliance",
      description: "Release notes and platform updates for NOVA Compliance, published once each release is approved.",
      path: "/resources/product-updates",
    }),
    scripts: [
      ldScript(
        breadcrumbSchema([
          { label: "Resources", to: "/resources" },
          { label: "Product updates", to: "/resources/product-updates" },
        ]),
      ),
    ],
  }),
  component: ProductUpdatesPage,
});

function ProductUpdatesPage() {
  const updates = byType("Product update");
  const published = updates.filter((u) => u.status === "Published");
  const upcoming = updates.filter((u) => u.status === "Coming soon");

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Product updates"
        description="Release notes and platform updates for NOVA Compliance."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Product updates", to: "/resources/product-updates" },
        ]}
      />
      <Section>
        <SectionHeading title="Updates" description="Notes are published once each release is approved for distribution." />
        {published.length === 0 ? (
          <Card className="mt-10">
            <p className="text-muted-foreground">
              No release notes have been published yet. The{" "}
              <Link to="/roadmap" className="text-primary hover:underline">
                roadmap
              </Link>{" "}
              shows what is planned.
            </p>
          </Card>
        ) : (
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {published.map((r) => (
              <Card key={r.slug} interactive>
                {r.published ? (
                  <time dateTime={r.published} className="text-xs text-muted-foreground">
                    {r.published}
                  </time>
                ) : null}
                <h2 className="mt-2 text-lg font-semibold">{r.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{r.summary}</p>
                <Link to={resourcePath(r) as any} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
                  Read update
                </Link>
              </Card>
            ))}
          </div>
        )}

        {upcoming.length ? (
          <div className="mt-10">
            <h2 className="text-lg font-semibold">In preparation</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((r) => (
                <li key={r.slug} className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.summary}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>
      <ConversionCta />
    </main>
  );
}
