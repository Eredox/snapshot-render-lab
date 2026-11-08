import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { handleAssistantRequest, resetAssistantGuardsForTests } from "../assistant-server";
import { retrieveKnowledge } from "../assistant-knowledge";
import { topicForPath } from "../assistant-topics";

const SID = "abcdefghijklmnop-0001";
const post = (body: unknown, ip = "203.0.113.5") =>
  handleAssistantRequest(
    new Request("https://www.nova.eredox.com/api/assistant", {
      method: "POST",
      headers: { "content-type": "application/json", origin: "https://www.nova.eredox.com", "x-real-ip": ip },
      body: JSON.stringify(body),
    }),
  );

describe("assistant server", () => {
  beforeEach(() => {
    resetAssistantGuardsForTests();
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ content: [{ type: "text", text: "A grounded answer." }] }), { status: 200 })));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("answers, counts across pages and stops at seven", async () => {
    for (let i = 1; i <= 7; i++) {
      const res = await post({ sid: SID, question: `Question ${i} about ISO 27001`, path: i % 2 ? "/pricing" : "/frameworks/iso-27001" });
      expect(res.status).toBe(200);
      expect(((await res.json()) as { used: number }).used).toBe(i);
    }
    const eighth = await post({ sid: SID, question: "One more?", path: "/" });
    expect(eighth.status).toBe(429);
    expect(((await eighth.json()) as { code: string }).code).toBe("limit");
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(7);
  });

  it("does not consume the allowance when the AI provider fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));
    const res = await post({ sid: SID, question: "What is NOVA?", path: "/" });
    expect(res.status).toBe(502);
    expect(((await res.json()) as { remaining: number }).remaining).toBe(7);
  });

  it("is honestly unavailable (503, no simulated answer) without an API key", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");
    const res = await post({ sid: SID, question: "What is NOVA?", path: "/" });
    expect(res.status).toBe(503);
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
    const status = await handleAssistantRequest(new Request("https://www.nova.eredox.com/api/assistant"));
    expect(((await status.json()) as { available: boolean }).available).toBe(false);
  });

  it("rejects cross-origin, bad ids and over-long questions", async () => {
    const cross = await handleAssistantRequest(
      new Request("https://www.nova.eredox.com/api/assistant", { method: "POST", headers: { "content-type": "application/json", origin: "https://evil.example" }, body: "{}" }),
    );
    expect(cross.status).toBe(403);
    expect((await post({ sid: "short", question: "x", path: "/" })).status).toBe(400);
    expect((await post({ sid: SID, question: "x".repeat(401), path: "/" })).status).toBe(400);
  });

  it("a fresh session id cannot bypass the per-client daily ceiling", async () => {
    let blocked = 0;
    for (let i = 0; i < 30; i++) {
      const res = await post({ sid: `session-number-${String(i).padStart(4, "0")}`, question: "What is NOVA?", path: "/" }, "198.51.100.9");
      if (res.status === 429) blocked++;
    }
    expect(blocked).toBeGreaterThan(0);
  });
});

describe("assistant knowledge and topics", () => {
  it("retrieves public framework knowledge and no secrets", () => {
    const { text, sources } = retrieveKnowledge("How are ISO 27001 controls tracked?", "/frameworks/iso-27001");
    expect(sources).toContain("/frameworks/iso-27001");
    expect(text.length).toBeGreaterThan(200);
    expect(text).not.toMatch(/api[_-]?key|secret|password/i);
  });

  it("gives three page-specific questions", () => {
    for (const p of ["/", "/pricing", "/frameworks/iso-27001", "/frameworks/iso-42001", "/features/risk-management", "/features/policies", "/resources/blog/x"]) {
      expect(topicForPath(p).questions).toHaveLength(3);
    }
    expect(topicForPath("/frameworks/iso-42001").label).toBe("ISO 42001");
  });
});
