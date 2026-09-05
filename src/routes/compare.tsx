import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, ArrowRight } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/compare")({
  head: () => ({
    ...pageMeta({
      title: "Compare — NOVA Compliance",
      description: "Compare NOVA Compliance to spreadsheet-driven, checklist-only and auditor-led approaches to compliance management.",
      path: "/compare",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Compare", to: "/compare" }]))],
  }),
  component: ComparePage,
});

const approaches = [
  {
    title: "Spreadsheets and shared drives",
    limits: [
      "Evidence is scattered across folders and emails",
      "Version control is manual and error-prone",
      "Ownership is unclear before an assessment",
      "Mapping the same evidence to multiple frameworks is tedious",
    ],
  },
  {
    title: "Checklist-only tools",
    limits: [
      "Track completion without connecting evidence",
      "No reviewer validation workflow",
      "Difficult to show readiness to an auditor",
      "Reporting is disconnected from the underlying record",
    ],
  },
  {
    title: "Auditor-led projects",
    limits: [
      "Expensive and dependent on external schedules",
      "Knowledge leaves with the engagement team",
      "Hard to maintain readiness between audits",
      "Evidence gathered once is rarely reusable",
    ],
  },
];

const novaAdvantages = [
  "Governed workspace with tenant isolation",
  "Evidence mapped to shared controls across frameworks",
  "Reviewer validation before evidence counts",
  "Scoped Auditor Portal for external review",
  "AI assistance that stays within human accountability",
  "Transparent availability labels for every feature",
];

function ComparePage() {
  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="How NOVA compares"
        description="NOVA is not a checklist or a document dump. It is a governed workspace that connects frameworks, controls, evidence and reporting."
        breadcrumbs={[{ label: "Compare", to: "/compare" }]}
      />

      <Section>
        <SectionHeading title="What other approaches miss" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {approaches.map((a) => (
            <Card key={a.title}>
              <h2 className="text-lg font-semibold">{a.title}</h2>
              <ul className="mt-4 space-y-2">
                {a.limits.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="NOVA" title="The NOVA approach" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {novaAdvantages.map((item) => (
            <div key={item} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
              <Check aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm text-muted-foreground">{item}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/platform" className="inline-flex items-center gap-1 text-primary underline">
            See the platform overview <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </Section>

      <Section>
        <RelatedLinks
          title="Explore more"
          items={[
            { label: "Platform", to: "/platform", description: "How the parts connect" },
            { label: "Features", to: "/features", description: "All capabilities" },
            { label: "Pricing", to: "/pricing", description: "Plans and entitlements" },
          ]}
        />
      </Section>

      <ConversionCta />
    </>
  );
}
