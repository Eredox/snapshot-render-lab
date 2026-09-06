import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Section, SectionHeading, Card, FeatureList, AvailabilityBadge } from "@/components/site/primitives";
import { CtaLink, ConversionCta } from "@/components/site/cta";
import { EredoxHero } from "@/components/site/EredoxHero";
import { PlatformFlow } from "@/components/site/PlatformFlow";

import { frameworks, illustrativeReadiness } from "@/data/frameworks";
import { features } from "@/data/features";
import { solutions } from "@/data/solutions";
import { plans, supportComparison } from "@/data/pricing";
import { faqCategories } from "@/data/resources";
import { site } from "@/config/site";
import { pageMeta, ldScript, faqSchema, softwareSchema } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageMeta({
      title: `${site.productName} — ${site.tagline}`,
      description: site.tagline,
      path: "/",
    }),
    scripts: [ldScript(softwareSchema())],
  }),
  component: Index,
});

const outcomes = [
  "Understand what is ready and what needs work across every activated framework",
  "Stop duplicating evidence for every separate assessment or questionnaire",
  "Trace every readiness claim back to reviewed evidence and accountable owners",
  "Publish approved assurance content without exposing confidential artefacts",
  "Keep risk, policies, assets and controls in one coherent programme record",
];

const pillars = [
  {
    title: "Framework management",
    body: "Activate the frameworks that apply, map requirements to shared controls, and record scope honestly.",
    to: "/features/framework-management",
  },
  {
    title: "Evidence and controls",
    body: "Describe operating expectations, collect evidence with context, and review it before it counts.",
    to: "/features/evidence",
  },
  {
    title: "Risk and governance",
    body: "Record risks, treatment plans, policy approvals and asset ownership as connected records.",
    to: "/features/risk-management",
  },
  {
    title: "Reporting and assurance",
    body: "Produce readiness and gap reporting from live records, then share the right view with each audience.",
    to: "/features/reporting",
  },
];

const steps = [
  { title: "Scope", body: "Choose frameworks and define what is genuinely in scope for your organisation." },
  { title: "Structure", body: "Map requirements to controls, assign owners and set review cadence." },
  { title: "Collect", body: "Upload or connect evidence, map it to controls, and have a reviewer validate it." },
  { title: "Decide", body: "Use live readiness reporting to decide when to engage an assessor or share assurance." },
];

const audiences = [
  { title: "Startups and SaaS", body: "Get through your first enterprise security review without pausing the roadmap.", to: "/solutions/startups-saas" },
  { title: "Technology SMEs", body: "Consolidate overlapping obligations into one maintainable programme.", to: "/solutions/technology-smes" },
  { title: "Regulated organisations", body: "Build a defensible record where proof matters as much as practice.", to: "/solutions/regulated-organisations" },
  { title: "Compliance teams", body: "Spend less time chasing artefacts and more time on judgement.", to: "/solutions/compliance-teams" },
];

