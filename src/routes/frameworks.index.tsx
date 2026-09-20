import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Section, SectionHeading, PageHero, Card, AvailabilityBadge, RelatedLinks, Disclaimer } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { frameworks, illustrativeReadiness } from "@/data/frameworks";
import { frameworkRegister, registerNote, registerPriorityMeaning, type RegisterPriority } from "@/data/framework-register";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";
import { pageMeta, breadcrumbSchema, ldScript } from "@/lib/seo";

export const Route = createFileRoute("/frameworks/")({
  head: () => ({
    ...pageMeta({
      title: "Frameworks — NOVA Compliance",
      description: "Compliance frameworks available and planned in NOVA, with availability status, readiness views and honest scope handling.",
      path: "/frameworks",
    }),
    scripts: [ldScript(breadcrumbSchema([{ label: "Frameworks", to: "/frameworks" }]))],
  }),
  component: FrameworksPage,
});

const related = [
  { label: "Features", to: "/features", description: "All capabilities" },
  { label: "Platform overview", to: "/platform", description: "How the parts connect" },
  { label: "Pricing", to: "/pricing", description: "Plans and entitlements" },
];

function PriorityBadge({ priority }: { priority: RegisterPriority }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        priority === "Core" && "bg-primary-soft text-accent-foreground",
        priority === "Sector" && "bg-ember-soft text-ember-foreground",
        priority === "Reference" && "bg-secondary text-secondary-foreground",
      )}
    >
      {priority}
    </span>
  );
}

function FrameworksPage() {
  const available = frameworks.filter((f) => f.availability === "Available now");
  const planned = frameworks.filter((f) => f.availability !== "Available now");

  return (
    <>
      <PageHero
        eyebrow="Frameworks"
        title="Activate the frameworks that apply to you"
        description="NOVA maps requirements from each framework onto a shared control set. Evidence collected once can support multiple frameworks where it genuinely satisfies the control."
        breadcrumbs={[{ label: "Frameworks", to: "/frameworks" }]}
      />

      <Section>
        <SectionHeading eyebrow="Available now" title="Ready to activate" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((f) => (
            <Card key={f.slug} interactive className="h-full">
              <div className="flex items-start gap-4">
                {f.icon ? (
                  <img
                    src={f.icon}
                    alt=""
                    aria-hidden="true"
                    width={72}
                    height={72}
                    loading="lazy"
                    decoding="async"
                    className="h-16 w-16 shrink-0 object-contain sm:h-[72px] sm:w-[72px]"
                  />
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-lg font-semibold">{f.name}</h2>
                    <AvailabilityBadge value={f.availability} />
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">{f.description}</p>
                  <Link to={`/frameworks/${f.slug}` as any} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Explore <ArrowRight aria-hidden="true" className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section tone="surface">
        <SectionHeading eyebrow="Roadmap" title="Planned frameworks" />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {planned.map((f) => (
            <Card key={f.slug} interactive>
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">{f.name}</h2>
                <AvailabilityBadge value={f.availability} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{f.description}</p>
              <Link to={`/frameworks/${f.slug}` as any} className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Read more <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="Global register"
          title="Planned frameworks by region"
          description="A regional view of the major compliance frameworks and regulatory regimes NOVA may support. Eredox is headquartered in Australia and its service scope is worldwide."
        />
        <Tabs defaultValue={frameworkRegister[0]!.id} className="mt-8">
          <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-secondary p-1">
            {frameworkRegister.map((region) => (
              <TabsTrigger key={region.id} value={region.id} className="text-xs sm:text-sm">
                {region.shortLabel}
              </TabsTrigger>
            ))}
          </TabsList>
          {frameworkRegister.map((region) => (
            <TabsContent key={region.id} value={region.id} className="mt-6">
              <h3 className="text-xl font-semibold">{region.label}</h3>
              <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{region.intro}</p>
              <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[46rem] border-collapse text-left text-sm">
                  <thead className="bg-surface">
                    <tr>
                      <th scope="col" className="px-4 py-3 font-semibold">Framework</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Jurisdiction</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Primary subject</th>
                      <th scope="col" className="px-4 py-3 font-semibold">NOVA relevance</th>
                      <th scope="col" className="px-4 py-3 font-semibold">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {region.entries.map((entry) => (
                      <tr key={entry.name} className="border-t border-border align-top">
                        <td className="px-4 py-3 font-medium">{entry.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{entry.jurisdiction}</td>
                        <td className="px-4 py-3 text-muted-foreground">{entry.subject}</td>
                        <td className="px-4 py-3 text-muted-foreground">{entry.relevance}</td>
                        <td className="px-4 py-3">
                          <PriorityBadge priority={entry.priority} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {registerPriorityMeaning.map((p) => (
            <Card key={p.priority}>
              <PriorityBadge priority={p.priority} />
              <p className="mt-3 text-sm text-muted-foreground">{p.meaning}</p>
            </Card>
          ))}
        </div>
        <Disclaimer className="mt-8">{registerNote}</Disclaimer>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div>
            <SectionHeading eyebrow="Readiness" title="Illustrative readiness reporting" />
            <p className="mt-4 text-muted-foreground">{site.illustrativeCaption}</p>
            <ul className="mt-6 space-y-3">
              {[
                "Controls mapped across activated frameworks",
                "Evidence status shown by control and requirement",
                "Gaps surfaced before an external assessment",
                "Freshness expectations keep evidence current",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Link to="/features" className="text-primary underline">
                Learn about reporting
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold">Example readiness snapshot</h3>
            <div className="mt-5 space-y-4">
              {illustrativeReadiness.map((f) => (
                <div key={f.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{f.name}</span>
                    <span className="text-muted-foreground">{f.value}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <span className="block h-full rounded-full bg-primary" style={{ width: `${f.value}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{f.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Disclaimer className="mt-8">{site.frameworkDisclaimer}</Disclaimer>
      </Section>

      <Section tone="surface">
        <RelatedLinks title="Related areas" items={related} />
      </Section>

      <ConversionCta />
    </>
  );
}
