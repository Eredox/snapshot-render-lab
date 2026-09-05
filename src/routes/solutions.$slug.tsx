import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { solutions, getSolution } from "@/data/solutions";
import { frameworks } from "@/data/frameworks";
import { features } from "@/data/features";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/solutions/$slug")({
  loader: ({ params }) => {
    const solution = getSolution(params.slug);
    if (!solution) throw notFound();
    return { solution };
  },
  head: ({ loaderData }) => {
    const solution = loaderData?.solution;
    if (!solution) {
      return {
        meta: [{ title: "Solution not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${solution.name} — NOVA Compliance`,
        description: solution.summary,
        path: solution.path,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Solutions", to: "/solutions" },
            { label: solution.name, to: solution.path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: SolutionNotFound,
  component: SolutionDetail,
});

function SolutionNotFound() {
  return (
    <main>
      <PageHero eyebrow="Solutions" title="Solution not found" description="That solution page does not exist." breadcrumbs={[{ label: "Solutions", to: "/solutions" }]} />
      <Section>
        <p className="text-muted-foreground">Browse the available solutions.</p>
        <div className="mt-4">
          <Link to="/solutions" className="text-primary underline">View all solutions</Link>
        </div>
      </Section>
    </main>
  );
}

function SolutionDetail() {
  const { solution } = Route.useLoaderData();
  const relatedFrameworks = solution.relatedFrameworks
    .map((slug) => frameworks.find((f) => f.slug === slug))
    .filter(Boolean);
  const relatedFeatures = features.filter((f) => solution.relatedFeatures?.includes(f.slug));

  return (
    <main>
      <PageHero
        eyebrow="Solutions"
        title={solution.name}
        description={solution.summary}
        breadcrumbs={[
          { label: "Solutions", to: "/solutions" },
          { label: solution.name, to: solution.path },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading title="What this solution solves" />
            <p className="mt-4 text-lg text-muted-foreground">{solution.intro}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {solution.challenges.map((c) => (
                <Card key={c.title}>
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <SectionHeading title="How NOVA helps" />
            <p className="mt-4 text-muted-foreground">{solution.governance}</p>
            <FeatureList className="mt-6" items={solution.capabilities} />
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Workflow" title="A practical path" />
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {solution.workflow.map((step) => (
            <Card key={step.step}>
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{step.step}</span>
              <h3 className="mt-2 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Implementation" title="What the rollout looks like" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {solution.implementation.map((phase) => (
            <Card key={phase.title}>
              <h3 className="font-semibold">{phase.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{phase.body}</p>
            </Card>
          ))}
        </div>
        <Disclaimer className="mt-8">{site.humanStatement}</Disclaimer>
      </Section>

      {relatedFrameworks.length > 0 ? (
        <Section tone="surface">
          <SectionHeading eyebrow="Frameworks" title="Relevant frameworks" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFrameworks.map((f) => (
              <Card key={f!.slug} interactive>
                <h3 className="font-semibold">{f!.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{f!.description}</p>
                <Link to={`/frameworks/${f!.slug}` as any} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {relatedFeatures.length > 0 ? (
        <Section>
          <SectionHeading eyebrow="Capabilities" title="Capabilities that matter most" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {relatedFeatures.map((f) => (
              <Card key={f.slug} interactive>
                <h3 className="font-semibold">{f.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{f.summary}</p>
                <Link to={f.path as any} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone="surface">
        <SectionHeading eyebrow="Next steps" title="Get started" />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/start" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Start free
          </Link>
          <Link to="/book-demo" className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface">
            Book a demo
          </Link>
        </div>
      </Section>

      <RelatedLinks
        title="Other solutions"
        items={solutions
          .filter((s) => s.slug !== solution.slug)
          .slice(0, 4)
          .map((s) => ({ label: s.name, to: s.path, description: s.summary }))}
      />

      <ConversionCta />
    </main>
  );
}
