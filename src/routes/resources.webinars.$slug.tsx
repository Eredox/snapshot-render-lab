import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Section, PageHero } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ResourceArticle } from "@/components/site/ResourceArticle";
import { resources, resourcePath, legacyResourceRedirects } from "@/data/resources";
import { articleMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/webinars/$slug")({
  loader: ({ params }) => {
    const legacy = legacyResourceRedirects[`/resources/webinars/${params.slug}`];
    if (legacy) throw redirect({ to: legacy as any, statusCode: 301 });

    const webinar = resources.find((r) => r.slug === params.slug);
    if (webinar && webinar.type !== "Webinar") {
      throw redirect({ to: resourcePath(webinar) as any, statusCode: 301 });
    }
    if (!webinar || webinar.status !== "Published") throw notFound();
    return { webinar };
  },
  head: ({ loaderData }) => {
    const webinar = loaderData?.webinar;
    if (!webinar) {
      return { meta: [{ title: "Webinar not found — NOVA Compliance" }, { name: "robots", content: "noindex" }] };
    }
    const path = resourcePath(webinar);
    return {
      ...articleMeta({
        title: webinar.seoTitle ?? `${webinar.title} — NOVA Compliance Webinars`,
        description: webinar.seoDescription ?? webinar.summary,
        path,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Webinars", to: "/resources/webinars" },
            { label: webinar.title, to: path },
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
      <PageHero
        eyebrow="Webinars"
        title="Webinar not found"
        description="That webinar does not exist or has not been published."
        breadcrumbs={[{ label: "Webinars", to: "/resources/webinars" }]}
      />
      <Section>
        <Link to="/resources/webinars" className="text-primary underline">
          Back to webinars
        </Link>
      </Section>
    </main>
  );
}

function WebinarDetail() {
  const { webinar } = Route.useLoaderData();

  return (
    <main>
      <PageHero
        eyebrow="Webinars"
        title={webinar.title}
        description={webinar.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Webinars", to: "/resources/webinars" },
          { label: webinar.title, to: resourcePath(webinar) },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <ResourceArticle resource={webinar} />
          <p className="mt-6 text-sm text-muted-foreground">
            Registration or replay access is managed through Eredox.
          </p>
        </div>
      </Section>
      <ConversionCta />
    </main>
  );
}
