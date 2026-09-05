import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, AlertCircle } from "lucide-react";
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

const services = [
  { name: "NOVA web application", status: "Operational" },
  { name: "Evidence upload", status: "Operational" },
  { name: "GitHub connector", status: "Operational" },
  { name: "AI Assistant", status: "Operational" },
  { name: "Auditor Portal", status: "Operational" },
  { name: "Email notifications", status: "Operational" },
];

function StatusPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="System status"
        description="Current status of NOVA services. For live status, subscribe to updates or contact support."
        breadcrumbs={[{ label: "System status", to: "/status" }]}
      />

      <Section>
        <Card className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
            <Check aria-hidden="true" className="h-5 w-5 text-primary" />
          </span>
          <div>
            <h2 className="text-lg font-semibold">All systems operational</h2>
            <p className="text-sm text-muted-foreground">Last updated: today. Historical incidents are listed below.</p>
          </div>
        </Card>

        <div className="mt-10">
          <h2 className="text-xl font-semibold">Services</h2>
          <div className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
            {services.map((s) => (
              <div key={s.name} className="flex items-center justify-between px-5 py-4">
                <span className="font-medium">{s.name}</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <Check aria-hidden="true" className="h-3.5 w-3.5" /> {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading title="Incident history" />
        <p className="text-muted-foreground">No incidents reported in the last 90 days.</p>
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
