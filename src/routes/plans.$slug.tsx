import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import {
  Section,
  SectionHeading,
  PageHero,
  Card,
  FeatureList,
  Disclaimer,
} from "@/components/site/primitives";
import { CtaLink } from "@/components/site/cta";
import { getPlan, currency } from "@/data/pricing";
import { getPlanDetail } from "@/data/plan-details";
import { governedFrameworkCatalogue } from "@/data/framework-catalogue";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/plans/$slug")({
  loader: ({ params }) => {
    const plan = getPlan(params.slug);
    const detail = getPlanDetail(params.slug);
    if (!plan || !detail) throw notFound();
    return { plan, detail };
  },
  head: ({ loaderData }) => {
    const plan = loaderData?.plan;
    if (!plan) {
      return {
        meta: [
          { title: "Plan not found — NOVA Compliance" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    return {
      ...pageMeta({
        title: `NOVA ${plan.name} plan — Pricing and entitlements`,
        description: `${plan.summary} Review NOVA ${plan.name} plan entitlements, framework scope, evidence workflow and next steps.`,
        path: plan.detailPath,
      }),
      scripts: [
        ldScript(
          breadcrumbSchema([
            { label: "Pricing", to: "/pricing" },
            { label: `${plan.name} plan`, to: plan.detailPath },
          ]),
        ),
      ],
    };
  },
  notFoundComponent: PlanNotFound,
  component: PlanPage,
});

function PlanNotFound() {
  return (
    <main>
      <PageHero
        eyebrow="Plans"
        title="Plan not found"
        description="That NOVA plan page does not exist."
        breadcrumbs={[{ label: "Pricing", to: "/pricing" }]}
      />
      <Section>
        <Link to="/pricing" className="text-primary underline">
          Compare plans
        </Link>
      </Section>
    </main>
  );
}

function PlanPrice({
  monthly,
  annual,
  quoteOnly,
}: {
  monthly: number | null;
  annual: number | null;
  quoteOnly?: boolean;
}) {
  if (quoteOnly || monthly === null) {
    return (
      <>
        <p className="text-3xl font-semibold">Custom</p>
        <p className="mt-1 text-sm text-muted-foreground">Quoted per organisation and scope</p>
      </>
    );
  }

  return (
    <>
      <p className="text-3xl font-semibold">{monthly === 0 ? "Free" : `$${monthly} ${currency}`}</p>
      {monthly > 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">
          per month, or ${annual} {currency} per month billed annually
        </p>
      ) : null}
    </>
  );
}

function PlanPage() {
  const { plan, detail } = Route.useLoaderData();

  return (
    <main>
      <PageHero
        eyebrow="Plans"
        title={`NOVA ${plan.name} plan`}
        description={plan.summary}
        breadcrumbs={[
          { label: "Pricing", to: "/pricing" },
          { label: `${plan.name} plan`, to: plan.detailPath },
        ]}
      >
        <div className="flex flex-wrap items-center gap-4">
          <CtaLink to={plan.primaryAction.to}>{plan.primaryAction.label}</CtaLink>
          <Link
            to="/pricing"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border-strong bg-background px-5 text-sm font-medium hover:bg-surface"
          >
            Compare plans <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
          <div className="space-y-10">
            <div>
              <SectionHeading title="Who it is for" />
              <p className="mt-4 text-lg text-muted-foreground">{plan.bestFor}</p>
            </div>

            <div>
              <SectionHeading title="What is included" />
              <FeatureList className="mt-5" items={plan.includes} />
            </div>

            <div>
              <SectionHeading eyebrow="Framework entitlement" title="Scope what applies" />
              <p className="mt-4 text-muted-foreground">{plan.frameworkEntitlement}</p>
              <p className="mt-3 text-sm text-muted-foreground">
                NOVA has a wider governed catalogue of {governedFrameworkCatalogue.availableCount}{" "}
                framework capabilities. Activation depends on customer scope, data and requirements;
                this plan does not activate every framework automatically.
              </p>
            </div>
          </div>

          <Card className="lg:sticky lg:top-28">
            <p className="eyebrow">{plan.name} pricing</p>
            <div className="mt-4">
              <PlanPrice
                monthly={plan.monthly}
                annual={plan.annual}
                quoteOnly={plan.quoteOnly ?? false}
              />
            </div>
            {plan.requiresApproval ? (
              <p className="mt-4 text-xs text-muted-foreground">{site.pricingApprovalNote}</p>
            ) : null}
            <CtaLink to={plan.primaryAction.to} className="mt-6 w-full">
              {plan.primaryAction.label}
            </CtaLink>
            <Link
              to="/pricing"
              className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-medium hover:bg-surface"
            >
              Find out more about all plans
            </Link>
          </Card>
        </div>
      </Section>

      <Section tone="surface">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Evidence & automation"
              title="Evidence that supports the operating model"
            />
            <p className="mt-4 text-muted-foreground">{detail.evidenceAndAutomation}</p>
          </div>
          <div>
            <SectionHeading
              eyebrow="Governance & human approval"
              title="Accountability stays explicit"
            />
            <FeatureList className="mt-5" items={detail.governanceAndHumanApproval} />
          </div>
        </div>
        <Disclaimer className="mt-8">{site.humanStatement}</Disclaimer>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading title="Support" />
            <p className="mt-4 text-lg text-muted-foreground">{plan.support}</p>
          </div>
          <div>
            <SectionHeading title="Limitations and upgrade path" />
            <FeatureList className="mt-5" items={detail.limitations} />
            <p className="mt-5 text-sm text-muted-foreground">{detail.upgradePath}</p>
          </div>
        </div>
        {detail.commercialNote ? (
          <Disclaimer className="mt-8">{detail.commercialNote}</Disclaimer>
        ) : null}
      </Section>

      <Section tone="surface">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
          <SectionHeading
            eyebrow="Next step"
            title={`Continue with the NOVA ${plan.name} plan`}
            description="Choose the plan action that matches your intent, or compare the full commercial journey before deciding."
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <CtaLink to={plan.primaryAction.to}>{plan.primaryAction.label}</CtaLink>
            <CtaLink to="/pricing" variant="outline">
              Compare plans
            </CtaLink>
          </div>
        </div>
      </Section>
    </main>
  );
}
