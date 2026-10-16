import { describe, expect, it } from "vitest";

import {
  buildJourneyGuidance,
  createInitialJourneyAnswers,
  recommendFrameworks,
} from "@/lib/compliance-journey";

describe("guided compliance journey", () => {
  it("starts with empty, local-only answers", () => {
    expect(createInitialJourneyAnswers()).toEqual({
      organisationType: "",
      organisationSize: "",
      industry: "",
      geographies: [],
      regulatoryContext: [],
      goals: [],
      frameworkInterests: [],
      controlsMaturity: "",
      policyMaturity: "",
      evidenceMaturity: "",
      preparationMaturity: "",
      nextStepPreference: "",
      decisions: [],
    });
  });

  it("uses only selected answers and verified catalogue entries for recommendations", () => {
    const answers = createInitialJourneyAnswers();
    answers.goals = ["ai-governance"];
    answers.frameworkInterests = ["iso-27001", "not-a-framework"];

    expect(recommendFrameworks(answers).map(({ framework }) => framework.slug)).toEqual([
      "iso-27001",
      "iso-42001",
    ]);
  });

  it("keeps skipped answers useful without inventing a score or legal conclusion", () => {
    const guidance = buildJourneyGuidance(createInitialJourneyAnswers());

    expect(guidance.recommendations).toHaveLength(0);
    expect(guidance.summary).toContain("not a compliance score");
    expect(guidance.nextSteps).toContain(
      "Start with the Frameworks catalogue to compare available and configurable options.",
    );
  });

  it("produces deterministic contextual suggestions without claiming applicability", () => {
    const answers = createInitialJourneyAnswers();
    answers.industry = "healthcare";
    answers.geographies = ["australia"];
    answers.regulatoryContext = ["ai-use"];

    const guidance = buildJourneyGuidance(answers);
    expect(guidance.recommendations.map(({ framework }) => framework.slug)).toEqual([
      "essential-eight",
      "iso-42001",
      "hipaa",
    ]);
    expect(guidance.recommendations.every(({ reason }) => reason.length > 10)).toBe(true);
  });
});
