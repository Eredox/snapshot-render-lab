import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { legalDocs } from "@/data/legal";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/legal")({
  head: () => ({
    ...pageMeta({
      title: "Legal — NOVA Compliance",
      description: "Legal documents, policies and agreements for NOVA Compliance customers and partners.",
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {legalDocs.map((doc) => (
            <Card key={doc.slug} interactive>
              <h2 className="text-lg font-semibold">{doc.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{doc.summary}</p>
              <Link to={`/legal/${doc.slug}` as any} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Questions about legal documents?" description="Contact Eredox through the contact page for any legal or procurement enquiries." />
        <div className="mt-6">
          <Link to="/contact" className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            Contact us
          </Link>
        </div>
      </Section>

      <ConversionCta />
    </main>
  );
}
