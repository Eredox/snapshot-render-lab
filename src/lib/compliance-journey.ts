import { frameworks, type Framework } from "@/data/frameworks";

export const journeyStageCount = 5;

export type JourneyAnswers = {
  organisationType: string;
  organisationSize: string;
  industry: string;
  geographies: string[];
  regulatoryContext: string[];
  goals: string[];
  frameworkInterests: string[];
  controlsMaturity: string;
  policyMaturity: string;
  evidenceMaturity: string;
  preparationMaturity: string;
  nextStepPreference: string;
  decisions: string[];
};

export function createInitialJourneyAnswers(): JourneyAnswers {
  return {
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
  };
}

export const journeyFrameworkOptions = frameworks.map((framework) => ({
  value: framework.slug,
  label: framework.shortName,
  availability: framework.availability,
}));

export type JourneyRecommendation = {
  framework: Framework;
  reason: string;
};

export type JourneyGuidance = {
  summary: string;
  recommendations: JourneyRecommendation[];
  nextSteps: string[];
};

function recommendationFor(recommendations: JourneyRecommendation[], slug: string, reason: string) {
  const framework = frameworks.find((item) => item.slug === slug);
  if (!framework || recommendations.some((item) => item.framework.slug === slug)) return;
  recommendations.push({ framework, reason });
}

export function recommendFrameworks(answers: JourneyAnswers): JourneyRecommendation[] {
  const recommendations: JourneyRecommendation[] = [];

  for (const slug of answers.frameworkInterests) {
    const framework = frameworks.find((item) => item.slug === slug);
    if (framework) {
      recommendationFor(
        recommendations,
        slug,
        `You selected ${framework.shortName} as a framework you want to explore.`,
      );
    }
  }

  if (answers.goals.includes("security-assurance")) {
    recommendationFor(
      recommendations,
      "soc-2",
      "You said customer trust or security assurance is a priority.",
    );
    recommendationFor(
      recommendations,
      "iso-27001",
      "You said you want a structured information security baseline.",
    );
  }
  if (answers.goals.includes("cyber-resilience") || answers.geographies.includes("australia")) {
    recommendationFor(
      recommendations,
      "essential-eight",
      "Your answers point to a practical cyber resilience baseline or Australian operations.",
    );
  }
  if (answers.goals.includes("ai-governance") || answers.regulatoryContext.includes("ai-use")) {
    recommendationFor(
      recommendations,
      "iso-42001",
      "You said AI governance or human oversight is part of your context.",
    );
  }
  if (answers.goals.includes("privacy") || answers.regulatoryContext.includes("privacy")) {
    recommendationFor(
      recommendations,
      "gdpr",
      "You said privacy and data handling should be part of the initial conversation.",
    );
  }
  if (answers.industry === "healthcare") {
    recommendationFor(
      recommendations,
      "hipaa",
      "You selected healthcare as your industry context.",
    );
  }
  if (answers.industry === "financial-services") {
    recommendationFor(
      recommendations,
      "pci-dss",
      "You selected financial services or payments as your industry context.",
    );
  }
  if (answers.industry === "public-sector") {
    recommendationFor(
      recommendations,
      "cmmc",
      "You selected public sector or defence as your industry context.",
    );
  }

  return recommendations.slice(0, 4);
}

export function buildJourneyGuidance(answers: JourneyAnswers): JourneyGuidance {
  const recommendations = recommendFrameworks(answers);
  const nextSteps: string[] = [];

  if (recommendations.length > 0) {
    nextSteps.push(
      "Review the suggested framework pages and note which requirements match your scope.",
    );
  } else {
    nextSteps.push(
      "Start with the Frameworks catalogue to compare available and configurable options.",
    );
  }

  if (answers.preparationMaturity === "starting" || answers.preparationMaturity === "not-sure") {
    nextSteps.push(
      "Write down the people, systems and customer commitments that should be inside your initial scope.",
    );
  } else {
    nextSteps.push(
      "Bring your current controls, policies and evidence together so you can review gaps in context.",
    );
  }

  if (answers.nextStepPreference === "free-workspace") {
    nextSteps.push(
      "Use the Free NOVA workspace to record your starting context and continue the governed onboarding path.",
    );
  } else if (answers.nextStepPreference === "book-demo") {
    nextSteps.push(
      "Bring your answers to a Book Demo conversation when you want to discuss scope and framework choices.",
    );
  } else {
    nextSteps.push(
      "Keep the decisions with your team: choose what to scope, which framework to explore and what evidence to review first.",
    );
  }

  const summary =
    recommendations.length > 0
      ? "You have a few useful starting points to review. These are suggestions based on your answers, not a compliance score or a legal conclusion."
      : "You have a useful first outline. These suggestions are not a compliance score or a legal conclusion; the next step is to clarify your scope and compare framework options with your team.";

  return { summary, recommendations, nextSteps };
}
