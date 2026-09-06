import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { solutions } from "@/data/solutions";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/solutions/")({
  head: () => ({
    ...pageMeta({
      title: "Solutions — NOVA Compliance",
      description: "NOVA Compliance for startups, technology SMEs, regulated organisations, compliance teams, auditors and partners.",
      path: "/solutions",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Solutions", to: "/solutions" }]))],
  }),
  component: SolutionsPage,
});

function SolutionsPage() {
  const orgSolutions = solutions.filter((s) => s.audience === "Organisation");
  const roleSolutions = solutions.filter((s) => s.audience === "Role");
  const partnerSolutions = solutions.filter((s) => (s.audience as string) === "Partner");

  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="Compliance work, built for who does it"
        description="Whether you are a growing technology company, a regulated enterprise, a compliance practitioner or an auditor, NOVA keeps the programme record together."
        breadcrumbs={[{ label: "Solutions", to: "/solutions" }]}
      />

      <Section>
        <SectionHeading eyebrow="By organisation" title="Built for your organisation type" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {orgSolutions.map((s) => (
            <Card key={s.slug} interactive>
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{s.summary}</p>
              <Link to={s.path} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="By role" title="Built for your job" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {roleSolutions.map((s) => (
            <Card key={s.slug} interactive>
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{s.summary}</p>
              <Link to={s.path} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="For partners" title="For consultancies, auditors and advisory firms" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partnerSolutions.map((s) => (
            <Card key={s.slug} interactive>
              <h2 className="text-lg font-semibold">{s.name}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{s.summary}</p>
              <Link to={s.path} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
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
