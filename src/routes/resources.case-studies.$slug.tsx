import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/case-studies/$slug")({
  loader: ({ params }) => {
    const study = resources.find((r) => r.type === "case-study" && r.slug === params.slug);
    if (!study) throw notFound();
    return { study };
  },
  head: ({ loaderData }) => {
    const study = loaderData?.study;
    if (!study) {
      return {
        meta: [{ title: "Case study not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${study.title} — NOVA Compliance Case Studies`,
        description: study.summary,
        path: `/resources/case-studies/${study.slug}`,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Case studies", to: "/resources/case-studies" },
            { label: study.title, to: `/resources/case-studies/${study.slug}` },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: StudyNotFound,
  component: StudyDetail,
});

function StudyNotFound() {
  return (
    <>
      <PageHero eyebrow="Case studies" title="Case study not found" description="That case study does not exist." breadcrumbs={[{ label: "Case studies", to: "/resources/case-studies" }]} />
      <Section>
        <Link to="/resources/case-studies" className="text-primary underline">Back to case studies</Link>
      </Section>
    </>
  );
}

function StudyDetail() {
  const { study } = Route.useLoaderData();
  const related = resources.filter((r) => r.type === "case-study" && r.slug !== study.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Case studies"
        title={study.title}
        description={study.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Case studies", to: "/resources/case-studies" },
          { label: study.title, to: `/resources/case-studies/${study.slug}` },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Card>
            <div className="prose prose-sm max-w-none">
              {study.content?.split("\n\n").map((para, i) => (
                <p key={i} className="text-muted-foreground">{para}</p>
              ))}
            </div>
          </Card>
          <RelatedLinks
            className="mt-8"
            title="More case studies"
            items={related.map((r) => ({ label: r.title, to: `/resources/case-studies/${r.slug}`, description: r.summary }))}
          />
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
