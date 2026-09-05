import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { frameworks, getFramework } from "@/data/frameworks";
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
    <>
      <PageHero eyebrow="Frameworks" title="Framework not found" description="That framework page does not exist." breadcrumbs={[{ label: "Frameworks", to: "/frameworks" }]} />
      <Section>
        <p className="text-muted-foreground">Browse available and planned frameworks.</p>
        <div className="mt-4">
          <Link to="/frameworks" className="text-primary underline">View all frameworks</Link>
        </div>
      </Section>
    </>
  );
}

function FrameworkDetail() {
  const { framework } = Route.useLoaderData();
  const relatedFeatures = features.filter((f) => f.relatedFrameworks?.includes(framework.slug));

  return (
    <>
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
              <h2 className="text-2xl font-semibold">What NOVA covers for {framework.name}</h2>
              <p className="mt-4 text-muted-foreground">{framework.coverage}</p>
              {framework.inScope ? (
                <ul className="mt-6 space-y-2">
                  {framework.inScope.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Honest scope handling</h2>
              <p className="mt-4 text-muted-foreground">
                NOVA does not claim a framework is certified. It helps the team define what is genuinely in scope, map
                requirements to controls, collect evidence and report readiness. Final assessment and certification
                decisions sit with the organisation and its chosen assessor.
              </p>
              <Disclaimer className="mt-6">{site.frameworkDisclaimer}</Disclaimer>
            </div>

            {framework.relatedFrameworks?.length ? (
              <div>
                <h2 className="text-2xl font-semibold">Related frameworks</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {framework.relatedFrameworks
                    .map((slug) => frameworks.find((f) => f.slug === slug))
                    .filter(Boolean)
                    .map((f) => (
                      <Card key={f!.slug} interactive>
                        <h3 className="font-semibold">{f!.name}</h3>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{f!.description}</p>
                        <Link to={`/frameworks/${f!.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                          Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
                        </Link>
                      </Card>
                    ))}
                </div>
              </div>
            ) : null}
          </div>

          <aside className="space-y-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Framework details</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-muted-foreground">Availability</span>
                <AvailabilityBadge value={framework.availability} />
              </div>
              {framework.complianceType ? (
                <div>
                  <span className="block text-muted-foreground">Type</span>
                  <span className="font-medium">{framework.complianceType}</span>
                </div>
              ) : null}
            </div>
            <div className="rounded-lg bg-surface p-4 text-sm">
              <p className="font-medium">Need help deciding?</p>
              <p className="mt-1 text-muted-foreground">Book a demo to map your obligations to the right frameworks.</p>
              <Link to="/book-demo" className="mt-3 inline-flex items-center gap-1 font-medium text-primary hover:underline">
                Book a demo <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      {relatedFeatures.length > 0 ? (
        <Section tone="surface">
          <RelatedLinks title="Capabilities that support this framework" items={relatedFeatures.map((f) => ({ label: f.name, to: f.path, description: f.summary }))} />
        </Section>
      ) : null}

      <ConversionCta />
    </>
  );
}
