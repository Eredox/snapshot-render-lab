import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading, Card } from "@/components/site/primitives";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    ...pageMeta({
      title: "NOVA Compliance Support | Contact Eredox",
      description:
        "Get help with NOVA Compliance, account questions and support enquiries from Eredox.",
      path: "/support",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Support", to: "/support" }]))],
  }),
});

function SupportPage() {
  return (
    <main>
      <PageHero
        eyebrow="Help"
        title="Support"
        description="Find the right channel for your question. For account issues, use the form below and we will respond by email."
        breadcrumbs={[{ label: "Support", to: "/support" }]}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <SectionHeading title="Send a message" />
            <ContactForm className="mt-6" />
          </Card>
          <div className="space-y-6">
            <Card>
              <h2 className="text-lg font-semibold">Documentation</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Guides and explainers are in the resource library.
              </p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Sales enquiries</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                For pricing and procurement questions, visit the{" "}
                <a href="/pricing" className="text-primary hover:underline">
                  pricing page
                </a>{" "}
                or{" "}
                <a href="/contact" className="text-primary hover:underline">
                  contact sales
                </a>
                .
              </p>
            </Card>
            <p className="text-sm text-muted-foreground">{site.ownership}</p>
          </div>
        </div>
      </Section>
    </main>
  );
}
