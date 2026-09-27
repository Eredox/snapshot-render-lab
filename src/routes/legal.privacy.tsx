import { createFileRoute } from "@tanstack/react-router";
import { LongFormLegalDocument } from "@/components/site/LongFormLegalDocument";
import { publishedPrivacy } from "@/data/legal-published";
import { breadcrumbSchema, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/legal/privacy")({
  head: () => ({
    ...pageMeta({
      title: "Privacy Policy | NOVA Compliance",
      description: "Read how Eredox and NOVA handle personal information, privacy choices, customer data and individual rights across the service.",
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
