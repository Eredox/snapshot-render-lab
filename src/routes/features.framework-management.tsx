import { createFileRoute } from "@tanstack/react-router";
import { Section, PageHero, Card, FeatureList, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { features } from "@/data/features";
import { site } from "@/config/site";
import { getFeature } from "@/data/features";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/features/framework-management")({
  head: () => {
    const feature = getFeature("framework-management")!;
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
  component: FrameworkManagementPage,
});

function FrameworkManagementPage() {
  const feature = getFeature("framework-management")!;
  const related = features.filter((f) => feature.related.includes(f.slug));

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
      />

      <Section>
        <p className="text-lg text-muted-foreground">{feature.problem}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {feature.capabilities.map((c) => (
            <Card key={c.title}>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
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
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section>
        <h2 className="text-2xl font-semibold">What the team remains responsible for</h2>
        <FeatureList className="mt-6" items={feature.humanResponsibilities} />
        <Disclaimer className="mt-6">{site.frameworkDisclaimer}</Disclaimer>
      </Section>

      <Section tone="surface">
        <RelatedLinks title="Related capabilities" items={related.map((f) => ({ label: f.name, to: f.path, description: f.summary }))} />
      </Section>

      <ConversionCta />
    </>
  );
}
