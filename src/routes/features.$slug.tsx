import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, AvailabilityBadge, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { features, getFeature } from "@/data/features";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/features/$slug")({
  loader: ({ params }) => {
    const feature = getFeature(params.slug);
    if (!feature) throw notFound();
    return { feature };
  },
  head: ({ loaderData }) => {
    const feature = loaderData?.feature;
    if (!feature) {
      return {
        meta: [{ title: "Feature not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${feature.name} — NOVA Compliance`,
        description: feature.summary,
        path: feature.path,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Features", to: "/features" },
            { label: feature.name, to: feature.path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: FeatureNotFound,
  component: FeatureDetail,
});

function FeatureNotFound() {
  return (
    <>
      <PageHero eyebrow="Features" title="Feature not found" description="That feature page does not exist." breadcrumbs={[{ label: "Features", to: "/features" }]} />
      <Section>
        <p className="text-muted-foreground">Browse the full list of capabilities.</p>
        <div className="mt-4">
          <Link to="/features" className="text-primary underline">View all features</Link>
        </div>
      </Section>
    </>
  );
}

function FeatureDetail() {
  const { feature } = Route.useLoaderData();

  const relatedFeatures = features.filter((f) => feature.related.includes(f.slug));
  const relatedLinks = relatedFeatures.map((f) => ({ label: f.name, to: f.path, description: f.summary }));

  return (
    <>
      <PageHero
        eyebrow="Features"
        title={feature.name}
        description={feature.summary}
        breadcrumbs={[
          { label: "Features", to: "/features" },
          { label: feature.name, to: feature.path },
        ]}
        badge={<AvailabilityBadge value={feature.availability} />}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold">The problem it solves</h2>
              <p className="mt-4 text-lg text-muted-foreground">{feature.problem}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">How it works</h2>
              <ol className="mt-6 space-y-6">
                {feature.workflow.map((w, i) => (
                  <li key={w.title} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-accent-foreground">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="font-semibold">{w.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{w.body}</p>
                      {w.points ? (
                        <ul className="mt-3 space-y-1.5">
                          {w.points.map((p) => (
                            <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              {p}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Capabilities</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {feature.capabilities.map((c) => (
                  <Card key={c.title}>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">What people remain responsible for</h2>
              <FeatureList className="mt-6" items={feature.humanResponsibilities} />
            </div>
          </div>

          <aside className="space-y-6 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">At a glance</h2>
            <div className="space-y-4 text-sm">
              <div>
                <span className="block text-muted-foreground">Availability</span>
                <AvailabilityBadge value={feature.availability} />
              </div>
              {feature.relatedFrameworks?.length ? (
                <div>
                  <span className="block text-muted-foreground">Relevant frameworks</span>
                  <ul className="mt-2 space-y-1">
                    {feature.relatedFrameworks.map((slug) => (
                      <li key={slug}>
                        <Link to={`/frameworks/${slug}` as any} className="text-primary hover:underline">
                          {slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
            <Disclaimer>{site.humanStatement}</Disclaimer>
          </aside>
        </div>
      </Section>

      {relatedLinks.length > 0 ? (
        <Section tone="surface">
          <RelatedLinks title="Related capabilities" items={relatedLinks} />
        </Section>
      ) : null}

      <ConversionCta />
    </>
  );
}
