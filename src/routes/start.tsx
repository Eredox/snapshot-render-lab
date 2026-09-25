import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeading, PageHero, Card, FeatureList } from "@/components/site/primitives";
import { CtaLink, ConversionCta } from "@/components/site/cta";
import { plans } from "@/data/pricing";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/start")({
  head: () => ({
    ...pageMeta({
      title: "Explore Free access | NOVA Compliance",
      description: "Review NOVA's Free entitlement and governed access path. Self-service registration is not currently connected on the public website.",
      path: "/start",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Explore Free access", to: "/start" }]))],
  }),
  component: StartPage,
});

const steps = [
  "Review the Free entitlement and current access route",
  "Confirm whether the governed onboarding path meets your needs",
  "Bring your framework, controls and evidence requirements to the NOVA team",
  "Use the approved onboarding route when it is available",
  "Move to a governed paid-plan discussion when broader entitlements are required",
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
        title="Explore Free access"
        description="Review the no-subscription Free entitlement and the current governed access path. The public self-service registration route is not connected yet."
        breadcrumbs={[{ label: "Explore Free access", to: "/start" }]}
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
              Free onboarding route not connected yet
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
