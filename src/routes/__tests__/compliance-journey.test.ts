import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { journeyStageCount } from "@/lib/compliance-journey";

describe("compliance journey route contract", () => {
  const route = readFileSync(resolve(process.cwd(), "src/routes/compliance-journey.tsx"), "utf8");

  it("provides the five stages, backwards navigation, skipping and restart", () => {
    expect(journeyStageCount).toBe(5);
    expect(route).toContain("Skip this stage");
    expect(route).toContain("Edit answers");
    expect(route).toContain("Restart");
    expect(route).toContain("onClick={goBack}");
  });

  it("keeps answers local and does not submit or persist questionnaire data", () => {
    expect(route).toContain("useState<JourneyAnswers>");
    expect(route).toContain("event.preventDefault()");
    expect(route).not.toContain("fetch(");
    expect(route).not.toContain("localStorage");
    expect(route).not.toContain("sessionStorage");
    expect(route).not.toContain("navigator.sendBeacon");
  });

  it("includes accessible form semantics, announcements and governed next-step links", () => {
    expect(route).toContain('aria-live="polite"');
    expect(route).toContain('role="progressbar"');
    expect(route).toContain("<fieldset>");
    expect(route).toContain("<legend");
    expect(route).toContain("htmlFor={id}");
    expect(route).toContain("to={appUrls.register}");
    expect(route).toContain('to="/book-demo"');
    expect(route).toContain('to="/frameworks"');
  });
});
