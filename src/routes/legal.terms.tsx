import { createFileRoute } from "@tanstack/react-router";
import { LongFormLegalDocument } from "@/components/site/LongFormLegalDocument";
import { publishedTerms } from "@/data/legal-published";
import { breadcrumbSchema, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/legal/terms")({
  head: () => ({
    ...pageMeta({
      title: "Terms and Conditions | NOVA Compliance",
      description: "NOVA Global Master SaaS Terms and Conditions, version 1.1.",
      path: "/legal/terms",
    }),
    scripts: [
      ldScript(
        breadcrumbSchema([
          { label: "Legal Centre", to: "/legal" },
          { label: "Terms and Conditions", to: "/legal/terms" },
        ]),
      ),
    ],
  }),
  component: () => <LongFormLegalDocument document={publishedTerms} />,
});
