import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ComponentProps } from "react";
import { ArrowRight, Check } from "lucide-react";

import { CtaLink, ConversionCta } from "@/components/site/cta";
import {
  Card,
  AvailabilityBadge,
  FeatureList,
  Section,
  SectionHeading,
} from "@/components/site/primitives";
import { EredoxHero } from "@/components/site/EredoxHero";
import { PlatformFlow } from "@/components/site/PlatformFlow";
import { site } from "@/config/site";
import { governedFrameworkCatalogue } from "@/data/framework-catalogue";
import { frameworks, illustrativeReadiness } from "@/data/frameworks";
import { audiencePaths, outcomePaths } from "@/data/homepage-funnel";
import { homepageFaqItems } from "@/data/resources";
import { ldScript, pageMeta, softwareSchema } from "@/lib/seo";

type HomepageRouteTo = NonNullable<ComponentProps<typeof Link>["to"]>;

const routeTo = (path: string): HomepageRouteTo => path as HomepageRouteTo;

const whyNovaItems = [
  {
    title: "One connected compliance system",
    body: "Frameworks, controls, policies, evidence, risk and reporting work together.",
  },
  {
    title: "Reuse work across frameworks",
    body: "Where controls and evidence overlap, NOVA helps reduce unnecessary duplication.",
  },
  {
    title: "Know where you stand",
    body: "See compliance progress, evidence coverage, risks and gaps without assembling the picture manually.",
  },
  {
    title: "AI-supported. Human-governed.",
    body: "Use AI to assist the work while preserving human accountability for compliance and risk decisions.",
  },
  {
    title: "Built to grow with you",
    body: "Start with current requirements and expand governance capability as needs grow.",
  },
] as const;

const productProofItems = [
  {
    title: "Frameworks",
    body: "Scope requirements and connect them to the controls your organisation actually operates.",
  },
  {
    title: "Controls & evidence",
    body: "Collect evidence with context, map it to controls and keep reviewer validation visible.",
  },
  {
    title: "Policies & risk",
    body: "Keep policy approvals, risks, assets and accountability connected to the programme record.",
  },
  {
    title: "Reports & assurance",
    body: "Use live records to support readiness reporting, Trust Centre publication and scoped auditor access.",
  },
] as const;

const trustResources = [
  { label: "Security overview", to: "/security" },
  { label: "Responsible AI", to: "/responsible-ai" },
  { label: "Trust and assurance", to: "/trust" },
  { label: "Scoped auditor access", to: "/features/auditor-portal" },
] as const;

const pricingStages = [
  { title: "Start", body: "For organisations beginning their compliance journey." },
  { title: "Grow", body: "For teams managing more frameworks, repositories and users." },
  {
    title: "Scale",
    body: "For organisations requiring broader governance and enterprise capability.",
  },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageMeta({
      title: "NOVA Compliance | AI-Assisted Governance, Risk & Compliance",
      description: site.tagline,
      path: "/",
    }),
    scripts: [ldScript(softwareSchema())],
  }),
  component: Index,
});

function AudienceVisual({
  imagePath,
  imageAlt,
  imageWidth,
  imageHeight,
  tone,
}: (typeof audiencePaths)[number]) {
  return (
    <figure className={`overflow-hidden rounded-xl bg-gradient-to-br ${tone}`}>
      <img
        src={imagePath}
        alt={imageAlt}
        width={imageWidth}
        height={imageHeight}
        loading="lazy"
        decoding="async"
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        className="block h-auto w-full object-cover"
      />
    </figure>
  );
}

