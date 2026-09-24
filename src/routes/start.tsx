import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card, FeatureList } from "@/components/site/primitives";
import { CtaLink, ConversionCta } from "@/components/site/cta";
import { plans } from "@/data/pricing";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/start")({
  head: () => ({
    ...pageMeta({
      title: "Start free — NOVA Compliance",
      description: "Create a free NOVA Compliance workspace to explore the platform, activate a framework and start collecting evidence.",
      path: "/start",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Start free", to: "/start" }]))],
  }),
  component: StartPage,
});

const steps = [
  "Create your workspace and tenant",
  "Activate one framework",
  "Map initial controls and assign owners",
  "Upload or connect your first evidence",
  "Invite a reviewer and see readiness reporting",
];

const freePlan = plans.find((plan) => plan.slug === "free");

const freeLimits = [
  "One workspace",
  `Up to ${freePlan?.maxUsers ?? 2} users, including one administrator`,
  freePlan?.includes.find((item) => item.toLowerCase().includes("activated framework")) ?? "One active framework",
  freePlan?.includes.find((item) => item.toLowerCase().includes("manual evidence upload")) ?? "Manual evidence upload",
  freePlan?.support ?? "Community support",
];

function StartPage() {
  return (
    <>
      <PageHero
        eyebrow="Get started"
        title="Start free"
        description="Begin with a no-commitment workspace. Explore the platform, import a framework and collect your first evidence before deciding to upgrade."
        breadcrumbs={[{ label: "Start free", to: "/start" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading title="What happens next" />
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li key={s} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-sm font-semibold text-accent-foreground">
                    {i + 1}
                  </span>
                  <p className="text-muted-foreground">{s}</p>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink to="/pricing">Compare plans</CtaLink>
              <CtaLink to="/book-demo" variant="outline">Book a demo</CtaLink>
            </div>
          </div>
          <Card>
            <h2 className="text-lg font-semibold">Free tier includes</h2>
            <FeatureList className="mt-4" items={freeLimits} />
            <p className="mt-6 text-sm text-muted-foreground">{site.humanStatement}</p>
            <button
              type="button"
              disabled
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground opacity-60"
            >
              Sign-up form coming soon
            </button>
            <div className="mt-4 flex flex-wrap gap-3">
              <CtaLink to="/pricing">Compare plans</CtaLink>
              <CtaLink to="/book-demo" variant="outline">Book a demo</CtaLink>
            </div>
          </Card>
        </div>
      </Section>

      <ConversionCta
        primary={{ label: "Compare plans", to: "/pricing" }}
        secondary={{ label: "Book a demo", to: "/book-demo" }}
      />
    </>
  );
}
