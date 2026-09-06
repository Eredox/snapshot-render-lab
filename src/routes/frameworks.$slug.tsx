import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, RelatedLinks, Disclaimer, FeatureList } from "@/components/site/primitives";
import { ConversionCta, CtaLink } from "@/components/site/cta";
import { ContactForm } from "@/components/site/ContactForm";
import { getFramework } from "@/data/frameworks";
import { getFrameworkDetail } from "@/data/framework-detail";
import { plans, currency } from "@/data/pricing";
import { features } from "@/data/features";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/frameworks/$slug")({
  loader: ({ params }) => {
    const framework = getFramework(params.slug);
    if (!framework) throw notFound();
    return { framework };
  },
  head: ({ loaderData }) => {
    const framework = loaderData?.framework;
    if (!framework) {
      return {
        meta: [{ title: "Framework not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${framework.name} — NOVA Compliance`,
        description: framework.description,
        path: `/frameworks/${framework.slug}`,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Frameworks", to: "/frameworks" },
            { label: framework.name, to: `/frameworks/${framework.slug}` },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: FrameworkNotFound,
  component: FrameworkDetail,
});

function FrameworkNotFound() {
  return (
    <main>
      <PageHero eyebrow="Frameworks" title="Framework not found" description="That framework page does not exist." breadcrumbs={[{ label: "Frameworks", to: "/frameworks" }]} />
      <Section>
        <p className="text-muted-foreground">Browse available and planned frameworks.</p>
        <div className="mt-4">
          <Link to="/frameworks" className="text-primary underline">View all frameworks</Link>
        </div>
      </Section>
    </main>
  );
}

function FrameworkDetail() {
  const { framework } = Route.useLoaderData();
  const relatedFeatures = features.filter((f) => f.relatedFrameworks?.includes(framework.slug));
  const detail = getFrameworkDetail(framework.slug);
  const planShortlist = plans.filter((p) => ["launch", "growth", "professional", "enterprise"].includes(p.slug));
  const gettingStarted = [
    {
      title: "Activate the framework",
      body: `Create the workspace and activate ${framework.shortName} so its requirements load into your control set.`,
    },
    {
      title: "Assign control ownership",
      body: "Give each control a named owner and a review cadence, so accountability is recorded rather than assumed.",
    },
    {
      title: "Map and validate evidence",
      body: "Attach evidence to the requirements it supports and have a reviewer confirm it is current and sufficient.",
    },
    {
      title: "Review readiness",
      body: "Track gaps and readiness reporting, then decide with your assessor when the programme is ready for external review.",
    },
  ];

  return (
    <main>
      <PageHero
        eyebrow="Frameworks"
        title={framework.name}
        description={framework.description}
        breadcrumbs={[
          { label: "Frameworks", to: "/frameworks" },
          { label: framework.name, to: `/frameworks/${framework.slug}` },
        ]}
        badge={<AvailabilityBadge value={framework.availability} />}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold">Overview</h2>
              <div className="mt-4 space-y-4 text-muted-foreground">
                {framework.overview.map((p) => (
                  <p key={p.slice(0, 30)}>{p}</p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Who this is for</h2>
              <FeatureList items={framework.intendedFor} className="mt-4" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Governance areas</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {framework.governanceAreas.map((area) => (
                  <Card key={area.title}>
                    <h3 className="font-semibold">{area.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{area.body}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">How NOVA supports this framework</h2>
              <FeatureList items={framework.novaSupport} className="mt-4" />
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Controls and evidence focus</h2>
              <FeatureList items={framework.controlsAndEvidence} className="mt-4" />
            </div>

            {framework.crossFramework.length ? (
              <div>
                <h2 className="text-2xl font-semibold">Cross-framework reuse</h2>
                <div className="mt-4 space-y-3">
                  {framework.crossFramework.map((note) => (
                    <p key={note.slice(0, 30)} className="text-sm text-muted-foreground">
                      {note}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}

            <Disclaimer className="mt-6">{site.frameworkDisclaimer}</Disclaimer>
          </div>

          <aside className="space-y-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Framework details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-muted-foreground">Availability</span>
                <AvailabilityBadge value={framework.availability} />
              </div>
              <div>
                <span className="block text-muted-foreground">Category</span>
                <span className="font-medium">{framework.category}</span>
              </div>
              <div>
                <span className="block text-muted-foreground">Jurisdictions</span>
                <span className="font-medium">{framework.jurisdictions.join(" · ")}</span>
              </div>
            </div>
            <div className="rounded-lg bg-surface p-4 text-sm">
              <p className="font-medium">Need help deciding?</p>
              <p className="mt-1 text-muted-foreground">Book a demo to map your obligations to the right frameworks.</p>
              <Link to="/book-demo" className="mt-3 inline-flex items-center gap-1 font-medium text-primary hover:underline">
                Book a demo
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {detail ? (
        <>
          <Section tone="surface">
            <SectionHeading eyebrow="Structure" title={detail.structure.label} description={detail.structure.intro} />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {detail.structure.items.map((item) => (
                <Card key={item.code}>
                  <span className="eyebrow">{item.code}</span>
                  <h3 className="mt-2 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </Card>
              ))}
            </div>
          </Section>

          {detail.maturity ? (
            <Section>
              <SectionHeading eyebrow="Assessment" title={detail.maturity.label} description={detail.maturity.intro} />
              <ol className="mt-8 space-y-4">
                {detail.maturity.levels.map((level, i) => (
                  <li key={level.name} className="flex gap-4 rounded-2xl border border-border bg-card p-5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold">{i}</span>
                    <div>
                      <h3 className="font-semibold">{level.name}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{level.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Section>
          ) : null}

          <Section tone={detail.maturity ? "surface" : "default"}>
            <SectionHeading eyebrow="Evidence" title="Typical evidence held in NOVA" description={detail.evidence.intro} />
            <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">Artefact</th>
                    <th scope="col" className="px-5 py-3 font-medium">Typical source</th>
                    <th scope="col" className="px-5 py-3 font-medium">Expected cadence</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.evidence.rows.map((row) => (
                    <tr key={row.artefact} className="border-b border-border last:border-0">
                      <td className="px-5 py-3 font-medium">{row.artefact}</td>
                      <td className="px-5 py-3 text-muted-foreground">{row.source}</td>
                      <td className="px-5 py-3 text-muted-foreground">{row.cadence}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Disclaimer className="mt-6">{site.humanStatement}</Disclaimer>
          </Section>

          <Section>
            <SectionHeading eyebrow="How it runs" title={`Working through ${framework.name} in NOVA`} />
            <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {detail.journey.map((step, i) => (
                <li key={step.phase}>
                  <Card>
                    <span className="eyebrow">Step {i + 1}</span>
                    <h3 className="mt-2 font-semibold">{step.phase}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
                  </Card>
                </li>
              ))}
            </ol>
          </Section>

          <Section tone="surface">
            <SectionHeading eyebrow="Questions" title={`${framework.shortName} questions we are asked`} />
            <dl className="mt-8 grid gap-5 md:grid-cols-2">
              {detail.faqs.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-border bg-card p-6">
                  <dt className="font-semibold">{faq.question}</dt>
                  <dd className="mt-2 text-sm text-muted-foreground">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </Section>
        </>
      ) : null}

      {relatedFeatures.length > 0 ? (
        <Section tone="surface">
          <RelatedLinks
            title="Capabilities that support this framework"
            items={relatedFeatures.map((f) => ({ label: f.name, to: f.path, description: f.summary }))}
          />
        </Section>
      ) : null}

      <Section>
        <SectionHeading
          eyebrow="Pricing"
          title={`Plans that cover ${framework.shortName}`}
          description="Plans are subscription entitlements on one workspace, so you can start with a single framework and widen scope later."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {planShortlist.map((plan) => (
            <Card key={plan.slug} className={plan.highlight ? "border-primary" : undefined}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{plan.name}</h3>
                {plan.highlight ? <span className="eyebrow text-primary">Most chosen</span> : null}
              </div>
              <p className="mt-3 text-2xl font-semibold">
                {plan.quoteOnly || plan.monthly === null ? (
                  "On request"
                ) : (
                  <>
                    {currency} ${plan.monthly}
                    <span className="text-sm font-normal text-muted-foreground"> /month</span>
                  </>
                )}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">{plan.summary}</p>
              <FeatureList items={plan.includes.slice(0, 4)} className="mt-4" />
              <Link to="/pricing" className="mt-5 inline-flex text-sm font-medium text-primary hover:underline">
                Compare plans
              </Link>
            </Card>
          ))}
        </div>
        <Disclaimer className="mt-6">{site.pricingApprovalNote}</Disclaimer>
      </Section>

      <Section tone="surface">
        <SectionHeading
          eyebrow="Getting started"
          title={`How to start with ${framework.shortName}`}
          description="Four steps from an empty workspace to a reviewable readiness position."
        />
        <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {gettingStarted.map((step, i) => (
            <li key={step.title}>
              <Card>
                <span className="eyebrow">Step {i + 1}</span>
                <h3 className="mt-2 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
              </Card>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <CtaLink to="/start">Start free</CtaLink>
          <CtaLink to="/book-demo" variant="outline">
            Book a demo
          </CtaLink>
        </div>
        <Disclaimer className="mt-6">{site.humanStatement}</Disclaimer>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Talk to us"
              title={`Ask about ${framework.name}`}
              description="Tell us your scope, timeline and any assessment date you are working to. We will reply with what NOVA covers and what remains with your independent assessor."
            />
            <Disclaimer className="mt-6">{site.frameworkDisclaimer}</Disclaimer>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <ContactForm defaultMessage={`I would like to discuss ${framework.name} readiness in NOVA. `} />
          </div>
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
