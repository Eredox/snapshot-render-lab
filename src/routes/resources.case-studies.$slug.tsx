import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

const typeName = "Explainer";

export const Route = createFileRoute("/resources/case-studies/$slug")({
  loader: ({ params }) => {
    const study = resources.find((r) => r.type === typeName && r.slug === params.slug);
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
    <main>
      <PageHero eyebrow="Case studies" title="Case study not found" description="That case study does not exist." breadcrumbs={[{ label: "Case studies", to: "/resources/case-studies" }]} />
      <Section>
        <Link to="/resources/case-studies" className="text-primary underline">Back to case studies</Link>
      </Section>
    </main>
  );
}

function StudyDetail() {
  const { study } = Route.useLoaderData();
  const related = resources.filter((r) => r.type === typeName && r.slug !== study.slug).slice(0, 3);

  return (
    <main>
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
            {study.published ? <p className="text-sm text-muted-foreground">{study.published}</p> : null}
            <div className="mt-4 space-y-8">
              {study.sections?.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-semibold">{section.heading}</h2>
                  <div className="mt-3 space-y-3">
                    {section.paragraphs.map((para, i) => (
                      <p key={i} className="text-muted-foreground">{para}</p>
                    ))}
                  </div>
                  {section.points?.length ? (
                    <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                      {section.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
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
    </main>
  );
}
