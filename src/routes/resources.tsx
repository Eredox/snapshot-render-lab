import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

const typeMeta: Record<string, { label: string; path: string }> = {
  "Guide": { label: "Guides", path: "/resources/guides" },
  "Product update": { label: "Product updates", path: "/resources/product-updates" },
  "Explainer": { label: "Explainers", path: "/resources/case-studies" },
};

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
  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Learn and reference"
        description="Practical content about compliance programmes, frameworks, evidence management and responsible assurance."
        breadcrumbs={[{ label: "Resources", to: "/resources" }]}
      />

      <Section>
        <SectionHeading title="Browse by topic" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.entries(typeMeta).map(([type, meta]) => (
            <Card key={type} interactive>
              <h2 className="text-lg font-semibold">{meta.label}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {resources.filter((r) => r.type === type).length} item{resources.filter((r) => r.type === type).length === 1 ? "" : "s"}
              </p>
              <Link to={meta.path as any} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Browse <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
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
        <SectionHeading title="Latest resources" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.slice(0, 6).map((r) => (
            <Card key={r.slug} interactive>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{r.type}</p>
              <h3 className="mt-2 font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.summary}</p>
              <Link to={`${typeMeta[r.type as keyof typeof typeMeta].path}/${r.slug}` as any} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
