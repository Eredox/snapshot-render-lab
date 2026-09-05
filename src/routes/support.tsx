import { createFileRoute } from "@tanstack/react-router";
import { PageHero, Section, SectionHeading, Card } from "@/components/site/primitives";
import { ContactForm } from "@/components/site/ContactForm";
import { site } from "@/config/site";

export const Route = createFileRoute("/support")({
  component: SupportPage,
  head: () => ({
    meta: [
      { title: "Support | NOVA Compliance" },
      { name: "description", content: "Get help with NOVA Compliance. Submit a question or contact Eredox support." },
      { property: "og:title", content: "Support | NOVA Compliance" },
      { property: "og:description", content: "Get help with NOVA Compliance." },
    ],
    links: [{ rel: "canonical", href: "/support" }],
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
              <p className="mt-2 text-sm text-muted-foreground">Guides and explainers are in the resource library.</p>
            </Card>
            <Card>
              <h2 className="text-lg font-semibold">Sales enquiries</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                For pricing and procurement questions, visit the <a href="/pricing" className="text-primary hover:underline">pricing page</a> or <a href="/contact" className="text-primary hover:underline">contact sales</a>.
              </p>
            </Card>
            <p className="text-sm text-muted-foreground">{site.ownership}</p>
          </div>
        </div>
      </Section>
    </main>
  );
}
