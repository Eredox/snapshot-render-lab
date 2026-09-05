import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/webinars/$slug")({
  loader: ({ params }) => {
    const webinar = resources.find((r) => r.type === "webinar" && r.slug === params.slug);
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
    <>
      <PageHero eyebrow="Webinars" title="Webinar not found" description="That webinar does not exist." breadcrumbs={[{ label: "Webinars", to: "/resources/webinars" }]} />
      <Section>
        <Link to="/resources/webinars" className="text-primary underline">Back to webinars</Link>
      </Section>
    </>
  );
}

function WebinarDetail() {
  const { webinar } = Route.useLoaderData();
  const related = resources.filter((r) => r.type === "webinar" && r.slug !== webinar.slug).slice(0, 3);

  return (
    <>
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
            {webinar.date ? <p className="text-sm text-muted-foreground">{webinar.date}</p> : null}
            <div className="prose prose-sm mt-4 max-w-none">
              {webinar.content?.split("\n\n").map((para, i) => (
                <p key={i} className="text-muted-foreground">{para}</p>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">Registration or replay access is managed through Eredox.</p>
          </Card>
          <RelatedLinks
            className="mt-8"
            title="More webinars"
            items={related.map((r) => ({ label: r.title, to: `/resources/webinars/${r.slug}`, description: r.summary }))}
          />
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
