import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

const typeName = "Guide";

export const Route = createFileRoute("/resources/guides/$slug")({
  loader: ({ params }) => {
    const post = resources.find((r) => r.type === typeName && r.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Guide not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${post.title} — NOVA Compliance`,
        description: post.summary,
        path: `/resources/guides/${post.slug}`,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Guides", to: "/resources/guides" },
            { label: post.title, to: `/resources/guides/${post.slug}` },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: PostNotFound,
  component: PostDetail,
});

function PostNotFound() {
  return (
    <main>
      <PageHero eyebrow="Guides" title="Guide not found" description="That guide does not exist." breadcrumbs={[{ label: "Guides", to: "/resources/guides" }]} />
      <Section>
        <Link to="/resources/guides" className="text-primary underline">Back to guides</Link>
      </Section>
    </main>
  );
}

function PostDetail() {
  const { post } = Route.useLoaderData();
  const related = resources.filter((r) => r.type === typeName && r.slug !== post.slug).slice(0, 3);

  return (
    <main>
      <PageHero
        eyebrow="Guides"
        title={post.title}
        description={post.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Guides", to: "/resources/guides" },
          { label: post.title, to: `/resources/guides/${post.slug}` },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Card>
            {post.published ? <p className="text-sm text-muted-foreground">{post.published}</p> : null}
            {post.readingTime ? <p className="text-sm text-muted-foreground">{post.readingTime}</p> : null}
            <div className="mt-4 space-y-8">
              {post.sections?.map((section) => (
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
            title="More guides"
            items={related.map((r) => ({ label: r.title, to: `/resources/guides/${r.slug}`, description: r.summary }))}
          />
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
