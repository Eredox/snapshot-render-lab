import { frameworks } from "./frameworks";

/**
 * Governed commercial catalogue summary for public positioning.
 *
 * This count represents NOVA's wider framework capability catalogue. It is
 * intentionally separate from the eight detailed framework cards and the
 * regional discovery register, which contain different scopes of information.
 */
export const governedFrameworkCatalogue = {
  availableCount: 27,
  detailedPublicSubsetCount: frameworks.length,
  availabilityNote:
    "The catalogue includes frameworks available now and frameworks available by configuration; activation depends on customer scope, data and evidence.",
} as const;
