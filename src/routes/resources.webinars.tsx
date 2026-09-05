import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/webinars")({
  head: () => ({
    ...pageMeta({
      title: "Webinars — NOVA Compliance",
      description: "On-demand webinars covering frameworks, evidence management, audit preparation and responsible AI.",
      path: "/resources/webinars",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Resources", to: "/resources" }, { label: "Webinars", to: "/resources/webinars" }]))],
  }),
  component: WebinarsPage,
});

function WebinarsPage() {
  const webinars = resources.filter((r) => r.type === "webinar");

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Webinars"
        description="Live and on-demand sessions about compliance programme design, evidence and readiness."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Webinars", to: "/resources/webinars" },
        ]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {webinars.map((w) => (
            <Card key={w.slug} interactive>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
                <Play aria-hidden="true" className="h-5 w-5 text-primary" />
              </div>
              <h2 className="mt-4 text-lg font-semibold">{w.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{w.summary}</p>
              {w.date ? <p className="mt-3 text-xs text-muted-foreground">{w.date}</p> : null}
              <Link to={`/resources/webinars/${w.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Watch <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
