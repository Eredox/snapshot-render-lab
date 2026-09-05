import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card, FeatureList } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ContactForm } from "@/components/site/ContactForm";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/book-demo")({
  head: () => ({
    ...pageMeta({
      title: "Book a demo — NOVA Compliance",
      description: "Schedule a demo of NOVA Compliance. See how frameworks, evidence and readiness reporting connect in one workspace.",
      path: "/book-demo",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Book a demo", to: "/book-demo" }]))],
  }),
  component: BookDemoPage,
});

const demoTopics = [
  "Map your active frameworks to a shared control set",
  "See how evidence is collected, mapped and reviewed",
  "Understand readiness reporting and gap identification",
  "Review role-based access and tenant boundaries",
  "Discuss pricing and onboarding for your team",
];

function BookDemoPage() {
  return (
    <>
      <PageHero
        eyebrow="Demo"
        title="Book a demo"
        description="A 30-minute walkthrough tailored to your compliance programme. No commitment required."
        breadcrumbs={[{ label: "Book a demo", to: "/book-demo" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading title="What we will cover" />
            <FeatureList className="mt-6" items={demoTopics} />
            <p className="mt-6 text-sm text-muted-foreground">
              We will use the information you provide to prepare relevant examples. Demos are run by the Eredox team.
            </p>
          </div>
          <Card>
            <h2 className="text-lg font-semibold">Request a demo</h2>
            <p className="mt-2 text-sm text-muted-foreground">Use the form below and we will be in touch to confirm a time.</p>
            <ContactForm className="mt-6" />
          </Card>
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
