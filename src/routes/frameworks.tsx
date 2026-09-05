import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { frameworks, illustrativeReadiness } from "@/data/frameworks";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/frameworks")({
  head: () => ({
    ...pageMeta({
      title: "Frameworks — NOVA Compliance",
      description: "Compliance frameworks available and planned in NOVA, with availability status, readiness views and honest scope handling.",
      path: "/frameworks",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Frameworks", to: "/frameworks" }]))],
  }),
  component: FrameworksPage,
});

const related = [
  { label: "Features", to: "/features", description: "All capabilities" },
  { label: "Platform overview", to: "/platform", description: "How the parts connect" },
  { label: "Pricing", to: "/pricing", description: "Plans and entitlements" },
];

function FrameworksPage() {
  const available = frameworks.filter((f) => f.availability === "Available now");
  const planned = frameworks.filter((f) => f.availability !== "Available now");

  return (
    <>
      <PageHero
        eyebrow="Frameworks"
        title="Activate the frameworks that apply to you"
        description="NOVA maps requirements from each framework onto a shared control set. Evidence collected once can support multiple frameworks where it genuinely satisfies the control."
        breadcrumbs={[{ label: "Frameworks", to: "/frameworks" }]}
      />

      <Section>
        <SectionHeading eyebrow="Available now" title="Ready to activate" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((f) => (
            <Card key={f.slug} interactive>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{f.name}</h2>
                <AvailabilityBadge value={f.availability} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{f.description}</p>
              <Link to={`/frameworks/${f.slug}` as any} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Explore <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Roadmap" title="Planned frameworks" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {planned.map((f) => (
            <Card key={f.slug} interactive>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{f.name}</h2>
                <AvailabilityBadge value={f.availability} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{f.description}</p>
              <Link to={`/frameworks/${f.slug}` as any} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Readiness" title="Illustrative readiness reporting" />
            <p className="mt-4 text-muted-foreground">{site.illustrativeCaption}</p>
            <ul className="mt-6 space-y-3">
              {[
                "Controls mapped across activated frameworks",
                "Evidence status shown by control and requirement",
                "Gaps surfaced before an external assessment",
                "Freshness expectations keep evidence current",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link to="/features" className="text-primary underline">
                Learn about reporting
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Example readiness snapshot</h3>
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
        <Disclaimer className="mt-8">{site.frameworkDisclaimer}</Disclaimer>
      </Section>

      <Section tone="surface">
        <RelatedLinks title="Related areas" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
