import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { features } from "@/data/features";
import { site } from "@/config/site";
import { pageMeta, ldScript, breadcrumbSchema } from "@/lib/seo";

export const Route = createFileRoute("/features/")({
  head: () => ({
    ...pageMeta({
      title: "Features — NOVA Compliance",
      description: "Every capability in the NOVA workspace, from framework management and evidence to AI assistance, reporting and auditor collaboration.",
      path: "/features",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Features", to: "/features" }]))],
  }),
  component: FeaturesPage,
});

const related = [
  { label: "Platform overview", to: "/platform", description: "How the parts connect" },
  { label: "Frameworks", to: "/frameworks", description: "Coverage and availability" },
  { label: "Integrations", to: "/integrations", description: "Connectors and status" },
  { label: "Pricing", to: "/pricing", description: "Plans and entitlements" },
];

function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Everything you need to run a governed compliance programme"
        description="Each feature area is described with its workflow, capabilities, and what the human team remains responsible for."
        breadcrumbs={[{ label: "Features", to: "/features" }]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.slug} interactive>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{f.name}</h2>
                <AvailabilityBadge value={f.availability} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{f.summary}</p>
              <p className="mt-4 text-sm text-muted-foreground">{f.problem}</p>
              <Link to={f.path} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Explore {f.name.toLowerCase()} <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">{site.humanStatement}</p>
      </Section>

      <Section tone="surface">
        <RelatedLinks title="Also see" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
