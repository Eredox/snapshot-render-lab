import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Section, SectionHeading, PageHero } from "@/components/site/primitives";
import { ConversionCta } from "@/components/site/cta";
import { faqCategories } from "@/data/resources";
import { pageMeta, breadcrumbSchema, ldScript, faqSchema } from "@/lib/seo";

export const Route = createFileRoute("/resources/faq")({
  head: () => ({
    ...pageMeta({
      title: "FAQ — NOVA Compliance",
      description: "Answers to common questions about NOVA Compliance, frameworks, evidence, AI, security and pricing.",
      path: "/resources/faq",
    }),
    scripts: [ldScript(faqSchema(faqCategories.flatMap((c) => c.items))), ldScript(breadcrumbSchema([{ label: "Resources", to: "/resources" }, { label: "FAQ", to: "/resources/faq" }]))],
  }),
  component: FaqPage,
});

function FaqPage() {
  const [open, setOpen] = useState<{ category: number; item: number } | null>({ category: 0, item: 0 });

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Frequently asked questions"
        description="Find answers grouped by topic. If you cannot find what you need, contact us."
        breadcrumbs={[
          { label: "Resources", to: "/resources" },
          { label: "FAQ", to: "/resources/faq" },
        ]}
      />

      <Section>
        <div className="space-y-10">
          {faqCategories.map((cat, ci) => (
            <div key={cat.category}>
              <h2 className="text-xl font-semibold">{cat.category}</h2>
              <div className="mt-4 space-y-3">
                {cat.items.map((item, ii) => {
                  const isOpen = open?.category === ci && open?.item === ii;
                  return (
                    <div key={item.question} className="rounded-xl border border-border bg-card p-5">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : { category: ci, item: ii })}
                        className="flex w-full items-center justify-between text-left font-medium"
                      >
                        {item.question}
                        <span className="ml-4 text-muted-foreground">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen ? <p className="mt-3 text-sm text-muted-foreground">{item.answer}</p> : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
