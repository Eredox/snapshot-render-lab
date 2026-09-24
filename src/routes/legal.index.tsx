import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { publicLegalDocs } from "@/data/legal";
import { publishedLegalDocuments } from "@/data/legal-published";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

type LegalRouteTo = NonNullable<ComponentProps<typeof Link>["to"]>;
const legalRouteTo = (path: string): LegalRouteTo => path as LegalRouteTo;

export const Route = createFileRoute("/legal/")({
  head: () => ({
    ...pageMeta({
      title: "Legal Centre | NOVA Compliance",
      description:
        "Legal documents, policies and agreements for NOVA Compliance customers and partners.",
      path: "/legal",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Legal", to: "/legal" }]))],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <main>
      <PageHero
        eyebrow="Legal"
        title="Legal documents"
        description="Terms of service, privacy policy, data processing, cookies, acceptable use and other legal documents for NOVA."
        breadcrumbs={[{ label: "Legal", to: "/legal" }]}
      />

      <Section>
        <div className="mb-8 rounded-xl border border-border bg-primary-soft/40 p-6">
          <h2 className="text-lg font-semibold">Current customer documents</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The current Terms and Privacy Policy are published here in full, with their version,
            effective date and global applicability shown on each document.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {publishedLegalDocuments.map((doc) => (
            <Card key={doc.metadata.document_key} interactive>
              <h2 className="text-lg font-semibold">{doc.metadata.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Version {doc.metadata.version} · Effective {doc.metadata.effective_date} · Global
              </p>
              <Link
                to={legalRouteTo(
                  `/legal/${doc.metadata.document_type === "terms_and_conditions" ? "terms" : "privacy"}`,
                )}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Read in full <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
          {publicLegalDocs.map((doc) => (
            <Card key={doc.slug} interactive>
              <h2 className="text-lg font-semibold">{doc.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{doc.summary}</p>
              <Link
                to={legalRouteTo(`/legal/${doc.slug}`)}
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Read <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading
          title="Questions about legal documents?"
          description="Contact Eredox through the contact page for any legal or procurement enquiries."
        />
        <div className="mt-6">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Contact us
          </Link>
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
