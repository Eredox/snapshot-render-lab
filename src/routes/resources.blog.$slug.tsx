import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/blog/$slug")({
  loader: ({ params }) => {
    const post = resources.find((r) => r.type === "blog" && r.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Article not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${post.title} — NOVA Compliance Blog`,
        description: post.summary,
        path: `/resources/blog/${post.slug}`,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Blog", to: "/resources/blog" },
            { label: post.title, to: `/resources/blog/${post.slug}` },
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
    <>
      <PageHero eyebrow="Blog" title="Article not found" description="That article does not exist." breadcrumbs={[{ label: "Blog", to: "/resources/blog" }]} />
      <Section>
        <Link to="/resources/blog" className="text-primary underline">Back to blog</Link>
      </Section>
    </>
  );
}

function PostDetail() {
  const { post } = Route.useLoaderData();
  const related = resources.filter((r) => r.type === "blog" && r.slug !== post.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title={post.title}
        description={post.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Blog", to: "/resources/blog" },
          { label: post.title, to: `/resources/blog/${post.slug}` },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Card>
            {post.date ? <p className="text-sm text-muted-foreground">{post.date}</p> : null}
            <div className="prose prose-sm mt-4 max-w-none">
              {post.content?.split("\n\n").map((para, i) => (
                <p key={i} className="text-muted-foreground">{para}</p>
              ))}
            </div>
          </Card>
          <RelatedLinks
            className="mt-8"
            title="More articles"
            items={related.map((r) => ({ label: r.title, to: `/resources/blog/${r.slug}`, description: r.summary }))}
          />
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
