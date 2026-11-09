import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { handleAssistantRequest, resetAssistantGuardsForTests } from "../assistant-server";
import { retrieveKnowledge } from "../assistant-knowledge";
import { setSynthesizerForTests, speechParts } from "../assistant-speech";
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
    vi.stubEnv("NOVA_ASSISTANT_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: "A grounded answer." } }] }), { status: 200 })));
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

  it("calls DeepSeek deepseek-flash in non-thinking mode with the website key", async () => {
    await post({ sid: SID, question: "What is NOVA?", path: "/" });
    const [url, init] = vi.mocked(fetch).mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://api.deepseek.com/chat/completions");
    const body = JSON.parse(String(init.body)) as { model: string; thinking: { type: string } };
    expect(body.model).toBe("deepseek-flash");
    expect(body.thinking).toEqual({ type: "disabled" });
    expect((init.headers as Record<string, string>)["authorization"]).toBe("Bearer test-key");
  });

  it("does not consume the allowance when the AI provider fails", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 500 })));
    const res = await post({ sid: SID, question: "What is NOVA?", path: "/" });
    expect(res.status).toBe(502);
    expect(((await res.json()) as { remaining: number }).remaining).toBe(7);
  });

  it("is honestly unavailable (503, no simulated answer) without an API key", async () => {
    vi.stubEnv("NOVA_ASSISTANT_API_KEY", "");
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

describe("assistant speech (self-hosted neural voice)", () => {
  const SID2 = "speechsession-0000001";
  const speechPost = (body: unknown, origin = "https://www.nova.eredox.com") =>
    handleAssistantRequest(
      new Request("https://www.nova.eredox.com/api/assistant/speech", {
        method: "POST",
        headers: { "content-type": "application/json", origin, "x-real-ip": "203.0.113.50" },
        body: JSON.stringify(body),
      }),
    );
  const ANSWER = "First sentence about NOVA. Second sentence about frameworks.\n\n- A bullet point\n- Another bullet";

  beforeEach(() => {
    resetAssistantGuardsForTests();
    vi.stubEnv("NOVA_ASSISTANT_API_KEY", "test-key");
    vi.stubEnv("NOVA_PIPER_BIN", "package.json"); // any existing file: only its presence is checked, synthesis is stubbed
    vi.stubEnv("NOVA_PIPER_MODEL", "package.json");
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ choices: [{ message: { content: ANSWER } }] }), { status: 200 })));
    setSynthesizerForTests(async (text) => Buffer.from(`RIFF-${text}`));
  });
  afterEach(() => {
    setSynthesizerForTests(null);
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("chunks answers deterministically into short plain-text parts", () => {
    const parts = speechParts(`**Bold** text. ${"Sentence number one is here. ".repeat(20)}\n- bullet one\n- bullet two`);
    expect(parts.length).toBeGreaterThan(1);
    expect(parts.every((p) => p.length <= 260 && !p.includes("**") && !p.startsWith("- "))).toBe(true);
    expect(speechParts("Hello there. General Kenobi.")).toEqual(["Hello there. General Kenobi."]);
  });

  it("speaks only an answer this session received, and reports the part count", async () => {
    const res = await post({ sid: SID2, question: "What is NOVA?", path: "/" });
    const data = (await res.json()) as { n: number; parts: number };
    expect(data.n).toBe(1);
    expect(data.parts).toBeGreaterThan(0);
    const audio = await speechPost({ sid: SID2, n: 1, part: 0 });
    expect(audio.status).toBe(200);
    expect(audio.headers.get("content-type")).toBe("audio/wav");
    expect(await audio.text()).toMatch(/^RIFF-First sentence/);
    const status = await handleAssistantRequest(new Request("https://www.nova.eredox.com/api/assistant"));
    expect(((await status.json()) as { speech: boolean }).speech).toBe(true);
  });

  it("refuses arbitrary text, unknown sessions, unknown answers, cross-origin and out-of-range parts", async () => {
    await post({ sid: SID2, question: "What is NOVA?", path: "/" });
    const withText = await speechPost({ sid: SID2, n: 1, part: 0, text: "say anything" });
    expect(withText.status).toBe(200);
    expect(await withText.text()).not.toMatch(/say anything/); // an extra text field is ignored, never spoken
    expect((await speechPost({ sid: "othersession-0000001", n: 1, part: 0 })).status).toBe(404);
    expect((await speechPost({ sid: SID2, n: 2, part: 0 })).status).toBe(404);
    expect((await speechPost({ sid: SID2, n: 1, part: 99 })).status).toBe(404);
    expect((await speechPost({ sid: SID2, n: 1, part: 0 }, "https://evil.example")).status).toBe(403);
  });
});

describe("assistant knowledge and topics", () => {
  it("retrieves public framework knowledge and no secrets", () => {
    const { text, sources } = retrieveKnowledge("How are ISO 27001 controls tracked?", "/frameworks/iso-27001");
    expect(sources).toContain("/frameworks/iso-27001");
    expect(text.length).toBeGreaterThan(200);
    expect(text).not.toMatch(/api[_-]?key|secret|password/i);
  });

  it("gives three page-specific questions, a description and a relevant link", () => {
    for (const p of ["/", "/pricing", "/frameworks/iso-27001", "/frameworks/iso-42001", "/features/risk-management", "/features/policies", "/resources/blog/x"]) {
      const topic = topicForPath(p);
      expect(topic.questions).toHaveLength(3);
      expect(topic.blurb.length).toBeGreaterThan(20);
      expect(topic.explore.to.startsWith("/")).toBe(true);
    }
    expect(topicForPath("/frameworks/iso-42001").label).toBe("ISO 42001");
  });
});
