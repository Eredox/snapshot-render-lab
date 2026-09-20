import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Section, PageHero, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ResourceArticle } from "@/components/site/ResourceArticle";
import { resources, resourcePath, legacyResourceRedirects } from "@/data/resources";
import { articleMeta, breadcrumbSchema, blogPostingSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/blog/$slug")({
  loader: ({ params }) => {
    const legacy = legacyResourceRedirects[`/resources/blog/${params.slug}`];
    if (legacy) throw redirect({ to: legacy as any, statusCode: 301 });

    const post = resources.find((r) => r.slug === params.slug);
    if (post && post.type !== "Blog article") {
      throw redirect({ to: resourcePath(post) as any, statusCode: 301 });
    }
    if (!post || post.status !== "Published") throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return { meta: [{ title: "Article not found — NOVA Compliance" }, { name: "robots", content: "noindex" }] };
    }
    const path = resourcePath(post);
    const title = post.seoTitle ?? `${post.title} — NOVA Compliance Blog`;
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
            ...(post.category && { section: post.category }),
          }),
        ),
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Blog", to: "/resources/blog" },
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
        eyebrow="Blog"
        title="Article not found"
        description="That article does not exist or has not been published."
        breadcrumbs={[{ label: "Blog", to: "/resources/blog" }]}
      />
      <Section>
        <Link to="/resources/blog" className="text-primary underline">
          Back to the blog
        </Link>
      </Section>
    </main>
  );
}

function PostDetail() {
  const { post } = Route.useLoaderData();
  const related = resources
    .filter((r) => r.status === "Published" && r.slug !== post.slug)
    .slice(0, 3);

  return (
    <main>
      <PageHero
        eyebrow={post.category ?? "Blog"}
        title={post.title}
        description={post.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Blog", to: "/resources/blog" },
          { label: post.title, to: resourcePath(post) },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <ResourceArticle resource={post} />
          {related.length ? (
            <RelatedLinks
              className="mt-8"
              title="Related reading"
              items={related.map((r) => ({ label: r.title, to: resourcePath(r), description: r.summary }))}
            />
          ) : null}
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
