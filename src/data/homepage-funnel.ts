import { ClipboardCheck, Gavel, ShieldCheck, UsersRound } from "lucide-react";

export const homepageFunnelSectionOrder = [
  "hero",
  "ai-governance",
  "audience",
  "why-nova",
  "product-proof",
  "frameworks",
  "outcomes",
  "trust",
  "faq",
  "pricing",
  "final-cta",
] as const;

export const audiencePaths = [
  {
    key: "founders-growing-teams",
    title: "Founders & growing teams",
    body: "Get compliance under control without building an enterprise-sized compliance department.",
    cta: "Explore NOVA for growing teams",
    imagePath: "/media/audience/nova-founders-growing-teams.webp",
    imageAlt: "Founder and leadership team reviewing compliance and governance priorities",
    imageWidth: 1448,
    imageHeight: 1086,
    to: "/solutions/startups-saas",
    imageLabel: "Founder or small leadership team working in a contemporary business environment",
    icon: UsersRound,
    tone: "from-primary-soft to-surface",
  },
  {
    key: "compliance-risk-teams",
    title: "Compliance & risk teams",
    body: "Bring frameworks, controls, evidence, policies and risk together in one connected platform.",
    cta: "Explore NOVA for compliance teams",
    imagePath: "/media/audience/nova-compliance-risk-team.webp",
    imageAlt: "Compliance and risk professionals reviewing controls and evidence",
    imageWidth: 1448,
    imageHeight: 1086,
    to: "/solutions/compliance-teams",
    imageLabel:
      "Compliance or risk professional reviewing governance, evidence, policies or controls",
    icon: ClipboardCheck,
    tone: "from-ember-soft to-surface",
  },
  {
    key: "security-technology-teams",
    title: "Security & technology teams",
    body: "Connect technical security work with the evidence and controls your organisation needs to demonstrate compliance.",
    cta: "Explore NOVA for security teams",
    imagePath: "/media/audience/nova-security-technology-team.webp",
    imageAlt: "Security and technology professionals reviewing system assurance requirements",
    imageWidth: 1448,
    imageHeight: 1086,
    to: "/solutions/technology-smes",
    imageLabel: "Security or technology professional working in a realistic technical environment",
    icon: ShieldCheck,
    tone: "from-secondary to-surface",
  },
  {
    key: "auditors-assurance",
    title: "Auditors & assurance",
    body: "Review controls, evidence and compliance status without chasing spreadsheets, folders and email trails.",
    cta: "Explore NOVA for assurance",
    imagePath: "/media/audience/nova-auditors-assurance.webp",
    imageAlt: "Assurance professionals reviewing compliance evidence and documentation",
    imageWidth: 1448,
    imageHeight: 1086,
    to: "/features/auditor-portal",
    imageLabel: "Auditor or assurance professional reviewing evidence or discussing findings",
    icon: Gavel,
    tone: "from-primary-soft/70 to-ember-soft/60",
  },
] as const;

export const outcomePaths = [
  {
    title: "Get compliance ready",
    body: "Build a structured compliance program and understand what still needs attention.",
    to: "/solutions/compliance-teams",
  },
  {
    title: "Prepare for an audit",
    body: "Organise controls, evidence and supporting information before assurance begins.",
    to: "/features/auditor-portal",
  },
  {
    title: "Manage multiple frameworks",
    body: "Reduce duplicated work and understand where requirements overlap.",
    to: "/frameworks",
  },
  {
    title: "Build stronger governance",
    body: "Bring compliance, policies, risk, evidence and accountability together.",
    to: "/features/risk-management",
  },
] as const;
