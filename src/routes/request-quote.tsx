import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card, FeatureList } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/request-quote")({
  head: () => ({
    ...pageMeta({
      title: "Request a quote — NOVA Compliance",
      description: "Request a custom quote for NOVA Compliance Enterprise. Tell us about your scope, frameworks and team size.",
      path: "/request-quote",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Request a quote", to: "/request-quote" }]))],
  }),
  component: RequestQuotePage,
});

const quoteFields = [
  "Number of frameworks and locations",
  "Expected user count and roles",
  "Integration and onboarding requirements",
  "Assurance timeline and auditor involvement",
];

function RequestQuotePage() {
  const search = useSearch({ strict: false }) as { plan?: string };
  const isEnterpriseRequest = search.plan === "enterprise";

  return (
    <>
      <PageHero
        eyebrow="Enterprise"
        title="Request a quote"
        description="Tell us about your programme and we will prepare a tailored proposal. All prices require Eredox approval before they are binding."
        breadcrumbs={[{ label: "Request a quote", to: "/request-quote" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading title="What we need to know" />
            <FeatureList className="mt-6" items={quoteFields} />
            <p className="mt-6 text-sm text-muted-foreground">{site.pricingApprovalNote}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prefer to talk first?{" "}
              <Link to="/book-demo" className="text-primary underline">
                Book a demo
              </Link>.
            </p>
          </div>
          <Card>
            <h2 className="text-lg font-semibold">Quote request</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isEnterpriseRequest
                ? "This request is for the NOVA Enterprise plan. Fill in the form and our team will respond within two business days."
                : "Fill in the form and our team will respond within two business days."}
            </p>
            <ContactForm
              className="mt-6"
              defaultMessage={isEnterpriseRequest ? "Quote request for the NOVA Enterprise plan.\n\n" : ""}
            />
          </Card>
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
