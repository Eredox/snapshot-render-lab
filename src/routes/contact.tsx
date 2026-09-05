import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...pageMeta({
      title: "Contact — NOVA Compliance",
      description: "Contact the Eredox team about NOVA Compliance, demos, pricing and support.",
      path: "/contact",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Contact", to: "/contact" }]))],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Get in touch"
        description="Questions about NOVA, pricing or how it fits your compliance programme? Send a message and we will respond as soon as we can."
        breadcrumbs={[{ label: "Contact", to: "/contact" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading title="Send a message" />
            <ContactForm />
          </div>
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold">Sales and demos</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Want to see NOVA in action?{" "}
                <Link to="/book-demo" className="text-primary underline">
                  Book a demo
                </Link>{" "}
                or use the form and we will arrange a time.
              </p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Support</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Existing customers can reach support through the channel provided in their onboarding. If you cannot
                access it, use this form.
              </p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Office</h2>
              <p className="mt-2 text-sm text-muted-foreground">{site.company}</p>
              <p className="text-sm text-muted-foreground">Australia</p>
            </Card>
          </div>
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
