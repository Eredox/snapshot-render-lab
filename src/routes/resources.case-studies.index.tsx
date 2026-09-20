import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { byType, resourcePath } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/case-studies/")({
  head: () => ({
    ...pageMeta({
      title: "Case studies — NOVA Compliance",
      description:
        "Customer case studies for NOVA Compliance will be published here once organisations have approved their stories for publication.",
      path: "/resources/case-studies",
    }),
    meta: [{ name: "robots", content: "noindex, follow" }],
    scripts: [
      ldScript(
        breadcrumbSchema([
          { label: "Resources", to: "/resources" },
          { label: "Case studies", to: "/resources/case-studies" },
        ]),
      ),
    ],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const studies = byType("Case study").filter((s) => s.status === "Published");

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="Case studies"
        description="Named customer stories are published only with the organisation's written approval."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Case studies", to: "/resources/case-studies" },
        ]}
      />

      <Section>
        {studies.length === 0 ? (
          <Card>
            <p className="text-muted-foreground">
              No case studies have been published. Eredox does not publish customer stories, names or outcomes
              without approval, so this page stays empty until a genuine study is approved.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              In the meantime, read the{" "}
              <Link to="/resources/blog" className="text-primary hover:underline">
                blog
              </Link>{" "}
              or the{" "}
              <Link to="/resources/guides" className="text-primary hover:underline">
                guides library
              </Link>
              .
            </p>
          </Card>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {studies.map((study) => (
              <Card key={study.slug} interactive>
                <h2 className="text-lg font-semibold">{study.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{study.summary}</p>
                <Link to={resourcePath(study) as any} className="mt-4 inline-flex text-sm font-medium text-primary hover:underline">
                  Read case study
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
