import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Section, PageHero } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ResourceArticle } from "@/components/site/ResourceArticle";
import { resources, resourcePath } from "@/data/resources";
import { articleMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/product-updates/$slug")({
  loader: ({ params }) => {
    const update = resources.find((r) => r.slug === params.slug);
    if (update && update.type !== "Product update") {
      throw redirect({ to: resourcePath(update) as any, statusCode: 301 });
    }
    if (!update || update.status !== "Published") throw notFound();
    return { update };
  },
  head: ({ loaderData }) => {
    const update = loaderData?.update;
    if (!update) {
      return { meta: [{ title: "Update not found — NOVA Compliance" }, { name: "robots", content: "noindex" }] };
    }
    const path = resourcePath(update);
    return {
      ...articleMeta({
        title: update.seoTitle ?? `${update.title} — NOVA Compliance product updates`,
        description: update.seoDescription ?? update.summary,
        path,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Product updates", to: "/resources/product-updates" },
            { label: update.title, to: path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: UpdateNotFound,
  component: UpdateDetail,
});

function UpdateNotFound() {
  return (
    <main>
      <PageHero
        eyebrow="Product updates"
        title="Update not found"
        description="That release note does not exist or has not been published."
        breadcrumbs={[{ label: "Product updates", to: "/resources/product-updates" }]}
      />
      <Section>
        <Link to="/resources/product-updates" className="text-primary underline">
          Back to product updates
        </Link>
      </Section>
    </main>
  );
}

function UpdateDetail() {
  const { update } = Route.useLoaderData();

  return (
    <main>
      <PageHero
        eyebrow="Product updates"
        title={update.title}
        description={update.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Product updates", to: "/resources/product-updates" },
          { label: update.title, to: resourcePath(update) },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <ResourceArticle resource={update} />
        </div>
      </Section>
      <ConversionCta />
    </main>
  );
}
