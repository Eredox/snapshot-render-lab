import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { CtaLink, ConversionCta } from "@/components/site/cta";
import { PlatformFlow } from "@/components/site/PlatformFlow";
import { features } from "@/data/features";
import { site } from "@/config/site";
import { pageMeta, ldScript, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/platform")({
  head: () => ({
    ...pageMeta({
      title: "Platform overview — NOVA Compliance",
      description: "How frameworks, controls, evidence, risk, reporting and assurance connect inside the NOVA workspace.",
      path: "/platform",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Platform overview", to: "/platform" }]))],
  }),
  component: PlatformPage,
});

const principles = [
  {
    title: "Governed record",
    body: "Every control, evidence item, policy version, risk and asset lives in the same workspace with ownership and history.",
  },
  {
    title: "Reusable evidence",
    body: "One artefact can support multiple frameworks when it genuinely satisfies the underlying control.",
  },
  {
    title: "Human decisions",
    body: site.humanStatement,
  },
];

const architectureCards = [
  {
    title: "Workspace and tenant boundary",
    body: "Each organisation operates in its own tenant. Evidence, controls, policies and reporting are scoped to that tenant.",
  },
  {
    title: "Framework layer",
    body: "Activated frameworks publish their requirements. Requirements map onto controls, not onto evidence directly.",
  },
  {
    title: "Control and evidence layer",
    body: "Controls describe operating expectations. Evidence demonstrates implementation and is validated by a reviewer.",
  },
  {
    title: "Assurance layer",
    body: "Readiness reports, Trust Centre publication and Auditor Portal access all draw from the same governed records.",
  },
];

const related = [
  { label: "All features", to: "/features", description: "Every capability in one list" },
  { label: "Frameworks", to: "/frameworks", description: "Coverage and availability" },
  { label: "Integrations", to: "/integrations", description: "Connectors and status" },
  { label: "Trust and assurance", to: "/trust", description: "How we support customer assurance" },
];

function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="A single workspace for the whole compliance programme"
        description="NOVA connects frameworks, controls, evidence, policies, risks, assets and reporting so the readiness position is always traceable to the underlying records."
        breadcrumbs={[{ label: "Platform", to: "/platform" }]}
      />

      <Section>
        <SectionHeading
          title="How the platform is organised"
          description="The platform is organised around four layers that keep records together, reuse evidence, and expose only what each audience should see."
        />
        <div className="mt-8">
          <PlatformFlow />
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Principles"
          title="What the architecture is designed to protect"
          description="These principles guide every design decision in the platform."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {principles.map((p) => (
            <Card key={p.title}>
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Architecture" title="Four layers, one coherent record" />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {architectureCards.map((c) => (
            <Card key={c.title}>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </Card>
          ))}
        </div>
        <Disclaimer className="mt-8">{site.frameworkDisclaimer}</Disclaimer>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Capabilities"
          title="The capabilities that make the layers work"
          description="Each feature area is described in detail on its own page, including availability, operating workflow and what the human team remains responsible for."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Link
              key={f.slug}
              to={f.path}
              className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lift"
            >
              <h3 className="font-semibold group-hover:text-primary">{f.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Evidence lifecycle"
              title="From collection to reviewed assurance"
              description="Evidence is collected with context, mapped to controls, reviewed by a person and kept current. Only then does it feed readiness reporting."
            />
            <FeatureList
              className="mt-6"
              items={[
                "Upload or connect evidence with structured metadata",
                "Map one artefact to every control it legitimately supports",
                "Reviewer validates it against the control expectation",
                "Freshness expectations surface ageing items before assessment",
                "Readiness reports are derived from the reviewed record",
              ]}
            />
            <div className="mt-6">
              <CtaLink to="/features/evidence">Explore evidence management</CtaLink>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Where evidence is used</h3>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Controls", to: "/features/controls" },
                { label: "Auditor Portal", to: "/features/auditor-portal" },
                { label: "Trust Centre", to: "/features/trust-centre" },
                { label: "Reporting", to: "/features/reporting" },
              ].map((r) => (
                <li key={r.to}>
                  <Link to={r.to} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm font-medium hover:bg-background">
                    {r.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <RelatedLinks title="Explore the platform" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
