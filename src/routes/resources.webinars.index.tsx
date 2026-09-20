import { createFileRoute, Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { Section, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { byType, resourcePath } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

const base = pageMeta({
  title: "Webinars — NOVA Compliance",
  description:
    "Live and on-demand NOVA Compliance sessions will be listed here once sessions are scheduled and approved for publication.",
  path: "/resources/webinars",
});

export const Route = createFileRoute("/resources/webinars/")({
  head: () => ({
    ...base,
    meta: [...base.meta, { name: "robots", content: "noindex, follow" }],
    scripts: [
      ldScript(
        breadcrumbSchema([
          { label: "Resources", to: "/resources" },
          { label: "Webinars", to: "/resources/webinars" },
        ]),
      ),
    ],
  }),
  component: WebinarsPage,
});

function WebinarsPage() {
  const webinars = byType("Webinar").filter((w) => w.status === "Published");

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Webinars"
        description="Sessions about compliance programme design, evidence and readiness."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Webinars", to: "/resources/webinars" },
        ]}
      />

      <Section>
        {webinars.length === 0 ? (
          <Card>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft">
              <Play aria-hidden="true" className="h-5 w-5 text-primary" />
            </div>
            <p className="mt-4 text-muted-foreground">
              No webinars are scheduled. Written material is available in the{" "}
              <Link to="/resources/blog" className="text-primary hover:underline">
                blog
              </Link>{" "}
              and{" "}
              <Link to="/resources/guides" className="text-primary hover:underline">
                guides
              </Link>
              , and Eredox runs live walkthroughs on request.
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {webinars.map((w) => (
              <Card key={w.slug} interactive>
                <h2 className="text-lg font-semibold">{w.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{w.summary}</p>
                <Link to={resourcePath(w) as any} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
                  Watch
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <ConversionCta />
    </main>
  );
}