function Index() {
  const [activeFaq, setActiveFaq] = useState<{ category: number; item: number } | null>({ category: 0, item: 0 });
  const activeItem = activeFaq ? faqCategories[activeFaq.category]?.items[activeFaq.item] : undefined;

  return (
    <>
      {/* Hero */}
      <EredoxHero />


      {/* Trust bar */}
      <Section tone="ink" className="py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Frameworks available now", value: frameworks.filter((f) => f.availability === "Available now").length.toString() },
            { label: "Feature areas", value: features.length.toString() },
            { label: "Organisation solutions", value: solutions.filter((s) => s.audience === "Organisation").length.toString() },
            { label: "Plans to scale with", value: plans.length.toString() },
          ].map((s) => (
            <div key={s.label} className="text-center lg:text-left">
              <p className="text-3xl font-semibold text-ink-foreground">{s.value}</p>
              <p className="mt-1 text-sm text-ink-foreground/70">{s.label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Outcomes */}
      <Section>
        <SectionHeading
          eyebrow="Why NOVA"
          title="Compliance work that compounds instead of repeating"
          description="Most compliance programmes slow down because evidence is scattered, ownership is unclear and every assessment starts from scratch. NOVA keeps the programme record in one governed workspace."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {outcomes.map((o) => (
            <Card key={o} className="flex items-start gap-3">
              <Check aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">{o}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Platform pillars */}
      <Section tone="surface" id="capabilities">
        <SectionHeading
          eyebrow="Platform"
          title="One workspace for frameworks, evidence and decisions"
          description="NOVA connects the parts of a compliance programme so the readiness report is a consequence of the records, not a separate exercise."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((p) => (
            <Link
              key={p.title}
              to={p.to}
              className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lift"
            >
              <h3 className="text-lg font-semibold group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Explore <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-10">
          <PlatformFlow />
        </div>
      </Section>

      {/* Framework coverage */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Frameworks"
              title="Available frameworks, with more on the roadmap"
              description="Activate the frameworks that apply to your organisation. Available frameworks map onto a shared control set so evidence can be reused rather than collected again for every assessment."
            />
            <div className="mt-8 space-y-4">
              {frameworks.map((f) => (
                <div key={f.slug} className="flex items-start justify-between gap-4 rounded-xl border border-border bg-card p-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{f.name}</h3>
                      <AvailabilityBadge value={f.availability} />
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                  </div>
                  <Link to={`/frameworks/${f.slug}` as any} className="shrink-0 text-sm font-medium text-primary hover:underline">
                    View
                  </Link>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <CtaLink to="/frameworks" variant="outline">
                See all frameworks
              </CtaLink>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold">Illustrative readiness snapshot</h3>
            <p className="mt-2 text-sm text-muted-foreground">{site.illustrativeCaption}</p>
            <div className="mt-5 space-y-4">
              {illustrativeReadiness.map((f) => (
                <div key={f.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{f.name}</span>
                    <span className="text-muted-foreground">{f.value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${f.value}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* How it works */}
      <Section tone="surface">
        <SectionHeading
          eyebrow="How it works"
          title="From scope to readiness decision"
          description="A simple operating rhythm: define scope, build the structure, collect evidence, then use live reporting to support a human decision."
        />
        <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="relative rounded-xl border border-border bg-card p-6">
              <span className="text-2xl font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Capability highlights */}
      <Section>
        <SectionHeading
          eyebrow="Capabilities"
          title="The capabilities that make the programme coherent"
          description="Each feature is built around the same idea: keep the record together, keep people accountable, and never claim an outcome the evidence does not support."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.slug} interactive>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{f.name}</h3>
                <AvailabilityBadge value={f.availability} />
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{f.summary}</p>
              <Link to={f.path} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Learn more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <CtaLink to="/features" variant="outline">
            Browse all features
          </CtaLink>
        </div>
      </Section>

      {/* AI assistant */}
      <Section tone="soft">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="NOVA AI Assistant"
              title="Assistance grounded in your workspace, always for human approval"
              description="The assistant works from your governed controls, policies and evidence to explain requirements, draft descriptions, summarise artefacts and identify likely gaps. It does not approve anything."
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
          <div className="rounded-2xl border border-border bg-card p-6">
            <blockquote className="text-lg font-medium leading-relaxed text-foreground">
              “NOVA supports the readiness decision. Final launch and risk decisions remain human decisions.”
            </blockquote>
            <p className="mt-4 text-sm text-muted-foreground">
              The assistant speeds preparation. It does not carry accountability for policies, risk acceptance or any
              statement made to an auditor, regulator or customer.
            </p>
          </div>
        </div>
      </Section>

      {/* Evidence and automation */}
      <Section>
        <SectionHeading
          eyebrow="Evidence and automation"
          title="Automation that preserves accountability"
          description="Connectors and AI reduce repetitive work, but evidence only counts once a person has reviewed it. Every automation boundary is explicit."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {[
            { title: "Manual upload", body: "Upload artefacts with structured metadata and map them to controls." },
            { title: "GitHub connector", body: "Bring engineering evidence into the workspace automatically, then review it." },
            { title: "Reviewer validation", body: "A person confirms the artefact actually demonstrates the control before it counts." },
          ].map((c) => (
            <Card key={c.title}>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Connectors are listed on the{" "}
          <Link to="/integrations" className="text-primary underline">
            integrations page
          </Link>
          . Planned connectors are clearly labelled as not available today.
        </p>
      </Section>

      {/* Security */}
      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Security and trust"
              title="Built to hold sensitive assurance material"
              description="NOVA keeps each organisation's evidence inside its own tenant boundary, with role-based access and scoped auditor engagement."
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
            <div className="mt-6">
              <CtaLink to="/security" variant="outline">
                Security overview
              </CtaLink>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Trust resources</h3>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Security", to: "/security" },
                { label: "Responsible AI", to: "/responsible-ai" },
                { label: "Trust and assurance", to: "/trust" },
                { label: "System status", to: "/status" },
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

      {/* Customer segments */}
      <Section>
        <SectionHeading eyebrow="Solutions" title="Built for the people who run compliance" description="By organisation or by role, NOVA is designed around the work that actually happens." />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {audiences.map((a) => (
            <Link key={a.to} to={a.to} className="group rounded-xl border border-border bg-card p-6 transition-shadow hover:shadow-lift">
              <h3 className="text-lg font-semibold group-hover:text-primary">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-6">
          <CtaLink to="/solutions" variant="outline">
            All solutions
          </CtaLink>
        </div>
      </Section>

      {/* Pricing preview */}
      <Section tone="surface" id="pricing">
        <SectionHeading
          eyebrow="Pricing"
          title="Plans that scale with the size of the programme"
          description="From a free evaluation workspace through to enterprise deployments with bespoke scope."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {plans.slice(0, 3).map((p) => (
            <Card key={p.slug} className={p.highlight ? "relative border-primary shadow-lift" : ""}>
              {p.highlight ? (
                <span className="absolute -top-3 left-6 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Popular
                </span>
              ) : null}
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{p.summary}</p>
              <p className="mt-4">
                {p.monthly === 0 ? (
                  <span className="text-3xl font-semibold">Free</span>
                ) : (
                  <>
                    <span className="text-3xl font-semibold">${p.monthly}</span>
                    <span className="text-muted-foreground">/month</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{p.quoteOnly ? "Quoted per scope" : `${site.pricingApprovalNote}`}</p>
              <FeatureList className="mt-5" items={p.includes.slice(0, 4)} />
              <CtaLink to={p.cta.to} variant={p.highlight ? "primary" : "outline"} className="mt-6 w-full">
                {p.cta.label}
              </CtaLink>
            </Card>
          ))}
        </div>
        <div className="mt-8">
          <CtaLink to="/pricing" variant="ghost">
            Compare all plans <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </CtaLink>
        </div>
      </Section>

      {/* Availability / roadmap */}
      <Section>
        <SectionHeading
          eyebrow="Roadmap"
          title="What is available today and what is planned"
          description="NOVA ships capabilities as they are ready. Planned work is labelled everywhere so nobody expects a feature that is not live."
        />
        <div className="mt-10 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Area</th>
                <th className="px-4 py-3 font-medium">Available now</th>
                <th className="px-4 py-3 font-medium">Planned</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { area: "Frameworks", available: "SOC 2, ISO/IEC 27001, Essential Eight, ISO/IEC 42001", planned: "NIST CSF, HIPAA, ISM" },
                { area: "Evidence collection", available: "Manual upload, GitHub connector, reviewer validation", planned: "Additional cloud connectors" },
                { area: "AI assistance", available: "Evidence interpretation, requirement explanation, gap identification", planned: "Multi-connector evidence suggestions" },
                { area: "Assurance", available: "Readiness reporting, Trust Centre, Auditor Portal", planned: "Executive board views for lower tiers" },
              ].map((r) => (
                <tr key={r.area}>
                  <td className="px-4 py-3 font-medium">{r.area}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.available}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.planned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* FAQ */}
      <Section tone="surface">
        <SectionHeading eyebrow="FAQ" title="Common questions" description="Browse by topic to find answers about NOVA, frameworks, evidence, AI, security and pricing." />
        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {faqCategories.map((cat, ci) => (
              <div key={cat.category}>
                <p className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{cat.category}</p>
                <ul>
                  {cat.items.map((item, ii) => {
                    const active = activeFaq?.category === ci && activeFaq?.item === ii;
                    return (
                      <li key={item.question}>
                        <button
                          type="button"
                          onClick={() => setActiveFaq({ category: ci, item: ii })}
                          className={`w-full rounded-lg px-2 py-2 text-left text-sm ${active ? "bg-primary-soft font-medium text-accent-foreground" : "hover:bg-surface"}`}
                        >
                          {item.question}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
            {activeItem ? (
              <>
                <h3 className="text-lg font-semibold">{activeItem.question}</h3>
                <p className="mt-3 text-muted-foreground">{activeItem.answer}</p>
              </>
            ) : (
              <p className="text-muted-foreground">Select a question to see the answer.</p>
            )}
          </div>
        </div>
        <div className="mt-8">
          <CtaLink to="/resources/faq" variant="outline">
            View all FAQs
          </CtaLink>
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
