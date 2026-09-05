import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { solutions } from "@/data/solutions";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/partners")({
  head: () => ({
    ...pageMeta({
      title: "Partners — NOVA Compliance",
      description: "Partner with Eredox to deliver compliance consulting, auditing, implementation and advisory services powered by NOVA.",
      path: "/partners",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Partners", to: "/partners" }]))],
  }),
  component: PartnersPage,
});

const partnerTypes = [
  {
    title: "Consulting partners",
    body: "Help clients design, implement and operate their compliance programmes using NOVA as the shared workspace.",
  },
  {
    title: "Audit and assurance partners",
    body: "Use the Auditor Portal to review evidence and controls in a scoped, transparent engagement.",
  },
  {
    title: "Technology partners",
    body: "Build connectors and integrations that feed evidence into NOVA while preserving reviewer validation.",
  },
];

const benefits = [
  "Shared workspace for client engagement",
  "Scoped access for external review",
  "Reusable templates and evidence patterns",
  "Transparent roadmap and connector support",
  "Co-marketing and referral arrangements",
];

function PartnersPage() {
  const partnerSolutions = solutions.filter((s) => s.audience === "Partner");

  return (
    <>
      <PageHero
        eyebrow="Partners"
        title="Partner with Eredox"
        description="Work with us to deliver compliance services, audits, integrations and advisory engagements through the NOVA platform."
        breadcrumbs={[{ label: "Partners", to: "/partners" }]}
      />

      <Section>
        <SectionHeading title="Partner programmes" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {partnerTypes.map((p) => (
            <Card key={p.title}>
              <h2 className="text-lg font-semibold">{p.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading title="Why partner" />
            <FeatureList className="mt-6" items={benefits} />
          </div>
          <Card>
            <h2 className="text-lg font-semibold">Apply to partner</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us about your practice and the clients you serve. We will respond within a few business days.
            </p>
            <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-primary underline">
              Contact partnerships <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </Section>

      {partnerSolutions.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="Solutions" title="Partner solutions" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {partnerSolutions.map((s) => (
              <Card key={s.slug} interactive>
                <h3 className="font-semibold">{s.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{s.summary}</p>
                <Link to={s.path} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <ConversionCta />
    </>
  );
}
