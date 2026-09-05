import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github, Cloud, Database, Shield, FileText, MessageSquare, Clock } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/integrations")({
  head: () => ({
    ...pageMeta({
      title: "Integrations — NOVA Compliance",
      description: "Connectors that bring evidence into NOVA, their availability, and how reviewer validation still applies.",
      path: "/integrations",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Integrations", to: "/integrations" }]))],
  }),
  component: IntegrationsPage,
});

const connectors = [
  {
    name: "GitHub",
    status: "Available now",
    category: "Evidence",
    description: "Pull engineering evidence such as pull requests, workflows and deployment records into the workspace for review.",
    icon: Github,
  },
  {
    name: "Manual upload",
    status: "Available now",
    category: "Evidence",
    description: "Upload files, screenshots, exports and documents with structured metadata and control mapping.",
    icon: FileText,
  },
  {
    name: "Cloud identity providers",
    status: "Planned",
    category: "Access",
    description: "SAML or OIDC sign-in for workforce access. Not available today.",
    icon: Cloud,
  },
  {
    name: "Ticketing and workflow tools",
    status: "Planned",
    category: "Operations",
    description: "Link change approvals, incidents and tasks to controls and evidence. Not available today.",
    icon: MessageSquare,
  },
  {
    name: "Cloud infrastructure providers",
    status: "Planned",
    category: "Evidence",
    description: "Collect configuration and logging evidence from cloud accounts. Not available today.",
    icon: Database,
  },
  {
    name: "Vulnerability and security tools",
    status: "Planned",
    category: "Security",
    description: "Bring scan results and security findings in as evidence against relevant controls. Not available today.",
    icon: Shield,
  },
  {
    name: "Calendar and review systems",
    status: "Planned",
    category: "Governance",
    description: "Schedule control reviews and policy attestations. Not available today.",
    icon: Clock,
  },
];

const related = [
  { label: "Evidence management", to: "/features/evidence", description: "How evidence is collected, mapped and reviewed" },
  { label: "Features", to: "/features", description: "All capabilities" },
  { label: "Platform overview", to: "/platform", description: "How the parts connect" },
];

function IntegrationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Integrations"
        title="Connectors that bring evidence into one workspace"
        description="Available connectors feed evidence into the governed workspace. Planned connectors are listed with their status so expectations are clear."
        breadcrumbs={[{ label: "Integrations", to: "/integrations" }]}
      />

      <Section>
        <SectionHeading
          title="Evidence connectors"
          description="Connectors reduce the manual work of collecting evidence. Every item is still mapped to controls and reviewed before it counts."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {connectors.map((c) => (
            <Card key={c.name}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                    <c.icon aria-hidden="true" className="h-5 w-5 text-primary" />
                  </span>
                  <h3 className="font-semibold">{c.name}</h3>
                </div>
                <AvailabilityBadge value={c.status as "Available now" | "Planned"} />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.category}</p>
              <p className="mt-2 text-sm text-muted-foreground">{c.description}</p>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted-foreground">{site.humanStatement}</p>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Connector principles"
              title="Automation without unchecked assumptions"
              description="Connectors are designed to preserve the same accountability as manual evidence."
            />
            <ul className="mt-6 space-y-3">
              {[
                "Connector output is held as evidence, not automatically accepted",
                "A reviewer validates that the artefact demonstrates the control",
                "Mapping to controls is explicit and visible",
                "Planned connectors are not silently treated as available",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <Card>
            <h3 className="font-semibold">Request a connector</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If a connector your programme needs is planned, contact us to discuss priority and timing.
            </p>
            <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Contact Eredox <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </Section>

      <Section>
        <RelatedLinks title="Related areas" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
