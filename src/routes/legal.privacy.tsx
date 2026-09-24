import { createFileRoute } from "@tanstack/react-router";
import { LongFormLegalDocument } from "@/components/site/LongFormLegalDocument";
import { publishedPrivacy } from "@/data/legal-published";
import { breadcrumbSchema, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    ...pageMeta({
      title: "Privacy Policy | NOVA Compliance",
      description: "NOVA Global Privacy Policy, version 1.1.",
      path: "/legal/privacy",
    }),
    scripts: [
      ldScript(
        breadcrumbSchema([
          { label: "Legal Centre", to: "/legal" },
          { label: "Privacy Policy", to: "/legal/privacy" },
        ]),
      ),
    ],
  }),
  component: () => <LongFormLegalDocument document={publishedPrivacy} />,
});
