import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ComponentProps } from "react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { publishedLegalRegistry } from "@/data/legal-registry";
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
          <h2 className="text-lg font-semibold">Published customer documents</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            The documents below are the current public NOVA legal estate. Published Terms and
            Privacy are available in full; supporting public policies describe their current scope
            and status.
          </p>
        </div>
        <div className="space-y-10">
          {[
            { id: "core-agreements", title: "Core agreements", slugs: ["terms", "privacy"] },
            { id: "data-technology", title: "Data & technology", slugs: ["cookies"] },
            { id: "company-commitments", title: "Company commitments", slugs: ["accessibility"] },
          ].map((group) => {
            const documents = publishedLegalRegistry.filter((document) =>
              group.slugs.includes(document.slug),
            );
            return (
              <section key={group.id} aria-labelledby={`legal-group-${group.id}`}>
                <h2 id={`legal-group-${group.id}`} className="text-xl font-semibold">
                  {group.title}
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {documents.map((document) => (
                    <Card key={document.route} interactive>
                      <h3 className="text-lg font-semibold">{document.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{document.summary}</p>
                      <p className="mt-3 text-xs text-muted-foreground">
                        Version {document.version} · Effective {document.effectiveDate}
                      </p>
                      <Link
                        to={legalRouteTo(document.route)}
                        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                      >
                        {document.slug === "terms" || document.slug === "privacy"
                          ? "Read in full"
                          : "Read policy"}{" "}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </Link>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
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
