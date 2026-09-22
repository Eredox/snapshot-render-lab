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
        <nav aria-label="FAQ categories" className="overflow-x-auto">
          <ul className="flex min-w-max gap-2 pb-2">
            {faqCategories.map((category, index) => (
              <li key={category.category}>
                <a href={`#faq-category-${index}`} className="inline-flex rounded-full border border-border px-3 py-2 text-sm font-medium hover:bg-surface">
                  {category.category}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-8 space-y-10">
          {faqCategories.map((cat, ci) => (
            <section key={cat.category} id={`faq-category-${ci}`} className="scroll-mt-28">
              <h2 className="text-xl font-semibold">{cat.category}</h2>
              <div className="mt-4 space-y-3">
                {cat.items.map((item, ii) => {
                  const isOpen = open?.category === ci && open?.item === ii;
                  const answerId = `faq-answer-${ci}-${ii}`;
                  const questionId = `faq-question-${ci}-${ii}`;
                  return (
                    <div key={item.question} className="rounded-xl border border-border bg-card p-5">
                      <button
                        type="button"
                        onClick={() => setOpen(isOpen ? null : { category: ci, item: ii })}
                        aria-expanded={isOpen}
                        aria-controls={answerId}
                        id={questionId}
                        className="flex w-full items-center justify-between text-left font-medium"
                      >
                        {item.question}
                        <span aria-hidden="true" className="ml-4 text-muted-foreground">{isOpen ? "−" : "+"}</span>
                      </button>
                      {isOpen ? (
                        <div id={answerId} role="region" aria-labelledby={questionId} className="mt-3 max-w-3xl text-sm text-muted-foreground">
                          <p>{item.answer}</p>
                          {item.links?.length ? (
                            <div className="mt-4 flex flex-wrap gap-4">
                              {item.links.map((link) => (
                                <Link key={link.to} to={link.to as any} className="font-medium text-primary underline">
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </Section>

      <ConversionCta />
    </>
  );
}
