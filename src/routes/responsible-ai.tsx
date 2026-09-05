import { createFileRoute, Link } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/responsible-ai")({
  head: () => ({
    ...pageMeta({
      title: "Responsible AI — NOVA Compliance",
      description: "How NOVA uses AI to assist compliance work, the boundaries we keep, and the accountabilities that remain with people.",
      path: "/responsible-ai",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Responsible AI", to: "/responsible-ai" }]))],
  }),
  component: ResponsibleAIPage,
});

const commitments = [
  {
    title: "Assist, do not decide",
    body: "NOVA's AI assistant prepares, explains, summarises and flags likely gaps. It does not approve controls, accept risk, issue certifications or make launch decisions.",
  },
  {
    title: "Grounded in your records",
    body: "Suggestions are drawn from the controls, policies and evidence in your workspace. The assistant does not invent authoritative answers from general training data.",
  },
  {
    title: "Transparent boundaries",
    body: "Every AI-suggested draft shows that it is a suggestion and identifies what a person must still review before the record can be relied on.",
  },
  {
    title: "Human accountability",
    body: "Control owners, reviewers and approvers retain accountability. AI does not replace the judgement needed for assurance.",
  },
];

const related = [
  { label: "AI Assistant feature", to: "/features/ai-assistant", description: "Capabilities and availability" },
  { label: "Security", to: "/security", description: "Security practices" },
  { label: "Trust and assurance", to: "/trust", description: "How we support customer assurance" },
];

function ResponsibleAIPage() {
  return (
    <>
      <PageHero
        eyebrow="Trust"
        title="Responsible AI in NOVA"
        description="AI is used as an assistant, not an authority. The human team remains accountable for every compliance decision."
        breadcrumbs={[{ label: "Responsible AI", to: "/responsible-ai" }]}
      />

      <Section>
        <SectionHeading
          title="Our commitments"
          description="These commitments shape how AI is built into NOVA and how it is presented to users."
        />
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {commitments.map((c) => (
            <Card key={c.title}>
              <h3 className="text-lg font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Capabilities" title="What the assistant can do" />
        <FeatureList
          className="mt-6"
          items={[
            "Summarise uploaded evidence against a control expectation",
            "Draft control descriptions and policy language from workspace context",
            "Explain what a requirement is asking for in plain language",
            "Highlight missing or ageing evidence that may affect readiness",
            "Suggest mappings between evidence and related controls",
          ]}
        />
      </Section>

      <Section>
        <SectionHeading eyebrow="Boundaries" title="What the assistant will not do" />
        <FeatureList
          className="mt-6"
          items={[
            "Issue or imply a certification or compliance guarantee",
            "Approve controls, risks or policy acceptance on behalf of the organisation",
            "Replace a reviewer validation step",
            "Make a final launch or risk decision",
            "Access data or tenants outside the authenticated session",
          ]}
        />
        <p className="mt-6 text-sm text-muted-foreground">{site.humanStatement}</p>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Governance" title="How AI outputs are kept accountable" />
        <p className="text-muted-foreground">
          AI-generated suggestions are stored with attribution. A reviewer must accept, edit or reject each suggestion
          before it becomes part of the governed record. Audit history shows who reviewed the output and when.
        </p>
        <div className="mt-6">
          <Link to={"/features/ai-assistant" as any} className="text-primary underline">
            Read more about the AI Assistant capability
          </Link>
        </div>
      </Section>

      <Section>
        <RelatedLinks title="Related pages" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
