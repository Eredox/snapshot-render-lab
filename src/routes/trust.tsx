import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, FileCheck, Users, ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/trust")({
  head: () => ({
    ...pageMeta({
      title: "Trust & Assurance | NOVA Compliance",
      description: "How NOVA supports customer assurance through transparency, scoped access, security practices and responsible AI.",
      path: "/trust",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Trust and assurance", to: "/trust" }]))],
  }),
  component: TrustPage,
});

const trustCards = [
  {
    icon: Shield,
    title: "Security practices",
    body: "Tenant isolation, role-based access and least-privilege operations. We describe what is in place rather than claiming certifications we do not hold.",
    to: "/security",
  },
  {
    icon: Lock,
    title: "Responsible AI",
    body: "AI assists with drafting, interpretation and gap detection. Final decisions remain with accountable people.",
    to: "/responsible-ai",
  },
  {
    icon: FileCheck,
    title: "Honest readiness",
    body: "NOVA supports the readiness decision. It does not issue certifications or guarantee compliance outcomes.",
    to: "/platform",
  },
  {
    icon: Users,
    title: "Auditor engagement",
    body: "The Auditor Portal lets organisations share scoped evidence with external reviewers without exposing everything.",
    to: "/features/auditor-portal",
  },
];

const related = [
  { label: "Security", to: "/security", description: "Security practices" },
  { label: "Responsible AI", to: "/responsible-ai", description: "Oversight and limitations" },
  { label: "System status", to: "/status", description: "Service availability" },
  { label: "Legal", to: "/legal", description: "Terms and policies" },
];

function TrustPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Trust and assurance"
        description="NOVA is designed to support assurance without overclaiming. Explore the practices, boundaries and engagement models that keep trust explicit."
        breadcrumbs={[{ label: "Trust and assurance", to: "/trust" }]}
      />

      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {trustCards.map((c) => (
            <Card key={c.title} interactive>
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-soft">
                  <c.icon aria-hidden="true" className="h-5 w-5 text-primary" />
                </span>
                <h2 className="text-lg font-semibold">{c.title}</h2>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
              <Link to={c.to} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Reporting" title="How to request assurance information" />
        <p className="text-muted-foreground">
          Eligible customers can request security and assurance information under confidentiality terms. We do not publish
          reports we have not completed. Contact us through the{" "}
          <Link to="/contact" className="text-primary underline">
            contact page
          </Link>{" "}
          to discuss.
        </p>
        <FeatureList
          className="mt-6"
          items={[
            "Security overview documents for eligible customers",
            "Scoped Auditor Portal access during engagements",
            "Responsible AI usage statement",
            "Subprocessor and data handling information",
          ]}
        />
      </Section>

      <Section>
        <RelatedLinks title="Trust resources" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
