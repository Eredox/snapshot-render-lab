import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/industries/")({
  head: () => ({
    ...pageMeta({
      title: "Industries — NOVA Compliance",
      description: "NOVA Compliance for technology, financial services, healthcare, government suppliers and professional services.",
      path: "/industries",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Industries", to: "/industries" }]))],
  }),
  component: IndustriesPage,
});

const industries = [
  {
    slug: "technology",
    name: "Technology",
    summary: "Move fast without losing track of security reviews, customer questionnaires and framework readiness.",
  },
  {
    slug: "financial-services",
    name: "Financial services",
    summary: "Build a defensible record around data protection, operational resilience and regulatory expectations.",
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    summary: "Manage privacy, security and governance obligations with clear evidence ownership and reviewer validation.",
  },
  {
    slug: "government-suppliers",
    name: "Government suppliers",
    summary: "Demonstrate capability and readiness through structured evidence rather than ad-hoc documentation.",
  },
  {
    slug: "professional-services",
    name: "Professional services",
    summary: "Maintain assurance for clients across multiple engagements with reusable evidence and consistent controls.",
  },
];

function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Compliance by industry"
        description="NOVA adapts to the obligations and operating rhythm of each sector while keeping the same governed, evidence-led approach."
        breadcrumbs={[{ label: "Industries", to: "/industries" }]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <Card key={ind.slug} interactive>
              <h2 className="text-lg font-semibold">{ind.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{ind.summary}</p>
              <Link to={`/industries/${ind.slug}` as any} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
