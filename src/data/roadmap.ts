import { features } from "@/data/features";
import { frameworks } from "@/data/frameworks";

/**
 * Public product roadmap. Entries are derived from the central feature and
 * framework data so the roadmap cannot drift from what the rest of the site
 * claims. Statuses are honest: nothing planned is presented as available.
 */

export type RoadmapStatus =
  | "Available now"
  | "Available connected to your data"
  | "Custom framework available"
  | "Partly available"
  | "Planned";

export type RoadmapEntry = {
  title: string;
  status: RoadmapStatus;
  area: "Capability" | "Framework";
  description: string;
  to: string;
};

export const roadmapEntries: RoadmapEntry[] = [
  ...features.map((f) => ({
    title: f.navLabel,
    status: f.availability,
    area: "Capability" as const,
    description: f.summary,
    to: f.path,
  })),
  ...frameworks.map((f) => ({
    title: f.name,
    status: f.availability,
    area: "Framework" as const,
    description: f.description,
    to: `/frameworks/${f.slug}`,
  })),
];

export const roadmapStatusOrder: RoadmapStatus[] = [
  "Available now",
  "Available connected to your data",
  "Custom framework available",
  "Partly available",
  "Planned",
];

export const roadmapNote =
  "The roadmap reflects current development intent, not a commitment. Timing and scope can change, and planned items are never represented as operational.";
