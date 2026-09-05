import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/blog")({
  head: () => ({
    ...pageMeta({
      title: "Blog — NOVA Compliance",
      description: "Articles on compliance programmes, evidence management, framework mapping and responsible assurance.",
      path: "/resources/blog",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Resources", to: "/resources" }, { label: "Blog", to: "/resources/blog" }]))],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = resources.filter((r) => r.type === "blog");

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Blog"
        description="Practical perspectives on running a governed, evidence-led compliance programme."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Blog", to: "/resources/blog" },
        ]}
      />

      <Section>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card key={post.slug} interactive>
              {post.date ? <p className="text-xs text-muted-foreground">{post.date}</p> : null}
              <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.summary}</p>
              <Link to={`/resources/blog/${post.slug}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read article <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
