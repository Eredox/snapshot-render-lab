import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { frameworks } from "@/data/frameworks";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/industries/$slug")({
  loader: ({ params }) => {
    const industry = industries.find((i) => i.slug === params.slug);
    if (!industry) throw notFound();
    return { industry };
  },
  head: ({ loaderData }) => {
    const industry = loaderData?.industry;
    if (!industry) {
      return {
        meta: [{ title: "Industry not found — NOVA Compliance" }, { name: "robots", content: "noindex" }],
      };
    }
    return {
      ...pageMeta({
        title: `${industry.name} — NOVA Compliance`,
        description: industry.summary,
        path: `/industries/${industry.slug}`,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Industries", to: "/industries" },
            { label: industry.name, to: `/industries/${industry.slug}` },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: IndustryNotFound,
  component: IndustryDetail,
});

const industries = [
  {
    slug: "technology",
    name: "Technology",
    summary: "Move fast without losing track of security reviews, customer questionnaires and framework readiness.",
    challenges: [
      "Responding to repetitive customer security questionnaires",
      "Preparing for first SOC 2 or ISO 27001 readiness review",
      "Maintaining evidence as the product and team change",
      "Demonstrating security posture to enterprise buyers",
    ],
    frameworks: ["soc-2", "iso-iec-27001", "essential-eight"],
  },
  {
    slug: "financial-services",
    name: "Financial services",
    summary: "Build a defensible record around data protection, operational resilience and regulatory expectations.",
    challenges: [
      "Mapping controls across prudential and privacy obligations",
      "Keeping evidence fresh for periodic assurance reviews",
      "Demonstrating governance to regulators and auditors",
      "Managing third-party and supply-chain risk",
    ],
    frameworks: ["iso-iec-27001", "essential-eight"],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    summary: "Manage privacy, security and governance obligations with clear evidence ownership and reviewer validation.",
    challenges: [
      "Protecting patient data while enabling access",
      "Tracking policy approvals and workforce training",
      "Preparing for privacy and security assessments",
      "Maintaining audit trails for sensitive decisions",
    ],
    frameworks: ["iso-iec-27001"],
  },
  {
    slug: "government-suppliers",
    name: "Government suppliers",
    summary: "Demonstrate capability and readiness through structured evidence rather than ad-hoc documentation.",
    challenges: [
      "Responding to procurement security requirements",
      "Aligning with national cyber security guidance",
      "Maintaining consistent assurance across contracts",
      "Demonstrating Essential Eight or equivalent maturity",
    ],
    frameworks: ["essential-eight", "iso-iec-27001"],
  },
  {
    slug: "professional-services",
    name: "Professional services",
    summary: "Maintain assurance for clients across multiple engagements with reusable evidence and consistent controls.",
    challenges: [
      "Reusing evidence across multiple client audits",
      "Keeping client data handling controls current",
      "Demonstrating governance without a dedicated security team",
      "Preparing consultant access and privilege policies",
    ],
    frameworks: ["iso-iec-27001", "soc-2"],
  },
];

function IndustryNotFound() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Industry not found" description="That industry page does not exist." breadcrumbs={[{ label: "Industries", to: "/industries" }]} />
      <Section>
        <p className="text-muted-foreground">Browse the industries we cover.</p>
        <div className="mt-4">
          <Link to="/industries" className="text-primary underline">View all industries</Link>
        </div>
      </Section>
    </>
  );
}

function IndustryDetail() {
  const { industry } = Route.useLoaderData();
  const relatedFrameworks = frameworks.filter((f) => industry.frameworks.includes(f.slug));
  const relatedIndustries = industries.filter((i) => i.slug !== industry.slug);

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title={industry.name}
        description={industry.summary}
        breadcrumbs={[
          { label: "Industries", to: "/industries" },
          { label: industry.name, to: `/industries/${industry.slug}` },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title="Common challenges" />
            <FeatureList className="mt-6" items={industry.challenges} />
          </div>
          <div>
            <SectionHeading title="How NOVA helps" />
            <p className="mt-4 text-muted-foreground">
              NOVA keeps frameworks, controls, evidence, policies and risks in one workspace. That makes it easier to
              reuse evidence across assessments, assign clear ownership and report readiness with confidence.
            </p>
            <div className="mt-6">
              <Link to="/book-demo" className="inline-flex items-center gap-1 text-primary underline">
                Book an industry demo <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Frameworks" title="Relevant frameworks" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {relatedFrameworks.map((f) => (
            <Card key={f.slug} interactive>
              <h3 className="font-semibold">{f.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{f.description}</p>
              <Link to={`/frameworks/${f.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <RelatedLinks title="Other industries" items={relatedIndustries.slice(0, 4).map((i) => ({ label: i.name, to: `/industries/${i.slug}`, description: i.summary }))} />
      </Section>

      <ConversionCta />
    </>
  );
}
