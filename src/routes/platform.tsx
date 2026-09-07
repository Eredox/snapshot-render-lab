import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { CtaLink, ConversionCta } from "@/components/site/cta";
import { PlatformFlow } from "@/components/site/PlatformFlow";
import { ContactForm } from "@/components/site/ContactForm";
import { features } from "@/data/features";
import { plans, currency } from "@/data/pricing";
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

      <Section id="pricing">
        <SectionHeading
          eyebrow="Pricing"
          title="Plans that scale with the programme"
          description="Start free to evaluate the workflow, then move to the plan that matches your frameworks, evidence and assurance requirements. Full feature comparison is on the pricing page."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.slug} {...(plan.highlight ? { className: "border-primary" } : {})}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                {plan.highlight ? (
                  <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">Most popular</span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.summary}</p>
              <p className="mt-4">
                {plan.quoteOnly ? (
                  <span className="text-2xl font-semibold">Quote only</span>
                ) : (
                  <>
                    <span className="text-2xl font-semibold">
                      {plan.monthly === 0 ? "Free" : `$${plan.monthly} ${currency}`}
                    </span>
                    {plan.monthly !== 0 ? <span className="text-sm text-muted-foreground"> / month</span> : null}
                  </>
                )}
              </p>
              {plan.annual !== null && plan.annual > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">${plan.annual} {currency} / month billed annually</p>
              ) : null}
              <FeatureList className="mt-4" items={plan.includes.slice(0, 4)} />
              <div className="mt-5">
                <CtaLink to={plan.cta.to as any} variant={plan.highlight ? "primary" : "outline"} className="w-full">
                  {plan.cta.label}
                </CtaLink>
              </div>
            </Card>
          ))}
        </div>
        <Disclaimer className="mt-6">{site.pricingApprovalNote}</Disclaimer>
        <div className="mt-4">
          <CtaLink to="/pricing" variant="ghost">
            Full plan comparison <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </CtaLink>
        </div>
      </Section>

      <Section tone="surface" id="contact">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Talk to us"
              title="Discuss NOVA for your organisation"
              description="Tell us about your frameworks, team and assurance timeline and we will help you work out where to start. You can also book a demo or start free directly."
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink to="/book-demo" variant="outline">
                Book a demo
              </CtaLink>
              <CtaLink to="/start" variant="ghost">
                Start free
              </CtaLink>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">{site.humanStatement}</p>
          </div>
          <Card>
            <h2 className="text-lg font-semibold">Contact us</h2>
            <p className="mt-2 text-sm text-muted-foreground">We respond within two business days.</p>
            <ContactForm className="mt-6" defaultMessage="I would like to discuss NOVA Compliance for my organisation. " />
          </Card>
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
