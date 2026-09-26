import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";
import { Section, SectionHeading, PageHero, Card } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/status")({
  head: () => ({
    ...pageMeta({
      title: "System status — NOVA Compliance",
      description: "Current status of the NOVA Compliance service and recent incident history.",
      path: "/status",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "System status", to: "/status" }]))],
  }),
  component: StatusPage,
});

function StatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="System status"
        description="Status information for NOVA services. A live monitoring feed is not currently connected to this public page."
        breadcrumbs={[{ label: "System status", to: "/status" }]}
      />

      <Section>
        <Card className="flex items-start gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <AlertCircle aria-hidden="true" className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">Live status feed not connected</h2>
            <p className="text-sm text-muted-foreground">This page does not make an operational or uptime assertion. Contact Eredox for a current service question.</p>
          </div>
        </Card>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Incident history" />
        <p className="text-muted-foreground">Incident history is not published here because this page is not backed by a live incident-management feed.</p>
        <p className="mt-4 text-sm text-muted-foreground">
          For questions or to report an issue, visit{" "}
          <Link to="/contact" className="text-primary underline">
            contact
          </Link>{" "}
          or email support.
        </p>
      </Section>

      <ConversionCta />
    </>
  );
}
