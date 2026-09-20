import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { publishedByType, plannedBlogTopics, resourcePath, publisher } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/blog/")({
  head: () => ({
    ...pageMeta({
      title: "NOVA Compliance Blog — Compliance, GRC & Assurance Insights",
      description:
        "Articles from Eredox on compliance frameworks, evidence management, control mapping, risk decisions and responsible AI-assisted assurance.",
      path: "/resources/blog",
    }),
    scripts: [
      ldScript(
        breadcrumbSchema([
          { label: "Resources", to: "/resources" },
          { label: "Blog", to: "/resources/blog" },
        ]),
      ),
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const posts = publishedByType("Blog article").sort((a, b) =>
    (b.published ?? "").localeCompare(a.published ?? ""),
  );

  return (
    <main>
      <PageHero
        eyebrow="Resources"
        title="NOVA Compliance blog"
        description="Practical writing on compliance frameworks, evidence, control mapping and responsible assurance, published by Eredox Pty Ltd."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Blog", to: "/resources/blog" },
        ]}
      />

      <Section>
        <div className="max-w-3xl">
          <p className="text-muted-foreground">
            Every article here is written to stand on its own: what a requirement asks for, how evidence is
            expected to look, and where a human decision is still required. Articles are published only once
            reviewed and approved — nothing appears here as a placeholder.
          </p>
        </div>

        {posts.length === 0 ? (
          <Card className="mt-8">
            <p className="text-muted-foreground">
              No articles have been published yet. Guides are available in the{" "}
              <Link to="/resources/guides" className="text-primary hover:underline">
                guides library
              </Link>
              , and you can contact Eredox for a NOVA compliance workflow demonstration.
            </p>
          </Card>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Card key={post.slug} interactive>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  {post.category ? <span className="font-medium text-primary">{post.category}</span> : null}
                  {post.published ? <time dateTime={post.published}>{post.published}</time> : null}
                  {post.readingTime ? <span>{post.readingTime}</span> : null}
                </div>
                <h2 className="mt-2 text-lg font-semibold">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{post.summary}</p>
                <Link
                  to={resourcePath(post) as any}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Read article <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </Card>
            ))}
          </div>
        )}
      </Section>

      <Section tone="surface">
        <SectionHeading
          title="Planned topics"
          description="Subjects in the editorial backlog. These are planning topics only and are not published articles."
        />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plannedBlogTopics.map((topic) => (
            <li key={topic.title} className="rounded-lg border border-border bg-background p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {topic.category}
              </p>
              <p className="mt-1 text-sm font-medium">{topic.title}</p>
            </li>
          ))}
        </ul>
        <Disclaimer className="mt-6">
          Articles are published by {publisher}. NOVA supports the readiness decision. Final launch and risk
          decisions remain human decisions.
        </Disclaimer>
      </Section>

      <ConversionCta />
    </main>
  );
}
