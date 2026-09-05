import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { legalDocs, getLegalDoc } from "@/data/legal";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/legal/$slug")({
  loader: ({ params }) => {
    const doc = getLegalDoc(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => {
    const doc = loaderData?.doc;
    if (!doc) {
      return {
        meta: [{ title: "Document not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${doc.title} — NOVA Compliance`,
        description: doc.summary,
        path: doc.path,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Legal", to: "/legal" },
            { label: doc.title, to: doc.path },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: LegalNotFound,
  component: LegalDetail,
});

function LegalNotFound() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Document not found" description="That legal document does not exist." breadcrumbs={[{ label: "Legal", to: "/legal" }]} />
      <Section>
        <Link to="/legal" className="text-primary underline">Back to legal</Link>
      </Section>
    </>
  );
}

function LegalDetail() {
  const { doc } = Route.useLoaderData();
  const related = legalDocs.filter((d) => d.slug !== doc.slug).slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow="Legal"
        title={doc.title}
        description={doc.summary}
        breadcrumbs={[
          { label: "Legal", to: "/legal" },
          { label: doc.title, to: doc.path },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          <Card>
            {doc.lastUpdated ? <p className="text-sm text-muted-foreground">Last updated: {doc.lastUpdated}</p> : null}
            <div className="prose prose-sm mt-4 max-w-none">
              {doc.content?.split("\n\n").map((para, i) => (
                <p key={i} className="text-muted-foreground">{para}</p>
              ))}
            </div>
          </Card>
          <RelatedLinks className="mt-8" title="Related documents" items={related.map((d) => ({ label: d.title, to: d.path, description: d.summary }))} />
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
