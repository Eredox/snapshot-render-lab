export type PlanDetail = {
  evidenceAndAutomation: string;
  governanceAndHumanApproval: string[];
  limitations: string[];
  upgradePath: string;
  commercialNote?: string;
};

/** Plan-specific guidance used by the dedicated plan pages. Commercial values and entitlements remain in pricing.ts. */
export const planDetails: Record<string, PlanDetail> = {
  free: {
    evidenceAndAutomation:
      "Evaluate the workflow with manual evidence upload and a small control set. Evidence remains a governed record and still needs the appropriate human review before it supports readiness decisions.",
    governanceAndHumanApproval: [
      "Use the core control library to establish initial ownership and scope.",
      "Review evidence and decide what is sufficient for your programme.",
      "Keep readiness, risk and external assurance decisions with accountable people.",
    ],
    limitations: ["The Free entitlement is intended for evaluation and initial readiness work."],
    upgradePath:
      "Move to a paid plan when you need broader framework scope, deeper control workflows, additional evidence capabilities or more structured support.",
  },
  launch: {
    evidenceAndAutomation:
      "Run a first certification or attestation programme with evidence mapping, reviewer validation and the policy workflow described in the Launch entitlements.",
    governanceAndHumanApproval: [
      "Assign control ownership and review cadence.",
      "Validate mapped evidence before it counts towards readiness.",
      "Record policy approvals and readiness decisions with human accountability.",
    ],
    limitations: ["Commercial onboarding is handled through the governed Launch sales handoff."],
    upgradePath:
      "Move to Growth when you need the higher authorised-repository allowance, risk treatment and deeper evidence operations.",
    commercialNote:
      "Secure paid checkout is not currently connected on the public website. Start now opens the governed Launch sales handoff with the selected plan preserved.",
  },
  growth: {
    evidenceAndAutomation:
      "Use one shared control set across three frameworks, with evidence reuse and the GitHub evidence connector available as governed capabilities in this plan.",
    governanceAndHumanApproval: [
      "Track control ownership, risk treatment and explicit acceptance decisions.",
      "Reuse evidence only where the mapping genuinely satisfies each requirement.",
      "Keep reviewer validation and final readiness decisions human-led.",
    ],
    limitations: ["Commercial terms require sales contact."],
    upgradePath:
      "Move to Professional when you need recurring external review workflows, Trust Centre publication and broader assurance operations.",
  },
  professional: {
    evidenceAndAutomation:
      "Operate an assurance-grade programme with the Growth evidence and control capabilities plus external review workflows, scoped auditor access and Trust Centre publication.",
    governanceAndHumanApproval: [
      "Manage policies, controls, risks and assets as connected governed records.",
      "Approve what is shared with auditors and external audiences.",
      "Use readiness reporting to support, not replace, the human decision to proceed.",
    ],
    limitations: ["Broader business-unit scope and executive views follow the Business entitlement."],
    upgradePath:
      "Move to Business when you need broader users, scopes, AI assistance across the programme and executive reporting views.",
  },
  business: {
    evidenceAndAutomation:
      "Extend the Professional operating model across broader scope with multiple users, business-unit coverage, AI assistance and executive reporting views.",
    governanceAndHumanApproval: [
      "Connect policies, risks, assets, controls and evidence across the wider programme.",
      "Keep AI assistance advisory and subject to human review and approval.",
      "Use executive reporting to inform accountable governance decisions.",
    ],
    limitations: ["Commercial terms require sales contact."],
    upgradePath:
      "Move to Enterprise when your scope, users, business units or assurance obligations need a tailored commercial and onboarding arrangement.",
  },
  enterprise: {
    evidenceAndAutomation:
      "Define the evidence, integrations, onboarding and assurance operating model around your organisation's scope rather than a fixed package.",
    governanceAndHumanApproval: [
      "Agree framework scope, roles, controls, policies and evidence workflows during onboarding.",
      "Retain tenant boundaries, approval gates and traceable records across the programme.",
      "Use tailored assurance workflows without transferring final decisions to NOVA.",
    ],
    limitations: ["Pricing and implementation require an approved quote."],
    upgradePath:
      "Enterprise is the tailored path for complex environments; the quote defines the agreed scope, commercial terms and onboarding plan.",
  },
};

export function getPlanDetail(slug: string): PlanDetail | undefined {
  return planDetails[slug];
}
