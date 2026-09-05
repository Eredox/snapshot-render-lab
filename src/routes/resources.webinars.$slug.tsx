import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

const typeName = "Guide";

export const Route = createFileRoute("/resources/webinars/$slug")({
  loader: ({ params }) => {
    const webinar = resources.find((r) => r.type === typeName && r.slug === params.slug);
    if (!webinar) throw notFound();
    return { webinar };
  },
  head: ({ loaderData }) => {
    const webinar = loaderData?.webinar;
    if (!webinar) {
      return {
        meta: [{ title: "Webinar not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${webinar.title} — NOVA Compliance Webinars`,
        description: webinar.summary,
        path: `/resources/webinars/${webinar.slug}`,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Webinars", to: "/resources/webinars" },
            { label: webinar.title, to: `/resources/webinars/${webinar.slug}` },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: WebinarNotFound,
  component: WebinarDetail,
});

function WebinarNotFound() {
  return (
    <main>
      <PageHero eyebrow="Webinars" title="Webinar not found" description="That webinar does not exist." breadcrumbs={[{ label: "Webinars", to: "/resources/webinars" }]} />
      <Section>
        <Link to="/resources/webinars" className="text-primary underline">Back to webinars</Link>
      </Section>
    </main>
  );
}

function WebinarDetail() {
  const { webinar } = Route.useLoaderData();
  const related = resources.filter((r) => r.type === typeName && r.slug !== webinar.slug).slice(0, 3);

  return (
    <main>
      <PageHero
        eyebrow="Webinars"
        title={webinar.title}
        description={webinar.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Webinars", to: "/resources/webinars" },
          { label: webinar.title, to: `/resources/webinars/${webinar.slug}` },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Card>
            {webinar.published ? <p className="text-sm text-muted-foreground">{webinar.published}</p> : null}
            {webinar.readingTime ? <p className="text-sm text-muted-foreground">{webinar.readingTime}</p> : null}
            <div className="mt-4 space-y-8">
              {webinar.sections?.map((section) => (
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
            <p className="mt-8 text-sm text-muted-foreground">Registration or replay access is managed through Eredox.</p>
          </Card>
          <RelatedLinks
            className="mt-8"
            title="More webinars"
            items={related.map((r) => ({ label: r.title, to: `/resources/webinars/${r.slug}`, description: r.summary }))}
          />
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
