import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, Users, Server, ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/security")({
  head: () => ({
    ...pageMeta({
      title: "Security & Trust | NOVA Compliance",
      description: "Security practices and architecture choices that protect customer data inside the NOVA workspace.",
      path: "/security",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Security", to: "/security" }]))],
  }),
  component: SecurityPage,
});

const practices = [
  {
    icon: Lock,
    title: "Tenant isolation",
    body: "Each organisation's data is scoped to its own tenant. Controls, evidence, policies and reporting are not shared between tenants.",
  },
  {
    icon: Users,
    title: "Role-based access",
    body: "Permissions are role-based inside each tenant. Access can be scoped to functions such as evidence reviewer, control owner or auditor engagement.",
  },
  {
    icon: Server,
    title: "Infrastructure",
    body: "The service is built on managed cloud infrastructure with hardened defaults, network segmentation and least-privilege operational access.",
  },
  {
    icon: Shield,
    title: "Assurance workflow",
    body: "Auditor Portal access is scoped to a specific engagement. External reviewers see only what the organisation releases for that engagement.",
  },
];

const related = [
  { label: "Responsible AI", to: "/responsible-ai", description: "Oversight and limitations" },
  { label: "Trust and assurance", to: "/trust", description: "How we support customer assurance" },
  { label: "Auditor Portal", to: "/features/auditor-portal", description: "Scoped external review" },
  { label: "System status", to: "/status", description: "Service availability" },
];

function SecurityPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Security practices in place today"
        description="NOVA is designed to hold sensitive assurance material. This page describes the practices in place, not unverified claims or certifications."
        breadcrumbs={[{ label: "Security", to: "/security" }]}
      />

      <Section>
        <SectionHeading
          title="What we protect"
          description="Customer workspaces contain evidence, policies, risk assessments and control details. The security model is built around keeping that material confidential, intact and available only to authorised people."
        />
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {practices.map((p) => (
            <Card key={p.title}>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                  <p.icon aria-hidden="true" className="h-5 w-5 text-primary" />
                </span>
                <h3 className="text-lg font-semibold">{p.title}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{p.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Practices" title="How security is operated" />
            <FeatureList
              className="mt-6"
              items={[
                "Least-privilege access for operational staff",
                "Change management and deployment reviews",
                "Monitoring, logging and incident response process",
                "Regular review of dependencies and supply chain exposure",
                "Data retention aligned with customer agreements",
              ]}
            />
          </div>
          <div>
            <SectionHeading eyebrow="No invented certifications" title="What we do not claim" />
            <p className="mt-4 text-muted-foreground">
              We do not publish certification seals, audit reports or security attestations that Eredox has not obtained.
              When reports become available through a formal trust process, they will be shared with eligible customers
              under appropriate confidentiality terms.
            </p>
            <Disclaimer className="mt-6">{site.frameworkDisclaimer}</Disclaimer>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Reporting" title="How to report a security concern" />
        <p className="text-muted-foreground">
          If you have discovered a security issue or have a concern about the NOVA service, contact us through the{" "}
          <Link to="/contact" className="text-primary underline">
            contact page
          </Link>{" "}
          or email the address listed there. We respond to genuine reports and coordinate disclosure responsibly.
        </p>
      </Section>

      <Section tone="surface">
        <RelatedLinks title="Related trust pages" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
