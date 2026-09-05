import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/guides/$slug")({
  loader: ({ params }) => {
    const guide = resources.find((r) => r.type === "guide" && r.slug === params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    const guide = loaderData?.guide;
    if (!guide) {
      return {
        meta: [{ title: "Guide not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${guide.title} — NOVA Compliance Guides`,
        description: guide.summary,
        path: `/resources/guides/${guide.slug}`,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Guides", to: "/resources/guides" },
            { label: guide.title, to: `/resources/guides/${guide.slug}` },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: GuideNotFound,
  component: GuideDetail,
});

function GuideNotFound() {
  return (
    <>
      <PageHero eyebrow="Guides" title="Guide not found" description="That guide does not exist." breadcrumbs={[{ label: "Guides", to: "/resources/guides" }]} />
      <Section>
        <Link to="/resources/guides" className="text-primary underline">Back to guides</Link>
      </Section>
    </>
  );
}

function GuideDetail() {
  const { guide } = Route.useLoaderData();
  const related = resources.filter((r) => r.type === "guide" && r.slug !== guide.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Guides"
        title={guide.title}
        description={guide.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Guides", to: "/resources/guides" },
          { label: guide.title, to: `/resources/guides/${guide.slug}` },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Card>
            <div className="prose prose-sm max-w-none">
              {guide.content?.split("\n\n").map((para, i) => (
                <p key={i} className="text-muted-foreground">{para}</p>
              ))}
            </div>
          </Card>
          <RelatedLinks
            className="mt-8"
            title="More guides"
            items={related.map((r) => ({ label: r.title, to: `/resources/guides/${r.slug}`, description: r.summary }))}
          />
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
