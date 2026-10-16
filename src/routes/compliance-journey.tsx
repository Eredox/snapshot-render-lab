import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

import { CtaLink } from "@/components/site/cta";
import { Card, PageHero, Section, SectionHeading } from "@/components/site/primitives";
import { appUrls } from "@/config/site";
import {
  buildJourneyGuidance,
  createInitialJourneyAnswers,
  journeyFrameworkOptions,
  journeyStageCount,
  type JourneyAnswers,
} from "@/lib/compliance-journey";
import { breadcrumbSchema, ldScript, pageMeta } from "@/lib/seo";

export const Route = createFileRoute("/compliance-journey")({
  head: () => ({
    ...pageMeta({
      title: "Start your compliance journey | NOVA Compliance",
      description:
        "Answer a few practical questions to identify useful NOVA framework starting points without spreadsheets or sending your answers anywhere.",
      path: "/compliance-journey",
    }),
    scripts: [
      ldScript(breadcrumbSchema([{ label: "Compliance journey", to: "/compliance-journey" }])),
    ],
  }),
  component: ComplianceJourneyPage,
});

const stageTitles = [
  "About your organisation",
  "Your operating context",
  "Your goals and framework interests",
  "Your current preparation",
  "Your next step",
] as const;

const organisationTypes = [
  ["saas", "SaaS or technology business"],
  ["professional-services", "Professional services"],
  ["healthcare", "Healthcare organisation"],
  ["financial-services", "Financial services or payments"],
  ["public-sector", "Public sector or defence"],
  ["other", "Another organisation type"],
] as const;

const organisationSizes = [
  ["1-10", "1–10 people"],
  ["11-50", "11–50 people"],
  ["51-250", "51–250 people"],
  ["251+", "251+ people"],
] as const;

const industries = [
  ["technology", "Technology or software"],
  ["healthcare", "Healthcare"],
  ["financial-services", "Financial services or payments"],
  ["public-sector", "Public sector or defence"],
  ["professional-services", "Professional services"],
  ["other", "Another industry"],
] as const;

const geographies = [
  ["australia", "Australia"],
  ["eu-eea", "European Union or EEA"],
  ["uk", "United Kingdom"],
  ["us", "United States"],
  ["other", "Other or global operations"],
] as const;

const regulatoryContexts = [
  ["customer-procurement", "Customer or procurement requirements"],
  ["privacy", "Privacy or data handling responsibilities"],
  ["sector", "Sector-specific requirements"],
  ["ai-use", "AI use or AI-enabled products"],
  ["not-sure", "I am not sure yet"],
] as const;

const goals = [
  ["security-assurance", "Build customer trust or security assurance"],
  ["cyber-resilience", "Establish a practical security baseline"],
  ["ai-governance", "Govern AI use with human oversight"],
  ["privacy", "Understand privacy and data handling work"],
  ["customer-requirements", "Respond to sector or customer requirements"],
] as const;

const maturityOptions = [
  ["starting", "We are just starting"],
  ["some", "Some work exists, but it is spread across places"],
  ["operating", "The work is operating and owned"],
  ["reviewed", "The work is regularly reviewed"],
  ["not-sure", "I am not sure yet"],
] as const;

const decisionOptions = [
  ["scope", "How to scope our organisation and programme"],
  ["framework", "Which framework to explore first"],
  ["evidence", "What evidence is useful to review"],
  ["conversation", "What to bring to a NOVA conversation"],
] as const;

function ComplianceJourneyPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<JourneyAnswers>(createInitialJourneyAnswers);
  const [showResults, setShowResults] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const progressId = useId();

  useEffect(() => {
    headingRef.current?.focus();
  }, [showResults, step]);

  const updateAnswer = <K extends keyof JourneyAnswers>(key: K, value: JourneyAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
  };

  const toggleAnswer = (
    key: "geographies" | "regulatoryContext" | "goals" | "frameworkInterests" | "decisions",
    value: string,
  ) => {
    setAnswers((current) => {
      const selected = current[key];
      return {
        ...current,
        [key]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  const restart = () => {
    setAnswers(createInitialJourneyAnswers());
    setStep(0);
    setShowResults(false);
  };

  const goNext = () => {
    if (step === journeyStageCount - 1) {
      setShowResults(true);
      return;
    }
    setStep((current) => Math.min(current + 1, journeyStageCount - 1));
  };

  const goBack = () => {
    if (showResults) {
      setShowResults(false);
      setStep(journeyStageCount - 1);
      return;
    }
    setStep((current) => Math.max(current - 1, 0));
  };

  const guidance = showResults ? buildJourneyGuidance(answers) : null;

  return (
    <>
      <PageHero
        eyebrow="Guided compliance journey"
        title="Start your compliance journey without spreadsheets"
        description="Answer a few practical questions and get a clear set of preliminary framework starting points. NOVA AI is designed to work alongside you; this page keeps the first decisions with you and does not send or save your answers."
        breadcrumbs={[{ label: "Compliance journey", to: "/compliance-journey" }]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:items-start">
          <div>
            <SectionHeading
              eyebrow="Five practical stages"
              title="A useful first conversation with yourself"
              description="You can skip anything that is not ready to answer, go back to correct a response and restart at any time. There are no scores and no automatic compliance conclusions."
            />
            <ol className="mt-8 space-y-4" aria-label="Questionnaire stages">
              {stageTitles.map((title, index) => (
                <li key={title} className="flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                      index === step && !showResults
                        ? "bg-primary text-primary-foreground"
                        : "bg-primary-soft text-accent-foreground"
                    }`}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <span className="pt-1 text-sm text-muted-foreground">{title}</span>
                </li>
              ))}
            </ol>
            <p className="mt-8 rounded-xl border border-border bg-surface p-4 text-sm text-muted-foreground">
              Suggested frameworks are conversation starters. They are not legal advice, a binding
              applicability decision, a certification or a readiness score.
            </p>
          </div>

          <div id="questionnaire">
            <Card className="p-5 sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-primary">
                    {showResults
                      ? "Your preliminary guidance"
                      : `Stage ${step + 1} of ${journeyStageCount}`}
                  </p>
                  <h2
                    ref={headingRef}
                    tabIndex={-1}
                    className="mt-1 text-2xl font-semibold outline-none"
                  >
                    {showResults ? "Your starting points" : stageTitles[step]}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border px-3 text-sm font-medium hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                >
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                  Restart
                </button>
              </div>

              <div
                id={progressId}
                className="mt-6 h-2 overflow-hidden rounded-full bg-secondary"
                role="progressbar"
                aria-label="Questionnaire progress"
                aria-valuemin={1}
                aria-valuemax={journeyStageCount}
                aria-valuenow={showResults ? journeyStageCount : step + 1}
              >
                <span
                  className="block h-full rounded-full bg-primary transition-[width]"
                  style={{
                    width: `${((showResults ? journeyStageCount : step + 1) / journeyStageCount) * 100}%`,
                  }}
                />
              </div>

              <p className="sr-only" aria-live="polite">
                {showResults
                  ? "Preliminary guidance is ready."
                  : `Stage ${step + 1} of ${journeyStageCount}: ${stageTitles[step]}`}
              </p>

              {showResults && guidance ? (
                <GuidanceResults guidance={guidance} onBack={goBack} onRestart={restart} />
              ) : (
                <form
                  className="mt-8"
                  onSubmit={(event) => {
                    event.preventDefault();
                    goNext();
                  }}
                >
                  {step === 0 ? <StageOne answers={answers} updateAnswer={updateAnswer} /> : null}
                  {step === 1 ? (
                    <StageTwo
                      answers={answers}
                      updateAnswer={updateAnswer}
                      toggleAnswer={toggleAnswer}
                    />
                  ) : null}
                  {step === 2 ? <StageThree answers={answers} toggleAnswer={toggleAnswer} /> : null}
                  {step === 3 ? <StageFour answers={answers} updateAnswer={updateAnswer} /> : null}
                  {step === 4 ? (
                    <StageFive
                      answers={answers}
                      updateAnswer={updateAnswer}
                      toggleAnswer={toggleAnswer}
                    />
                  ) : null}

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
                    <button
                      type="button"
                      onClick={goBack}
                      disabled={step === 0}
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-40"
                    >
                      <ArrowLeft aria-hidden="true" className="h-4 w-4" />
                      Back
                    </button>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={goNext}
                        className="inline-flex min-h-11 items-center rounded-lg px-4 text-sm font-medium text-primary hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {step === journeyStageCount - 1 ? "Skip to guidance" : "Skip this stage"}
                      </button>
                      <button
                        type="submit"
                        className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                      >
                        {step === journeyStageCount - 1 ? "See guidance" : "Continue"}
                        <ArrowRight aria-hidden="true" className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

function StageOne({
  answers,
  updateAnswer,
}: {
  answers: JourneyAnswers;
  updateAnswer: <K extends keyof JourneyAnswers>(key: K, value: JourneyAnswers[K]) => void;
}) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-base font-semibold">What best describes your organisation?</legend>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose the closest fit. This is optional.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {organisationTypes.map(([value, label]) => (
            <RadioOption
              key={value}
              name="organisation-type"
              value={value}
              label={label}
              checked={answers.organisationType === value}
              onChange={() => updateAnswer("organisationType", value)}
            />
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-base font-semibold">
          Approximately how large is your organisation?
        </legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {organisationSizes.map(([value, label]) => (
            <RadioOption
              key={value}
              name="organisation-size"
              value={value}
              label={label}
              checked={answers.organisationSize === value}
              onChange={() => updateAnswer("organisationSize", value)}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
}

function StageTwo({
  answers,
  updateAnswer,
  toggleAnswer,
}: {
  answers: JourneyAnswers;
  updateAnswer: <K extends keyof JourneyAnswers>(key: K, value: JourneyAnswers[K]) => void;
  toggleAnswer: (key: "geographies" | "regulatoryContext", value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-base font-semibold">Which industry context is closest?</legend>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {industries.map(([value, label]) => (
            <RadioOption
              key={value}
              name="industry"
              value={value}
              label={label}
              checked={answers.industry === value}
              onChange={() => updateAnswer("industry", value)}
            />
          ))}
        </div>
      </fieldset>
      <CheckboxGroup
        legend="Where do you operate or serve customers?"
        options={geographies}
        selected={answers.geographies}
        onToggle={(value) => toggleAnswer("geographies", value)}
      />
      <CheckboxGroup
        legend="Which context should we keep in view?"
        options={regulatoryContexts}
        selected={answers.regulatoryContext}
        onToggle={(value) => toggleAnswer("regulatoryContext", value)}
      />
    </div>
  );
}

function StageThree({
  answers,
  toggleAnswer,
}: {
  answers: JourneyAnswers;
  toggleAnswer: (key: "goals" | "frameworkInterests", value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <CheckboxGroup
        legend="What would you like your first compliance plan to help with?"
        options={goals}
        selected={answers.goals}
        onToggle={(value) => toggleAnswer("goals", value)}
      />
      <CheckboxGroup
        legend="Which frameworks would you like to explore?"
        description="These are the frameworks in NOVA's verified public catalogue. You can choose more than one."
        options={journeyFrameworkOptions.map(
          (framework) =>
            [framework.value, `${framework.label} — ${framework.availability}`] as const,
        )}
        selected={answers.frameworkInterests}
        onToggle={(value) => toggleAnswer("frameworkInterests", value)}
      />
    </div>
  );
}

function StageFour({
  answers,
  updateAnswer,
}: {
  answers: JourneyAnswers;
  updateAnswer: <K extends keyof JourneyAnswers>(key: K, value: JourneyAnswers[K]) => void;
}) {
  return (
    <div className="space-y-6">
      <SelectQuestion
        id="controls-maturity"
        label="How would you describe your controls today?"
        value={answers.controlsMaturity}
        onChange={(value) => updateAnswer("controlsMaturity", value)}
      />
      <SelectQuestion
        id="policy-maturity"
        label="How would you describe your policies today?"
        value={answers.policyMaturity}
        onChange={(value) => updateAnswer("policyMaturity", value)}
      />
      <SelectQuestion
        id="evidence-maturity"
        label="How would you describe your evidence today?"
        value={answers.evidenceMaturity}
        onChange={(value) => updateAnswer("evidenceMaturity", value)}
      />
      <SelectQuestion
        id="preparation-maturity"
        label="How prepared do you feel to begin?"
        value={answers.preparationMaturity}
        onChange={(value) => updateAnswer("preparationMaturity", value)}
      />
    </div>
  );
}

function StageFive({
  answers,
  updateAnswer,
  toggleAnswer,
}: {
  answers: JourneyAnswers;
  updateAnswer: <K extends keyof JourneyAnswers>(key: K, value: JourneyAnswers[K]) => void;
  toggleAnswer: (key: "decisions", value: string) => void;
}) {
  return (
    <div className="space-y-8">
      <fieldset>
        <legend className="text-base font-semibold">What would be most useful next?</legend>
        <div className="mt-4 space-y-3">
          <RadioOption
            name="next-step"
            value="free-workspace"
            label="Start with the Free NOVA workspace"
            checked={answers.nextStepPreference === "free-workspace"}
            onChange={() => updateAnswer("nextStepPreference", "free-workspace")}
          />
          <RadioOption
            name="next-step"
            value="book-demo"
            label="Book a conversation about our scope"
            checked={answers.nextStepPreference === "book-demo"}
            onChange={() => updateAnswer("nextStepPreference", "book-demo")}
          />
          <RadioOption
            name="next-step"
            value="self-review"
            label="Keep reviewing options with our team first"
            checked={answers.nextStepPreference === "self-review"}
            onChange={() => updateAnswer("nextStepPreference", "self-review")}
          />
        </div>
      </fieldset>
      <CheckboxGroup
        legend="Which decisions would you like to keep in your hands?"
        description="This helps shape the next conversation; it does not create a task or submit a lead."
        options={decisionOptions}
        selected={answers.decisions}
        onToggle={(value) => toggleAnswer("decisions", value)}
      />
    </div>
  );
}

function GuidanceResults({
  guidance,
  onBack,
  onRestart,
}: {
  guidance: ReturnType<typeof buildJourneyGuidance>;
  onBack: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="mt-8" aria-live="polite">
      <p className="text-muted-foreground">{guidance.summary}</p>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Suggested framework starting points</h3>
        {guidance.recommendations.length > 0 ? (
          <div className="mt-4 space-y-3">
            {guidance.recommendations.map(({ framework, reason }) => (
              <div key={framework.slug} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{framework.shortName}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{reason}</p>
                  </div>
                  <CtaLink
                    to={`/frameworks/${framework.slug}`}
                    variant="outline"
                    className="shrink-0"
                  >
                    Explore framework
                  </CtaLink>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {framework.availability}. Suggested starting point only; applicability depends on
                  your obligations, scope and evidence.
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No framework was selected yet. You can compare the verified public catalogue before
            choosing a starting point.
          </p>
        )}
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold">Preliminary next steps</h3>
        <ol className="mt-4 space-y-3">
          {guidance.nextSteps.map((step, index) => (
            <li key={step} className="flex items-start gap-3 text-sm text-muted-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-accent-foreground">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-8 rounded-xl border border-border bg-primary-soft/40 p-5">
        <h3 className="font-semibold">Your decisions stay with you</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          This guidance does not approve anything, assess legal applicability or create a NOVA
          record. Review the options with the people accountable for your programme.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <CtaLink to={appUrls.register} external>
            Start Free
          </CtaLink>
          <CtaLink to="/book-demo" variant="outline">
            Book a Demo
          </CtaLink>
          <CtaLink to="/frameworks" variant="ghost">
            Browse all frameworks
          </CtaLink>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          Edit answers
        </button>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-4 text-sm font-medium text-primary hover:bg-primary-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          Start again
        </button>
      </div>
    </div>
  );
}

function RadioOption({
  name,
  value,
  label,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm hover:bg-surface focus-within:ring-2 focus-within:ring-primary">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

function CheckboxGroup({
  legend,
  description,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  description?: string;
  options: readonly (readonly [string, string])[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-base font-semibold">{legend}</legend>
      {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {options.map(([value, label]) => (
          <label
            key={value}
            className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm hover:bg-surface focus-within:ring-2 focus-within:ring-primary"
          >
            <input
              type="checkbox"
              value={value}
              checked={selected.includes(value)}
              onChange={() => onToggle(value)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SelectQuestion({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-base font-semibold">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 flex min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">Skip for now</option>
        {maturityOptions.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
