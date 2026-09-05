import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Quote } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { resources } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    ...pageMeta({
      title: "Testimonials — NOVA Compliance",
      description: "What customers say about using NOVA Compliance for evidence-led compliance programmes.",
      path: "/testimonials",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Testimonials", to: "/testimonials" }]))],
  }),
  component: TestimonialsPage,
});

function TestimonialsPage() {
  const testimonials = resources.filter((r) => r.type === "testimonial");

  return (
    <>
      <PageHero
        eyebrow="Customers"
        title="What customers say"
        description="Feedback from teams using NOVA to run compliance programmes and prepare for assessments."
        breadcrumbs={[{ label: "Testimonials", to: "/testimonials" }]}
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.slug}>
              <Quote aria-hidden="true" className="h-6 w-6 text-primary" />
              <blockquote className="mt-3 text-lg font-medium">{t.content}</blockquote>
              <p className="mt-4 text-sm font-semibold">{t.author}</p>
              {t.role ? <p className="text-sm text-muted-foreground">{t.role}</p> : null}
            </Card>
          ))}
        </div>
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
    </>
  );
}
