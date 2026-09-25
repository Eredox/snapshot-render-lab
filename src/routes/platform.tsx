import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import {
  Section,
  SectionHeading,
  PageHero,
  Card,
  FeatureList,
  RelatedLinks,
  Disclaimer,
  AvailabilityBadge,
} from "@/components/site/primitives";
import { CtaLink, ConversionCta } from "@/components/site/cta";
import { features } from "@/data/features";
import { governedFrameworkCatalogue } from "@/data/framework-catalogue";
import { integrations } from "@/data/integrations";
import { site } from "@/config/site";
import { pageMeta, ldScript, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/platform")({
  head: () => ({
    ...pageMeta({
      title: "NOVA Compliance Platform | Governed GRC & AI Governance",
      description:
        "GRC platform for AI governance and multi-framework compliance, connecting controls, evidence, risk and human-reviewed readiness in one governed workspace.",
      path: "/platform",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Platform overview", to: "/platform" }]))],
  }),
  component: PlatformPage,
});

const platformFlow = [
  {
    title: "Requirements & Frameworks",
    body: "Scope the obligations that apply to your programme.",
  },
  { title: "Controls & Owners", body: "Define expectations, ownership and testing." },
  { title: "Evidence & Integrations", body: "Collect contextual evidence from governed sources." },
  { title: "Risk & Policy", body: "Connect operational risk and approved policy." },
  { title: "Human Review", body: "Validate evidence and make the accountable decision." },
  { title: "Readiness & Assurance", body: "Report from the same reviewed records." },
];

const principles = [
  {
    title: "One governed record",
    body: "Frameworks, requirements, controls, evidence, policies, risks and assets stay connected with ownership and history.",
  },
  {
    title: "Reuse where valid",
    body: "A control or evidence item can support more than one obligation when the mapping genuinely satisfies each requirement.",
  },
  {
    title: "Human decisions",
    body: site.humanStatement,
  },
];

const architecturePrinciples = [
  "Tenant-scoped records and access boundaries",
  "Explicit framework scope and activation decisions",
  "Traceable mappings between requirements, controls and evidence",
  "Readiness, Trust Centre and auditor workflows from reviewed records",
];

const related = [
  { label: "All features", to: "/features", description: "Every capability in one list" },
  { label: "Frameworks", to: "/frameworks", description: "Coverage and availability" },
  { label: "Integrations", to: "/integrations", description: "Connectors and status" },
  { label: "Responsible AI", to: "/responsible-ai", description: "AI governance and oversight" },
  { label: "Security", to: "/security", description: "Security and trust commitments" },
  { label: "Trust and assurance", to: "/trust", description: "How we support customer assurance" },
];

const availableIntegrations = integrations.filter(
  (integration) => integration.status === "Available now",
);

function PlatformPage() {
  return (
    <>
      <PageHero
        eyebrow="Platform"
        title="One governed workspace for compliance, security and AI."
        description="NOVA connects frameworks, requirements, controls, evidence, policies, risks, assets, AI governance and assurance in one traceable operating model. Changes to the underlying record flow through the programme instead of being recreated across spreadsheets, folders and separate assessments."
        breadcrumbs={[{ label: "Platform", to: "/platform" }]}
      />

      <Section>
        <SectionHeading
          title="How NOVA connects the programme"
          description={`NOVA brings a governed catalogue of ${governedFrameworkCatalogue.availableCount} framework capabilities into one operating model. Activation depends on customer scope, data and requirements; the catalogue does not mean every framework is active for every customer.`}
        />
        <div className="mt-10 rounded-2xl border border-border bg-card p-5 md:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
            {platformFlow.map((stage, index) => (
              <div key={stage.title} className="relative flex flex-col rounded-xl bg-surface p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  0{index + 1}
                </p>
                <h3 className="mt-3 text-sm font-semibold">{stage.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{stage.body}</p>
                {index < platformFlow.length - 1 ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -bottom-3 left-1/2 z-10 h-5 w-5 translate-x-1/2 rotate-90 text-muted-foreground md:hidden"
                  />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Shared control model"
          title="One control. Many requirements."
          description="When the same control legitimately satisfies several frameworks, NOVA lets your team maintain it once and map it to each relevant obligation. Ownership, testing and evidence can be reused where the underlying expectation is genuinely the same."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink to="/frameworks" variant="outline">
            Explore frameworks
          </CtaLink>
          <CtaLink to="/features/controls" variant="ghost">
            See control management
          </CtaLink>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {principles.map((principle) => (
            <Card key={principle.title}>
              <h3 className="text-lg font-semibold">{principle.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{principle.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Integrations & Connectors"
              title="Bring evidence in from the systems your organisation already uses."
              description="NOVA supports governed connectors and manual evidence upload with structured metadata, human validation and control mapping. Connector availability follows the governed inventory, so operational and planned integrations remain clearly distinguished."
            />
            <p className="mt-5 text-sm text-muted-foreground">
              Currently available through the public inventory:{" "}
              {availableIntegrations.map((integration) => integration.name).join(", ")}.
            </p>
            <div className="mt-6">
              <CtaLink to="/integrations">Explore integrations</CtaLink>
            </div>
          </div>
          <figure className="overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-soft">
            <img
              src="/media/integrations/nova-integrations-connectors-evidence-workflow.png"
              alt="NOVA integrations and connectors workflow showing business systems feeding evidence into controls, frameworks, human review and compliance reporting."
              title="NOVA Integrations & Connectors Evidence Workflow"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-xl object-contain"
            />
            <figcaption className="px-3 pb-2 pt-3 text-sm text-muted-foreground">
              Connect business systems to NOVA to collect evidence, map controls and frameworks,
              support human review and produce compliance reporting.
            </figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="soft">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="AI Governance"
              title="Govern AI within the same operating model."
              description="Connect AI systems, requirements, policies, risks, impact assessments, controls and evidence in the same governed workspace. Where relevant, NOVA can support work aligned to ISO/IEC 42001 while keeping oversight explicit."
            />
            <FeatureList
              className="mt-6"
              items={[
                "AI governance requirements and policy context",
                "Risk and impact assessment records",
                "Controls, evidence and human review in one traceable workflow",
              ]}
            />
            <p className="mt-6 text-sm font-medium text-foreground">{site.humanStatement}</p>
            <div className="mt-6">
              <CtaLink to="/responsible-ai" variant="outline">
                Responsible AI
              </CtaLink>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-3">
            <img
              src="/media/ai-governance/nova-ai-governance-human-review-workflow.png"
              alt="NOVA AI governance workflow showing policies, controls, evidence and requirements feeding into AI-assisted review with human approval."
              title="NOVA AI Governance Human Review Workflow"
              width="1672"
              height="941"
              loading="lazy"
              decoding="async"
              className="h-auto w-full rounded-xl object-contain"
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Evidence lifecycle"
              title="Automation with accountability at every step."
              description="Evidence management reduces repetitive work, but readiness is derived from records that have been contextualised, mapped, reviewed and kept current."
            />
            <FeatureList
              className="mt-6"
              items={[
                "Collect from manual uploads and governed integrations",
                "Contextualise with source, period, owner and scope metadata",
                "Map evidence to every control it legitimately supports",
                "Review and validate before it counts towards readiness",
                "Refresh ageing evidence and report the reviewed record",
              ]}
            />
            <div className="mt-6">
              <CtaLink to="/features/evidence">Explore evidence management</CtaLink>
            </div>
          </div>
          <Card>
            <h3 className="text-lg font-semibold">
              Collect → Contextualise → Map → Review → Refresh → Report
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              The same governed record can support readiness reporting, Trust Centre publication and
              scoped auditor workflows, subject to the appropriate human approval and disclosure
              boundaries.
            </p>
            <ul className="mt-5 space-y-3">
              {[
                "Structured metadata",
                "Legitimate cross-framework reuse",
                "Human validation",
                "Freshness and traceability",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Capabilities"
          title="The capabilities that make the operating model work"
          description="Feature cards are driven by NOVA's governed capability data. Availability is shown as it is defined in the source, including partial and planned areas."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.slug}
              to={feature.path}
              className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-lift"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold group-hover:text-primary">{feature.name}</h3>
                <AvailabilityBadge value={feature.availability} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{feature.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Architecture"
          title="A connected compliance, security and assurance record"
          description="NOVA keeps the boundaries visible: tenant data stays scoped, activated requirements stay explicit, and external assurance is drawn from reviewed records rather than duplicated status reports."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {architecturePrinciples.map((principle) => (
            <Card key={principle}>
              <div className="flex items-start gap-3">
                <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <p className="font-medium">{principle}</p>
              </div>
            </Card>
          ))}
        </div>
        <Disclaimer className="mt-8">{site.frameworkDisclaimer}</Disclaimer>
      </Section>

      <Section>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Talk to us"
              title="See how NOVA fits your compliance programme."
              description="Bring your frameworks, evidence and assurance requirements and explore the operating model with the NOVA team."
            />
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <CtaLink to="/book-demo">Book a demo</CtaLink>
            <CtaLink to="/pricing" variant="outline">
              Explore pricing
            </CtaLink>
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
