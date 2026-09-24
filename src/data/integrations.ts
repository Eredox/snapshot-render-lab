import { Cloud, Database, FileText, Github, MessageSquare, Shield, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IntegrationStatus = "Available now" | "Planned";

export type Integration = {
  name: string;
  status: IntegrationStatus;
  category: string;
  description: string;
  icon: LucideIcon;
};

/** Public connector inventory. Statuses must reflect actual implementation. */
export const integrations: Integration[] = [
  {
    name: "GitHub",
    status: "Available now",
    category: "Evidence",
    description: "Pull engineering evidence such as pull requests, workflows and deployment records into the workspace for review.",
    icon: Github,
  },
  {
    name: "Manual upload",
    status: "Available now",
    category: "Evidence",
    description: "Upload files, screenshots, exports and documents with structured metadata and control mapping.",
    icon: FileText,
  },
  {
    name: "Cloud identity providers",
    status: "Planned",
    category: "Access",
    description: "SAML or OIDC sign-in for workforce access. Not available today.",
    icon: Cloud,
  },
  {
    name: "Ticketing and workflow tools",
    status: "Planned",
    category: "Operations",
    description: "Link change approvals, incidents and tasks to controls and evidence. Not available today.",
    icon: MessageSquare,
  },
  {
    name: "Cloud infrastructure providers",
    status: "Planned",
    category: "Evidence",
    description: "Collect configuration and logging evidence from cloud accounts. Not available today.",
    icon: Database,
  },
  {
    name: "Vulnerability and security tools",
    status: "Planned",
    category: "Security",
    description: "Bring scan results and security findings in as evidence against relevant controls. Not available today.",
    icon: Shield,
  },
  {
    name: "Calendar and review systems",
    status: "Planned",
    category: "Governance",
    description: "Schedule control reviews and policy attestations. Not available today.",
    icon: Clock,
  },
];
