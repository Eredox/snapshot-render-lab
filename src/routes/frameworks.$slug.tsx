import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, RelatedLinks, Disclaimer, FeatureList } from "@/components/site/primitives";
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

      {relatedFeatures.length > 0 ? (
        <Section tone="surface">
          <RelatedLinks
            title="Capabilities that support this framework"
            items={relatedFeatures.map((f) => ({ label: f.name, to: f.path, description: f.summary }))}
          />
        </Section>
      ) : null}

      <ConversionCta />
    </main>
  );
}
