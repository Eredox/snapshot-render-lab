import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    ...pageMeta({
      title: "Testimonials — NOVA Compliance",
      description: "Customer feedback will be published here only after Eredox has approved genuine, attributable public feedback.",
      path: "/testimonials",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Testimonials", to: "/testimonials" }]))],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  return (
    <main>
      <PageHero
        eyebrow="Customers"
        title="Customer feedback"
        description="Eredox does not publish unattributed or unapproved customer quotations. This page will be updated when genuine public feedback is approved."
        breadcrumbs={[{ label: "Testimonials", to: "/testimonials" }]}
      />

      <Section>
        <Card>
          <h2 className="text-lg font-semibold">No approved testimonials published</h2>
          <p className="mt-3 text-muted-foreground">
            Illustrative customer scenarios are not testimonials and are kept separate from genuine
            attributable feedback. Speak with the NOVA team to discuss your own requirements.
          </p>
        </Card>
      </Section>

      <Section tone="surface">
        <RelatedLinks
          title="Explore more"
          items={[
            { label: "Case studies", to: "/resources/case-studies", description: "Detailed examples" },
            { label: "Customers", to: "/customers", description: "How teams use NOVA" },
            { label: "Book a demo", to: "/book-demo", description: "See it for yourself" },
          ]}
        />
      </Section>

      <ConversionCta />
    </main>
  );
}
