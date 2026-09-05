import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => ({
    ...pageMeta({
      title: "About — NOVA Compliance",
      description: "NOVA is built by Eredox to help growing organisations keep their compliance programmes coherent, traceable and human-led.",
      path: "/about",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "About", to: "/about" }]))],
  }),
  component: AboutPage,
});

const values = [
  {
    title: "Honest scope",
    body: "We help organisations understand what is actually covered and what is not. We never sell a certification illusion.",
  },
  {
    title: "Evidence first",
    body: "Every readiness claim must trace back to reviewed evidence. Reporting is a consequence of the record, not a separate fiction.",
  },
  {
    title: "Human decisions",
    body: "Technology can prepare, suggest and summarise. Launch, risk acceptance and certification decisions remain human.",
  },
  {
    title: "Sustainable compliance",
    body: "Compliance programmes should become easier to maintain, not harder. Reusable evidence and clear ownership make that possible.",
  },
];

const related = [
  { label: "Responsible AI", to: "/responsible-ai", description: "Oversight and boundaries" },
  { label: "Security", to: "/security", description: "Security practices" },
  { label: "Trust and assurance", to: "/trust", description: "How we support assurance" },
  { label: "Contact", to: "/contact", description: "Get in touch" },
];

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Built by Eredox"
        description="NOVA Compliance is a product of Eredox, designed for organisations that want a governed, evidence-led compliance programme without starting from scratch for every assessment."
        breadcrumbs={[{ label: "About", to: "/about" }]}
      />

      <Section>
        <SectionHeading title="Why we built NOVA" />
        <p className="mt-4 text-lg text-muted-foreground">
          Most compliance tools track checklists. NOVA was built to track the programme: the frameworks, controls,
          evidence, policies, risks, assets and people that make an organisation ready. We believe compliance work is
          too important to be a last-minute scramble.
        </p>
        <p className="mt-4 text-muted-foreground">
          Our customers range from fast-moving startups facing their first enterprise security review, to regulated
          organisations managing overlapping obligations, to consultancies and auditors who need a clean workspace for
          evidence and review.
        </p>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Values" title="How we design and operate NOVA" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {values.map((v) => (
            <Card key={v.title}>
              <h3 className="text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading title="What we do not do" />
        <FeatureList
          className="mt-6"
          items={[
            "Sell certifications or guarantees",
            "Claim a framework is automatically compliant",
            "Hide planned features behind available labels",
            "Use customer data to train shared models without consent",
          ]}
        />
      </Section>

      <Section tone="surface">
        <RelatedLinks title="Learn more" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
