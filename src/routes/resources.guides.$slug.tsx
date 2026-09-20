import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Section, PageHero, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ResourceArticle } from "@/components/site/ResourceArticle";
import { resources, resourcePath, publishedByType } from "@/data/resources";
import { articleMeta, breadcrumbSchema, blogPostingSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/guides/$slug")({
  loader: ({ params }) => {
    const post = resources.find((r) => r.slug === params.slug);
    if (post && post.type !== "Guide") {
      throw redirect({ to: resourcePath(post) as any, statusCode: 301 });
    }
    if (!post || post.status !== "Published") throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Guide not found — NOVA Compliance" }, { name: "robots", content: "noindex" }] };
    }
    const path = resourcePath(post);
    const title = post.seoTitle ?? `${post.title} — NOVA Compliance Guides`;
    const description = post.seoDescription ?? post.summary;
    return {
      ...articleMeta({ title, description, path }),
      scripts: [
        ldScript(
          blogPostingSchema({
            title: post.title,
            description,
            path,
            ...(post.published && { published: post.published }),
            ...(post.modified && { modified: post.modified }),
            section: "Guide",
          }),
        ),
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Guides", to: "/resources/guides" },
            { label: post.title, to: path },
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
      <PageHero
        eyebrow="Guides"
        title="Guide not found"
        description="That guide does not exist or has not been published."
        breadcrumbs={[{ label: "Guides", to: "/resources/guides" }]}
      />
      <Section>
        <Link to="/resources/guides" className="text-primary underline">
          Back to guides
        </Link>
      </Section>
    </main>
  );
}

function PostDetail() {
  const { post } = Route.useLoaderData();
  const related = publishedByType("Guide")
    .filter((r) => r.slug !== post.slug)
    .slice(0, 3);

  return (
    <main>
      <PageHero
        eyebrow="Guides"
        title={post.title}
        description={post.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Guides", to: "/resources/guides" },
          { label: post.title, to: resourcePath(post) },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <ResourceArticle resource={post} />
          {related.length ? (
            <RelatedLinks
              className="mt-8"
              title="More guides"
              items={related.map((r) => ({ label: r.title, to: resourcePath(r), description: r.summary }))}
            />
          ) : null}
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
