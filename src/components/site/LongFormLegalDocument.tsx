import { Link } from "@tanstack/react-router";
import { ArrowLeft, Printer } from "lucide-react";
import type { PublishedLegalDocument } from "@/data/legal-publication-types";

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

function formatDate(value: string) {
  const [year, month, day] = value.split("-");
  return `${Number(day)} ${monthNames[Number(month) - 1]} ${year}`;
}

function documentDescription(document: PublishedLegalDocument) {
  return document.metadata.document_type === "terms_and_conditions"
    ? "The NOVA Global Master SaaS Terms and Conditions for customers and authorised users."
    : "The NOVA Global Privacy Policy explaining how Eredox handles personal information in connection with NOVA.";
}

export function LongFormLegalDocument({ document }: { document: PublishedLegalDocument }) {
  const { metadata, sections } = document;

  return (
    <div className="legal-print-surface">
      <section className="border-b border-border bg-surface">
        <div className="container-page py-10 md:py-14">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground print-hidden">
            <Link to="/" className="hover:text-primary hover:underline">
              Home
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <Link to="/legal" className="hover:text-primary hover:underline">
              Legal Centre
            </Link>
            <span aria-hidden="true" className="px-2">
              /
            </span>
            <span className="text-foreground">{metadata.short_title}</span>
          </nav>
          <div className="mt-8 max-w-4xl">
            <p className="eyebrow">NOVA Legal Centre</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">
              {metadata.title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg text-muted-foreground">
              {documentDescription(document)}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-10 md:py-14">
        <div className="container-page">
          <div className="grid gap-10 lg:grid-cols-[minmax(14rem,18rem)_minmax(0,1fr)] lg:items-start">
            <aside className="print-hidden lg:sticky lg:top-28" aria-label="Table of contents">
              <div className="rounded-xl border border-border bg-card p-5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Contents
                </h2>
                <ol className="mt-4 max-h-[calc(100vh-10rem)] space-y-2 overflow-auto text-sm">
                  {sections.map((section, index) => (
                    <li key={section.title}>
                      <a
                        href={`#legal-section-${index + 1}`}
                        className="text-muted-foreground hover:text-primary hover:underline"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>

            <article className="legal-document min-w-0" aria-labelledby="legal-document-title">
              <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 id="legal-document-title" className="text-xl font-semibold">
                    Publication details
                  </h2>
                  <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-muted-foreground">Version</dt>
                      <dd className="font-medium">{metadata.version}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Applicability</dt>
                      <dd className="font-medium">Global</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Effective date</dt>
                      <dd className="font-medium">{formatDate(metadata.effective_date)}</dd>
                    </div>
                    <div>
                      <dt className="text-muted-foreground">Last updated</dt>
                      <dd className="font-medium">{formatDate(metadata.updated_date)}</dd>
                    </div>
                  </dl>
                </div>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="print-hidden inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-border-strong px-4 text-sm font-medium hover:bg-surface"
                >
                  <Printer aria-hidden="true" className="h-4 w-4" />
                  Print document
                </button>
              </div>

              <div className="mt-8 space-y-10">
                {sections.map((section, index) => (
                  <section
                    key={section.title}
                    id={`legal-section-${index + 1}`}
                    className="scroll-mt-28"
                    aria-labelledby={`legal-section-heading-${index + 1}`}
                  >
                    <h2
                      id={`legal-section-heading-${index + 1}`}
                      className="text-xl font-semibold leading-snug md:text-2xl"
                    >
                      {section.title}
                    </h2>
                    <p className="mt-4 text-base leading-8 text-muted-foreground">{section.body}</p>
                  </section>
                ))}
              </div>

              <div className="mt-12 border-t border-border pt-6 print-hidden">
                <Link
                  to="/legal"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                  Back to Legal Centre
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
