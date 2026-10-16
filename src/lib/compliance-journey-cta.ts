export function normalizePathname(pathname: string): string {
  const pathOnly = pathname.split(/[?#]/, 1)[0] ?? pathname;
  return pathOnly.replace(/\/+$/, "") || "/";
}

export function shouldRenderRootComplianceJourneyCta(pathname: string): boolean {
  return normalizePathname(pathname) !== "/pricing";
}

export function getComplianceJourneyCtaAction(pathname: string): {
  label: string;
  to: string;
} {
  if (normalizePathname(pathname) === "/compliance-journey") {
    return { label: "Revisit the assessment", to: "/compliance-journey#questionnaire" };
  }

  return { label: "Start the guided journey", to: "/compliance-journey" };
}
