/**
 * Server-side text-to-speech for the public assistant using Google Gemini TTS (Interactions API, prebuilt voice "Puck").
 * It only ever speaks answers this server itself produced for the same visit, never arbitrary text. The API key
 * (GEMINI_API_KEY) lives only in the server environment: it is sent as a request header to Google, never to the browser,
 * never logged. Cost controls: short chunks, per-client and global ceilings (see assistant-server.ts), a small in-memory cache so a
 * replay or reload does not pay twice, bounded concurrency and a hard timeout.
 */

const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const SYNTH_TIMEOUT_MS = 30_000;
const MAX_AUDIO_BYTES = 6_000_000;
const MAX_CONCURRENT = 2;
const MAX_QUEUE = 6;
const FIRST_CHUNK_CHARS = 200; // small first chunk so playback starts quickly
const CHUNK_CHARS = 450;
const CACHE_ENTRIES = 40;
const STYLE = "Speak in natural, warm, conversational American English, like a friendly and knowledgeable product specialist. Steady, unhurried pace.";

const geminiKey = () => process.env["GEMINI_API_KEY"]?.trim() || "";
const geminiModel = () => process.env["GEMINI_TTS_MODEL"]?.trim() || "gemini-3.8-flash-lite-tts";
const geminiVoice = () => process.env["GEMINI_TTS_VOICE"]?.trim() || "Puck";

export function speechConfigured(): boolean {
  return geminiKey() !== "";
}

/** Deterministic plain-text chunks (a few sentences) so playback can start after the first one is ready. */
export function speechParts(answer: string): string[] {
  const text = answer
    .replace(/\*\*|__|`/g, "")
    .replace(/^\s*[-*•]\s+/gm, "")
    .replace(/\s*\n+\s*/g, ". ")
    .replace(/\.\s*\./g, ".")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = text.match(/[^.!?]+[.!?]*\s*/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
  const parts: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const limit = parts.length === 0 ? FIRST_CHUNK_CHARS : CHUNK_CHARS;
    if (current && current.length + sentence.length + 1 > limit) {
      parts.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) parts.push(current);
  return parts.slice(0, 8);
}

/** Wraps headerless 24 kHz mono 16-bit PCM in a WAV header (only used if Google returns raw PCM). */
function wavFromPcm(pcm: Buffer): Buffer {
  const rate = 24_000;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(1, 22);
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

type GeminiResponse = { steps?: { type?: string; content?: { type?: string; data?: string }[] }[] };

async function callGemini(text: string): Promise<Buffer> {
  const res = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": geminiKey() },
    body: JSON.stringify({
      model: geminiModel(),
      input: [{ type: "user_input", content: [{ type: "text", text, annotations: [{ type: "speech_metadata", style: STYLE }] }] }],
      response_format: { type: "audio" },
      generation_config: { speech_config: [{ voice: geminiVoice() }] },
    }),
    signal: AbortSignal.timeout(SYNTH_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`gemini-${res.status}`); // status only: the response body is never logged
  const data = (await res.json()) as GeminiResponse;
  const audio = (data.steps ?? [])
    .filter((s) => s.type === "model_output")
    .flatMap((s) => s.content ?? [])
    .filter((c) => c.type === "audio" && typeof c.data === "string")
    .pop();
  if (!audio?.data) throw new Error("gemini-no-audio");
  const bytes = Buffer.from(audio.data, "base64");
  if (bytes.length === 0 || bytes.length > MAX_AUDIO_BYTES) throw new Error("gemini-bad-size");
  return bytes.subarray(0, 4).toString("ascii") === "RIFF" ? bytes : wavFromPcm(bytes);
}

let synthesizer: (text: string) => Promise<Buffer> = callGemini;
export function setSynthesizerForTests(fn: ((text: string) => Promise<Buffer>) | null) {
  synthesizer = fn ?? callGemini;
  cache.clear();
}

const cache = new Map<string, Buffer>();
let running = 0;
const waiting: (() => void)[] = [];

/** Bounded concurrency with a short queue (null = queue full) and a small cache keyed by the exact chunk text. */
export async function synthesize(text: string): Promise<Buffer | null> {
  const hit = cache.get(text);
  if (hit) return hit;
  if (running >= MAX_CONCURRENT) {
    if (waiting.length >= MAX_QUEUE) return null;
    await new Promise<void>((resolve) => waiting.push(resolve)); // a finishing synthesis hands its slot over
  } else {
    running += 1;
  }
  try {
    const audio = await synthesizer(text);
    cache.set(text, audio);
    if (cache.size > CACHE_ENTRIES) {
      const oldest = cache.keys().next().value;
      if (oldest !== undefined) cache.delete(oldest);
    }
    return audio;
  } finally {
    const next = waiting.shift();
    if (next) next();
    else running -= 1;
  }
}