function Index() {
  const [activeFaq, setActiveFaq] = useState(0);
  const activeItem = homepageFaqItems[activeFaq] ?? homepageFaqItems[0]!;

  return (
    <>
      {/* 1. Existing hero — preserved. */}
      <EredoxHero />

      {/* 2. Existing AI governance — kept directly after the hero. */}
      <Section tone="soft" id="ai-governance">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="AI Governance"
              title="AI governance with human oversight"
              description="NOVA supports AI governance with governed controls, policies and evidence: explain requirements, draft descriptions, summarise artefacts and identify likely gaps while keeping human oversight in the approval loop. It does not approve anything."
            />
            <FeatureList
              className="mt-6"
              items={[
                "Interprets and summarises uploaded evidence",
                "Prepares policy and control description drafts",
                "Identifies likely gaps against activated requirements",
                "Explains what a requirement is asking for in plain language",
              ]}
            />
            <div className="mt-6 flex flex-wrap gap-3">
              <CtaLink to="/features/ai-assistant">Explore AI assistance</CtaLink>
              <CtaLink to="/responsible-ai" variant="outline">
                Responsible AI
              </CtaLink>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src="/media/ai-governance/nova-ai-governance-human-review-workflow.png"
              alt="NOVA AI governance workflow showing policies, controls, evidence and requirements feeding into AI-assisted review with human approval."
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-contain"
            />
            <div className="p-6">
              <blockquote className="text-lg font-medium leading-relaxed text-foreground">
                “NOVA supports the readiness decision. Final launch and risk decisions remain human
                decisions.”
              </blockquote>
              <p className="mt-4 text-sm text-muted-foreground">
                The assistant speeds preparation. It does not carry accountability for policies,
                risk acceptance or any statement made to an auditor, regulator or customer.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* 3. Audience self-selection — reworked from the former late solutions grid. */}
      <Section id="audience">
        <SectionHeading
          eyebrow="Who NOVA is for"
          title="Built for the people responsible for trust"
          description="Whether you're establishing your first compliance program or managing governance across an enterprise, NOVA adapts to the way you work."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {audiencePaths.map((audience) => (
            <Link
              key={audience.key}
              to={routeTo(audience.to)}
              aria-label={audience.cta}
              className="group rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:p-5"
            >
              <AudienceVisual {...audience} />
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-primary">
                {audience.title}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{audience.body}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                {audience.cta}
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 4. Why NOVA — consolidated from the former outcomes/value section. */}
      <Section tone="surface" id="why-nova">
        <SectionHeading
          eyebrow="Why NOVA"
          title="Compliance shouldn't live in disconnected systems"
          description="NOVA keeps the compliance management record together so teams can spend less time assembling status and more time on accountable decisions."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyNovaItems.map((item) => (
            <Card key={item.title} className="flex items-start gap-3">
              <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <CtaLink to="/platform">Explore the NOVA Platform</CtaLink>
        </div>
      </Section>

      {/* 5. Product proof — merges the existing platform, integrations and evidence sections. */}
      <Section id="product-proof">
        <SectionHeading
          eyebrow="Product proof"
          title="See compliance as it happens"
          description="The claims above are grounded in a working product: one governed workspace for frameworks, controls, evidence, policy, risk, reporting and assurance."
        />
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start">
          <figure className="overflow-hidden rounded-2xl border border-border bg-card">
            <img
              src="/media/evidence-automation/nova-evidence-automation-human-review-workflow.png"
              alt="NOVA evidence workflow showing connected systems and evidence mapped to controls and frameworks before human review and reporting."
              width={1672}
              height={941}
              loading="lazy"
              decoding="async"
              className="h-auto w-full object-contain"
            />
            <figcaption className="border-t border-border px-5 py-4 text-sm text-muted-foreground">
              Illustrative product workflow. Evidence is not treated as readiness support until it
              has been reviewed in context.
            </figcaption>
          </figure>
          <div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {productProofItems.map((item) => (
                <Card key={item.title}>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </Card>
              ))}
            </div>
            <CtaLink to="/platform" className="mt-6">
              Explore the Platform
            </CtaLink>
          </div>
        </div>
        <div className="mt-10">
          <PlatformFlow />
        </div>
      </Section>

      {/* 6. Framework recognition — uses the governed website catalogue. */}
      <Section id="frameworks">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Frameworks"
              title="SOC 2 readiness and multi-framework compliance"
              description={`${governedFrameworkCatalogue.availableCount} framework capabilities are represented in the governed NOVA catalogue. The public cards distinguish what is available now from what is available by configuration; activation still depends on customer scope and evidence.`}
            />
            <div className="mt-8 space-y-4">
              {frameworks.map((framework) => (
                <div
                  key={framework.slug}
                  className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{framework.name}</h3>
                      <AvailabilityBadge value={framework.availability} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{framework.description}</p>
                  </div>
                  <Link
                    to={routeTo(`/frameworks/${framework.slug}`)}
                    className="shrink-0 text-sm font-medium text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
            <CtaLink to="/frameworks" variant="outline" className="mt-6">
              View all frameworks
            </CtaLink>
            <Card className="mt-6 bg-primary-soft/40">
              <p className="eyebrow">Custom framework available</p>
              <h3 className="mt-2 text-lg font-semibold">
                Create a custom framework for any requirement.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Bring customer, contractual, regulatory or internal requirements into a governed
                framework with human-reviewed mappings and evidence decisions.
              </p>
              <Link
                to="/book-demo"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Discuss your requirements <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">Illustrative readiness snapshot</h3>
            <p className="mt-2 text-sm text-muted-foreground">{site.illustrativeCaption}</p>
            <div className="mt-5 space-y-4">
              {illustrativeReadiness.map((framework) => (
                <div key={framework.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{framework.name}</span>
                    <span className="text-muted-foreground">{framework.value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <span
                      className="block h-full rounded-full bg-primary"
                      style={{ width: `${framework.value}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{framework.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* 7. Outcome navigation — separate from audience self-selection. */}
      <Section tone="surface" id="outcomes">
        <SectionHeading
          eyebrow="Choose your next step"
          title="What are you trying to achieve?"
          description="Start with the outcome you need, then follow the path that best matches your current compliance work."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {outcomePaths.map((outcome) => (
            <Link
              key={outcome.title}
              to={routeTo(outcome.to)}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lift focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <h3 className="text-lg font-semibold group-hover:text-primary">{outcome.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{outcome.body}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                Explore this path <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* 8. Trust / security / assurance — retained and consolidated. */}
      <Section id="trust">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Security and trust"
              title="Trust starts with how the platform itself is governed"
              description="NOVA keeps each organisation's evidence inside its own tenant boundary, with role-based access, human oversight and scoped auditor engagement."
            />
            <FeatureList
              className="mt-6"
              items={[
                "Tenant-isolated workspaces",
                "Role-based access inside each tenant",
                "Scoped Auditor Portal access per engagement",
                "Published security practices, not unverified claims",
              ]}
            />
            <CtaLink to="/security" variant="outline" className="mt-6">
              Explore Security & Trust
            </CtaLink>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Trust resources</h3>
            <ul className="mt-4 space-y-3">
              {trustResources.map((resource) => (
                <li key={resource.to}>
                  <Link
                    to={routeTo(resource.to)}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-3 text-sm font-medium hover:bg-background"
                  >
                    {resource.label}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Governed FAQ remains as a concise objection-handling bridge before commercial action. */}
      <Section tone="surface" id="faq">
        <SectionHeading
          eyebrow="FAQ"
          title="Common questions"
          description="Browse concise answers about NOVA, frameworks, evidence, AI, security and pricing."
        />
        <div className="mt-10 grid gap-3 lg:grid-cols-5">
          <div className="space-y-2 lg:col-span-2">
            {homepageFaqItems.map((item, index) => {
              const active = activeFaq === index;
              return (
                <button
                  key={item.question}
                  type="button"
                  aria-expanded={active}
                  aria-controls={`homepage-faq-answer-${index}`}
                  onClick={() => setActiveFaq(index)}
                  className={`w-full rounded-lg px-3 py-3 text-left text-sm ${active ? "bg-primary-soft font-medium text-accent-foreground" : "hover:bg-background"}`}
                >
                  {item.question}
                </button>
              );
            })}
          </div>
          <div
            id={`homepage-faq-answer-${activeFaq}`}
            className="rounded-xl border border-border bg-card p-6 lg:col-span-3"
          >
            <h3 className="text-lg font-semibold">{activeItem.question}</h3>
            <p className="mt-3 text-muted-foreground">{activeItem.answer}</p>
            {activeItem.links?.length ? (
              <div className="mt-5 flex flex-wrap gap-4">
                {activeItem.links.map((link) => (
                  <Link
                    key={link.to}
                    to={routeTo(link.to)}
                    className="text-sm font-medium text-primary underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <CtaLink to="/resources/faq" variant="outline" className="mt-8">
          View all FAQs
        </CtaLink>
      </Section>

      {/* 9. Pricing bridge — broad marketing stages only; /pricing remains canonical. */}
      <Section id="pricing">
        <SectionHeading
          eyebrow="Pricing"
          title="Start where you are. Scale when you're ready."
          description="From organisations beginning their compliance journey to teams managing complex multi-framework governance, NOVA provides a clear path to grow."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pricingStages.map((stage) => (
            <Card key={stage.title}>
              <p className="eyebrow">{stage.title}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{stage.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink to="/pricing">View Plans & Pricing</CtaLink>
          <CtaLink to="/start" variant="outline">
            Explore Free access
          </CtaLink>
          <CtaLink to="/book-demo" variant="ghost">
            Book a Demo
          </CtaLink>
        </div>
      </Section>

      {/* 10. Deliberate final conversion CTA. */}
      <ConversionCta
        title="Ready to see what your compliance program looks like in NOVA?"
        description="Explore the platform, compare plans or speak with us about your compliance requirements."
        primary={{ label: "Explore Free access", to: "/start" }}
        secondary={{ label: "Book a Demo", to: "/book-demo" }}
        tertiary={{ label: "View Pricing", to: "/pricing" }}
      />
    </>
  );
}
