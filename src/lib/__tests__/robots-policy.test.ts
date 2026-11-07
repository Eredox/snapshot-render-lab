import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { organizationSchema } from "@/lib/seo";

/** Minimal group reader: agent -> rules. Enough to pin the policy; the full RFC 9309 matcher lives in scripts/discovery. */
function groups(text: string) {
  const out = new Map<string, string[]>();
  let current: string[] = [];
  let lastWasAgent = false;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [key = "", ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (key.toLowerCase() === "user-agent") {
      if (!lastWasAgent) current = [];
      current.push(value.toLowerCase());
      lastWasAgent = true;
    } else if (/^(allow|disallow)$/i.test(key)) {
      lastWasAgent = false;
      for (const agent of current) out.set(agent, [...(out.get(agent) ?? []), `${key.toLowerCase()}:${value}`]);
    }
  }
  return out;
}

const robots = readFileSync("public/robots.txt", "utf8");
const g = groups(robots);

describe("robots.txt discovery policy", () => {
  it("allows search, AI-search and user-initiated crawlers", () => {
    for (const agent of ["googlebot", "bingbot", "oai-searchbot", "claude-searchbot", "perplexitybot", "chatgpt-user", "claude-user", "perplexity-user", "*"]) {
      expect(g.get(agent), agent).toEqual(["allow:/"]);
    }
  });

  it("keeps the model-training policy exactly as approved by the Founder (NOVA-WEB-RELEASE-003): GPTBot, ClaudeBot, Google-Extended allowed; CCBot restricted", () => {
    expect(g.get("gptbot")).toEqual(["allow:/"]);
    expect(g.get("claudebot")).toEqual(["allow:/"]);
    expect(g.get("google-extended")).toEqual(["allow:/"]);
    expect(g.get("ccbot")).toEqual(["disallow:/"]);
  });

  it("references the canonical sitemap and never blocks everything", () => {
    expect(robots).toMatch(/^Sitemap: https:\/\/www\.nova\.eredox\.com\/sitemap\.xml\s*$/m);
    expect([...g.values()].flat().filter((r) => r === "disallow:/").length).toBe(1); // CCBot only
  });
});

describe("organisation structured data", () => {
  it("states the Eredox / NOVA relationship with published facts only", () => {
    const org = organizationSchema() as Record<string, unknown>;
    expect(org["legalName"]).toBe("Eredox Pty Ltd");
    expect(org["brand"]).toMatchObject({ "@type": "Brand", name: "NOVA Compliance" });
    expect(org["identifier"]).toMatchObject({ propertyID: "ABN", value: "32 634 165 941" });
    for (const forbidden of ["aggregateRating", "review", "award", "hasCredential", "offers"]) expect(org).not.toHaveProperty(forbidden);
  });
});
