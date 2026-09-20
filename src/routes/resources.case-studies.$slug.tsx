import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Section, PageHero } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ResourceArticle } from "@/components/site/ResourceArticle";
import { resources, resourcePath, legacyResourceRedirects } from "@/data/resources";
import { articleMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/resources/case-studies/$slug")({
  loader: ({ params }) => {
    const legacy = legacyResourceRedirects[`/resources/case-studies/${params.slug}`];
    if (legacy) throw redirect({ to: legacy as any, statusCode: 301 });

    const study = resources.find((r) => r.slug === params.slug);
    if (study && study.type !== "Case study") {
      throw redirect({ to: resourcePath(study) as any, statusCode: 301 });
    }
    if (!study || study.status !== "Published") throw notFound();
    return { study };
  },
  head: ({ loaderData }) => {
    const study = loaderData?.study;
    if (!study) {
      return {
        meta: [{ title: "Case study not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    const path = resourcePath(study);
    return {
      ...articleMeta({
        title: study.seoTitle ?? `${study.title} — NOVA Compliance Case Studies`,
        description: study.seoDescription ?? study.summary,
        path,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Resources", to: "/resources" },
            { label: "Case studies", to: "/resources/case-studies" },
            { label: study.title, to: path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: StudyNotFound,
  component: StudyDetail,
});

function StudyNotFound() {
  return (
    <main>
      <PageHero
        eyebrow="Case studies"
        title="Case study not found"
        description="That case study does not exist or has not been published."
        breadcrumbs={[{ label: "Case studies", to: "/resources/case-studies" }]}
      />
      <Section>
        <Link to="/resources/case-studies" className="text-primary underline">
          Back to case studies
        </Link>
      </Section>
    </main>
  );
}

function StudyDetail() {
  const { study } = Route.useLoaderData();

  return (
    <main>
      <PageHero
        eyebrow="Case studies"
        title={study.title}
        description={study.summary}
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "Case studies", to: "/resources/case-studies" },
          { label: study.title, to: resourcePath(study) },
        ]}
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <ResourceArticle resource={study} />
        </div>
      </Section>
      <ConversionCta />
    </main>
  );
}
