import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/case-studies")({
  head: () => ({
    ...pageMeta({
      title: "Case studies — NOVA Compliance",
      description: "Examples of how organisations use NOVA Compliance to prepare for assessments and run their compliance programmes.",
      path: "/resources/case-studies",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Resources", to: "/resources" }, { label: "Case studies", to: "/resources/case-studies" }]))],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const studies = resources.filter((r) => r.type === "case-study");

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Case studies"
        description="Examples of how teams use NOVA to keep their compliance programmes coherent."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Case studies", to: "/resources/case-studies" },
        ]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {studies.map((study) => (
            <Card key={study.slug} interactive>
              <h2 className="text-lg font-semibold">{study.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{study.summary}</p>
              <Link to={`/resources/case-studies/${study.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read case study <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
