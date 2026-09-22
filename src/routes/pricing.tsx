import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, ArrowRight, Info } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, FeatureList, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { CtaLink, ConversionCta } from "@/components/site/cta";
import { plans, comparison, supportComparison, pricingFaqs, currency } from "@/data/pricing";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript, faqSchema, pricingSchema, softwareSchema } from "@/lib/seo";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    ...pageMeta({
      title: "Pricing — NOVA Compliance",
      description: "NOVA Compliance subscription plans, indicative pricing in AUD, feature comparison and support levels.",
      path: "/pricing",
    }),
    scripts: [
      ldScript(faqSchema(pricingFaqs)),
      ldScript(breadcrumbSchema([{ label: "Pricing", to: "/pricing" }])),
      ldScript(softwareSchema()),
      ldScript(pricingSchema({ currency, plans })),
    ],
  }),
  component: PricingPage,
});

const related = [
  { label: "Start free", to: "/start", description: "Begin a free workspace" },
  { label: "Book a demo", to: "/book-demo", description: "Walk through with us" },
  { label: "Contact sales", to: "/contact", description: "Ask about Enterprise" },
];

function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Plans that scale with your programme"
        description="Indicative pricing for planning. All published prices require Eredox approval before they are contractually binding."
        breadcrumbs={[{ label: "Pricing", to: "/pricing" }]}
      />

      <Section>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">Prices shown in {currency}.</p>
          <div className="inline-flex rounded-lg border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium ${billing === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("annual")}
              className={`rounded-md px-4 py-1.5 text-sm font-medium ${billing === "annual" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            >
              Annual
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.slug} className={p.highlight ? "relative border-primary shadow-lift" : ""}>
              {p.highlight ? (
                <span className="absolute -top-3 left-6 inline-flex rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              ) : null}
              <h2 className="text-xl font-semibold">{p.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-5">
                {p.quoteOnly ? (
                  <span className="text-3xl font-semibold">Custom</span>
                ) : (
                  <>
                    <span className="text-3xl font-semibold">
                      ${billing === "monthly" ? (p.monthly ?? "-") : (p.annual ?? "-")}
                    </span>
                    <span className="text-muted-foreground">/{billing === "monthly" ? "month" : "year"}</span>
                  </>
                )}
              </div>
              {billing === "annual" && p.annual !== null && p.annual > 0 ? (
                <p className="mt-1 text-xs text-muted-foreground">${Math.round(p.annual / 12)} {currency}/month effective when billed annually</p>
              ) : null}
              {p.requiresApproval ? <p className="mt-1 text-xs text-muted-foreground">{site.pricingApprovalNote}</p> : null}
              <p className="mt-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">Best for</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.bestFor}</p>
              <FeatureList className="mt-5" items={p.includes} />
              <CtaLink to={p.primaryAction.to} variant={p.highlight ? "primary" : "outline"} className="mt-6 w-full">
                {p.primaryAction.label}
              </CtaLink>
              <Link to={p.detailPath} className="mt-3 inline-flex w-full items-center justify-center rounded-lg border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-surface">
                Find out more
              </Link>
            </Card>
          ))}
        </div>

        <Disclaimer className="mt-8">
          {site.pricingApprovalNote} Enterprise is quoted per organisation based on scope, users and assurance requirements.
        </Disclaimer>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Compare" title="Plan comparison" />
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Feature</th>
                {plans.map((p) => (
                  <th key={p.slug} className="px-4 py-3 font-medium">
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comparison.map((group) => (
                <>
                  <tr key={group.group} className="bg-surface/50">
                    <td colSpan={plans.length + 1} className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {group.group}
                    </td>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      <td className="px-4 py-3 font-medium">{row.label}</td>
                      {plans.map((p) => (
                        <td key={p.slug} className="px-4 py-3 text-muted-foreground">
                          {row.values[p.slug] === "Included" ? (
                            <Check aria-hidden="true" className="h-4 w-4 text-primary" />
                          ) : (
                            row.values[p.slug]
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="Support" title="Support by plan" />
        <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Support channel</th>
                <th className="px-4 py-3 font-medium">Response commitment</th>
                <th className="px-4 py-3 font-medium">Onboarding</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {supportComparison.map((row) => (
                <tr key={row.plan}>
                  <td className="px-4 py-3 font-medium">{row.plan}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.channel}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.response}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.onboarding}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="FAQ" title="Pricing questions" />
        <div className="mt-8 space-y-4">
          {pricingFaqs.map((faq) => (
            <details key={faq.question} className="group rounded-xl border border-border bg-card p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium">
                {faq.question}
                <Info aria-hidden="true" className="h-4 w-4 text-muted-foreground group-open:hidden" />
                <ArrowRight aria-hidden="true" className="hidden h-4 w-4 rotate-90 text-muted-foreground group-open:block" />
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <Section>
        <RelatedLinks title="Next steps" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
