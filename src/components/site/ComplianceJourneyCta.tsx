import { CtaLink } from "@/components/site/cta";
import { Section } from "@/components/site/primitives";
import { getComplianceJourneyCtaAction } from "@/lib/compliance-journey-cta";

export function ComplianceJourneyCta({
  pathname = "/",
  selfLink = false,
}: {
  pathname?: string;
  selfLink?: boolean;
}) {
  const action = selfLink
    ? getComplianceJourneyCtaAction("/compliance-journey")
    : getComplianceJourneyCtaAction(pathname);

  return (
    <Section tone="surface" id="compliance-journey-cta">
      <div className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="max-w-3xl">
          <p className="eyebrow">Guided compliance journey</p>
          <h2 id="compliance-journey-cta-title" className="mt-2 text-2xl font-semibold md:text-3xl">
            Start your compliance journey without spreadsheets
          </h2>
          <p className="mt-3 text-muted-foreground">
            Answer a few practical questions to see useful framework starting points and next steps.
            Your answers stay in this page session; they are not sent or saved.
          </p>
        </div>
        <CtaLink to={action.to} className="shrink-0">
          {action.label}
        </CtaLink>
      </div>
    </Section>
  );
}
