import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources, resourceTypes } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources")({
  head: () => ({
    ...pageMeta({
      title: "Resources — NOVA Compliance",
      description: "Articles, guides, case studies, webinars, FAQs and documentation to help you run a governed compliance programme.",
      path: "/resources",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Resources", to: "/resources" }]))],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const byType = (type: string) => resources.filter((r) => r.type === type);

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Learn and reference"
        description="Practical content about compliance programmes, frameworks, evidence management and responsible assurance."
        breadcrumbs={[{ label: "Resources", to: "/resources" }]}
      />

      <Section>
        <SectionHeading title="Browse by topic" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resourceTypes.map((type) => (
            <Card key={type.slug} interactive>
              <h2 className="text-lg font-semibold">{type.label}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{type.description}</p>
              <Link to={type.path} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Browse <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Latest resources" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.slice(0, 6).map((r) => (
            <Card key={r.slug} interactive>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.type}</p>
              <h3 className="mt-2 font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.summary}</p>
              <Link to={`/resources/${resourceTypes.find((t) => t.slug === r.type)?.path.replace("/resources/", "")}/${r.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
