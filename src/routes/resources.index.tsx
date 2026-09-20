import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { publishedResources, publishedByType, typeRoutes, typeLabels, resourcePath } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

/** Sections shown in the library. Case studies and webinars stay out until genuine content exists. */
const sections = [
  { type: "Blog article" as const, description: "Explanatory and practical articles" },
  { type: "Guide" as const, description: "Step-by-step, hands-on material" },
  { type: "Product update" as const, description: "Approved release information" },
];

export const Route = createFileRoute("/resources/")({
  head: () => ({
    ...pageMeta({
      title: "Resources — NOVA Compliance",
      description:
        "Blog articles, guides, product updates and FAQs to help you run a governed, evidence-led compliance programme with NOVA.",
      path: "/resources",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Resources", to: "/resources" }]))],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Learn and reference"
        description="Practical content about compliance programmes, frameworks, evidence management and responsible assurance."
        breadcrumbs={[{ label: "Resources", to: "/resources" }]}
      />

      <Section>
        <SectionHeading title="Browse by type" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((section) => {
            const count = publishedByType(section.type).length;
            return (
              <Card key={section.type} interactive>
                <h2 className="text-lg font-semibold">{typeLabels[section.type]}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{section.description}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {count} published item{count === 1 ? "" : "s"}
                </p>
                <Link
                  to={typeRoutes[section.type] as any}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Browse <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            );
          })}
          <Card interactive>
            <h2 className="text-lg font-semibold">FAQ</h2>
            <p className="mt-2 text-sm text-muted-foreground">Common questions about NOVA.</p>
            <Link to="/resources/faq" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Browse <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Latest published" />
        {publishedResources.length === 0 ? (
          <Card className="mt-8">
            <p className="text-muted-foreground">
              Resources are being prepared. Contact Eredox for a NOVA compliance workflow demonstration.
            </p>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {publishedResources.slice(0, 6).map((r) => (
              <Card key={r.slug} interactive>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {typeLabels[r.type]}
                </p>
                <h3 className="mt-2 font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.summary}</p>
                <Link
                  to={resourcePath(r) as any}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <ConversionCta />
    </main>
  );
}
