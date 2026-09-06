import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card, FeatureList } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { BookingForm } from "@/components/site/BookingForm";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/book-demo")({
  head: () => ({
    ...pageMeta({
      title: "Book a demo — NOVA Compliance",
      description:
        "Book a 30-minute demo of NOVA Compliance. Pick a date and time, and see how frameworks, evidence and readiness reporting connect in one workspace.",
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
  const { framework } = Route.useSearch();
  return (
    <>
      <PageHero
        eyebrow="Demo"
        title="Book a demo"
        description="A 30-minute walkthrough tailored to your compliance programme. Choose a date and time that suits you — we will confirm by email."
        breadcrumbs={[{ label: "Book a demo", to: "/book-demo" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading title="What we will cover" />
            <FeatureList className="mt-6" items={demoTopics} />
            <p className="mt-6 text-sm text-muted-foreground">
              Tell us the framework you care about and we will prepare relevant examples. Demos are run by the Eredox team.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">{site.humanStatement}</p>
          </div>
          <Card>
            <h2 className="text-lg font-semibold">Choose your demo time</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick a preferred date and time below and we will confirm the booking by email.
            </p>
            <BookingForm className="mt-6" defaultFramework={framework} />
          </Card>
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
