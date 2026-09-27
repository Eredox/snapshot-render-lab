import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { solutions } from "@/data/solutions";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/customers")({
  head: () => ({
    ...pageMeta({
      title: "Customers — NOVA Compliance",
      description: "How teams use NOVA Compliance to run evidence-led compliance programmes and prepare for assessments.",
      path: "/customers",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Customers", to: "/customers" }]))],
  }),
  component: CustomersPage,
});

const scenarios = [
  {
    title: "First enterprise security review",
    body: "A growing SaaS team used NOVA to collect evidence against SOC 2 controls and share a readiness view with their champion buyer.",
  },
  {
    title: "Consolidating frameworks",
    body: "A technology SME mapped ISO 27001 and Essential Eight onto shared controls, halving the evidence duplication between assessments.",
  },
  {
    title: "Audit preparation",
    body: "A regulated firm used reviewer validation to ensure every artefact was checked before the external assessor opened the Auditor Portal.",
  },
];

const outcomes = [
  "Reduced time spent locating evidence before assessments",
  "Clear ownership for every control and policy",
  "Reusable evidence across multiple frameworks",
  "Scoped, transparent auditor engagement",
];

function CustomersPage() {
  return (
    <>
      <PageHero
        eyebrow="Customers"
        title="Illustrative ways teams may use NOVA"
        description="These are illustrative scenarios, not named customer results or testimonials. They show the types of compliance workflows NOVA is designed to support."
        breadcrumbs={[{ label: "Customers", to: "/customers" }]}
      />

      <Section>
        <SectionHeading title="Illustrative scenarios" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {scenarios.map((s) => (
            <Card key={s.title}>
              <h2 className="text-lg font-semibold">{s.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{s.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading title="Potential workflow outcomes" />
            <FeatureList className="mt-6" items={outcomes} />
          </div>
          <div>
            <SectionHeading title="Find your fit" />
            <p className="mt-4 text-muted-foreground">
              Explore the solutions designed for your organisation type or role.
            </p>
            <div className="mt-6">
              <Link to="/solutions" className="inline-flex items-center gap-1 text-primary underline">
                Browse solutions <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <RelatedLinks
          title="Explore further"
          items={[
            { label: "Solutions", to: "/solutions", description: "By organisation and role" },
            { label: "Customer feedback", to: "/testimonials", description: "Approved public feedback" },
            { label: "Case studies", to: "/resources/case-studies", description: "Detailed stories" },
            { label: "Book a demo", to: "/book-demo", description: "See NOVA in action" },
          ]}
        />
      </Section>

      <ConversionCta />
    </>
  );
}
