import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { byType, resourcePath } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/guides/")({
  head: () => ({
    ...pageMeta({
      title: "Guides — NOVA Compliance",
      description:
        "Step-by-step guides for framework setup, evidence collection, control ownership and readiness reporting in NOVA Compliance.",
      path: "/resources/guides",
    }),
    scripts: [
      ldScript(
        breadcrumbSchema([
          { label: "Resources", to: "/resources" },
          { label: "Guides", to: "/resources/guides" },
        ]),
      ),
    ],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  const guides = byType("Guide");
  const published = guides.filter((g) => g.status === "Published");
  const upcoming = guides.filter((g) => g.status === "Coming soon");

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Guides"
        description="Practical guides for setting up your compliance programme in NOVA and keeping it current."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Guides", to: "/resources/guides" },
        ]}
      />

      <Section>
        {published.length === 0 ? (
          <Card>
            <p className="text-muted-foreground">
              No guides have been published yet. Contact Eredox for a NOVA compliance workflow demonstration.
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((guide) => (
              <Card key={guide.slug} interactive>
                <div className="flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                  {guide.published ? <time dateTime={guide.published}>{guide.published}</time> : null}
                  {guide.readingTime ? <span>{guide.readingTime}</span> : null}
                </div>
                <h2 className="mt-2 text-lg font-semibold">{guide.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{guide.summary}</p>
                <Link
                  to={resourcePath(guide) as any}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read guide <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        )}

        {upcoming.length ? (
          <div className="mt-10">
            <h2 className="text-lg font-semibold">In preparation</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((guide) => (
                <li key={guide.slug} className="rounded-lg border border-border bg-surface p-4">
                  <p className="text-sm font-medium">{guide.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{guide.summary}</p>
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
