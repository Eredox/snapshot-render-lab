import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { legalDocs, getLegalDoc, legalPendingNote } from "@/data/legal";
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
    const path = `/legal/${doc.slug}`;
    return {
      ...pageMeta({
        title: `${doc.title} — NOVA Compliance`,
        description: doc.summary,
        path,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Legal", to: "/legal" },
            { label: doc.title, to: path },
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
    <main>
      <PageHero eyebrow="Legal" title="Document not found" description="That legal document does not exist." breadcrumbs={[{ label: "Legal", to: "/legal" }]} />
      <Section>
        <Link to="/legal" className="text-primary underline">Back to legal</Link>
      </Section>
    </main>
  );
}

function LegalDetail() {
  const { doc } = Route.useLoaderData();
  const related = legalDocs.filter((d) => d.slug !== doc.slug).slice(0, 3);
  const path = `/legal/${doc.slug}`;

  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title={doc.title}
        description={doc.summary}
        breadcrumbs={[
          { label: "Legal", to: "/legal" },
          { label: doc.title, to: path },
        ]}
      />

      <Section>
        <div className="mx-auto max-w-3xl">
          {doc.status === "Approved content pending" ? (
            <Disclaimer className="mb-8">{legalPendingNote}</Disclaimer>
          ) : null}
          <Card>
            {doc.lastReviewed ? <p className="text-sm text-muted-foreground">Last reviewed: {doc.lastReviewed}</p> : null}
            <div className="mt-4 space-y-8">
              {doc.sections.map((section) => (
                <section key={section.heading}>
                  <h2 className="text-xl font-semibold">{section.heading}</h2>
                  <p className="mt-2 text-muted-foreground">{section.description}</p>
                  {section.body?.length ? (
                    <div className="mt-3 space-y-3">
                      {section.body.map((para, i) => (
                        <p key={i} className="text-sm text-muted-foreground">{para}</p>
                      ))}
                    </div>
                  ) : null}
                </section>
              ))}
            </div>
          </Card>
          <RelatedLinks className="mt-8" title="Related documents" items={related.map((d) => ({ label: d.title, to: `/legal/${d.slug}`, description: d.summary }))} />
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
