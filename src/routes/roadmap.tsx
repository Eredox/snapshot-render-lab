import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { roadmapEntries, roadmapStatusOrder, roadmapNote } from "@/data/roadmap";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    ...pageMeta({
      title: "Product roadmap — NOVA Compliance",
      description:
        "What is available in NOVA today, what is partly available, and what is planned next across capabilities and frameworks.",
      path: "/roadmap",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Roadmap", to: "/roadmap" }]))],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Roadmap"
        title="Where NOVA is heading"
        description="An honest view of what NOVA does today and what is planned next. Planned items are labelled clearly and are never represented as operational."
        breadcrumbs={[{ label: "Roadmap", to: "/roadmap" }]}
      />

      {roadmapStatusOrder.map((status, i) => {
        const entries = roadmapEntries.filter((e) => e.status === status);
        if (!entries.length) return null;
        return (
          <Section key={status} {...(i % 2 === 1 ? { tone: "surface" as const } : {})}>
            <SectionHeading title={status} description={`${entries.length} items`} />
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {entries.map((e) => (
                <Card key={`${e.area}-${e.title}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{e.area}</p>
                      <h3 className="mt-1 text-lg font-semibold">{e.title}</h3>
                    </div>
                    <AvailabilityBadge value={e.status} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{e.description}</p>
                  <Link
                    to={e.to as any}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    Learn more <ArrowRight className="h-4 w-4" />
                  </Link>
                </Card>
              ))}
            </div>
          </Section>
        );
      })}

      <Section>
        <Disclaimer>{roadmapNote}</Disclaimer>
        <p className="mt-6 text-muted-foreground">
          Have a framework or capability you would like prioritised?{" "}
          <Link to="/contact" className="text-primary underline">
            Tell us through the contact page
          </Link>
          .
        </p>
      </Section>

      <ConversionCta />
    </>
  );
}
