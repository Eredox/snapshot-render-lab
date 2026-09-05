import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

const typeName = "Guide";

export const Route = createFileRoute("/resources/guides")({
  head: () => ({
    ...pageMeta({
      title: "Guides — NOVA Compliance",
      description: "Step-by-step guides for getting started with frameworks, evidence collection and readiness reporting.",
      path: "/resources/guides",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Resources", to: "/resources" }, { label: "Guides", to: "/resources/guides" }]))],
  }),
  component: GuidesIndex,
});

function GuidesIndex() {
  const guides = resources.filter((r) => r.type === typeName);

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Guides"
        description="Practical guides for setting up your compliance programme in NOVA and keeping it current."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Guides", to: "/resources/guides" },
        ]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Card key={guide.slug} interactive>
              <h2 className="text-lg font-semibold">{guide.title}</h2>
              {guide.readingTime ? <p className="mt-1 text-xs text-muted-foreground">{guide.readingTime}</p> : null}
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{guide.summary}</p>
              <Link to={`/resources/guides/${guide.slug}` as any} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read guide <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
