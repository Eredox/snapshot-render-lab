import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

/**
 * Self-hosted neural text-to-speech for the public assistant: Piper (MIT) with the en_US "john" male voice (public-domain LibriVox
 * training data). It only ever speaks answers this server itself produced for the same visit, never arbitrary text, runs one
 * synthesis at a time at the lowest CPU priority, and has hard time and size limits so it cannot starve the NOVA application.
 */

const piperBin = () => process.env["NOVA_PIPER_BIN"] || "/opt/piper/piper";
const piperModel = () => process.env["NOVA_PIPER_MODEL"] || "/opt/piper/voices/en_US-john-medium.onnx";
const SYNTH_TIMEOUT_MS = 40_000;
const MAX_PCM_BYTES = 12_000_000;
const MAX_QUEUE = 3;
const CHUNK_CHARS = 180;

export function speechConfigured(): boolean {
  return existsSync(piperBin()) && existsSync(piperModel());
}

function sampleRate(): number {
  try {
    const cfg = JSON.parse(readFileSync(`${piperModel()}.json`, "utf8")) as { audio?: { sample_rate?: number } };
    return cfg.audio?.sample_rate ?? 22_050;
  } catch {
    return 22_050;
  }
}

/** Deterministic plain-text chunks (about two sentences) so playback can start after the first one is ready. */
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
    if (current && current.length + sentence.length + 1 > CHUNK_CHARS) {
      parts.push(current);
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current) parts.push(current);
  return parts.slice(0, 12);
}

function wav(pcm: Buffer, rate: number): Buffer {
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVEfmt ", 8);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(1, 22); // mono
  header.writeUInt32LE(rate, 24);
  header.writeUInt32LE(rate * 2, 28);
  header.writeUInt16LE(2, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);
  return Buffer.concat([header, pcm]);
}

function runPiper(text: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const child = spawn("nice", ["-n", "15", piperBin(), "--model", piperModel(), "--output_raw", "--quiet"], {
      cwd: path.dirname(piperBin()),
      env: { ...process.env, LD_LIBRARY_PATH: path.dirname(piperBin()) },
      stdio: ["pipe", "pipe", "ignore"],
    });
    const chunks: Buffer[] = [];
    let size = 0;
    const timer = setTimeout(() => child.kill("SIGKILL"), SYNTH_TIMEOUT_MS);
    child.stdout.on("data", (c: Buffer) => {
      size += c.length;
      if (size > MAX_PCM_BYTES) child.kill("SIGKILL");
      else chunks.push(c);
    });
    child.on("error", (e) => {
      clearTimeout(timer);
      reject(e);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && size > 0 && size <= MAX_PCM_BYTES) resolve(wav(Buffer.concat(chunks), sampleRate()));
      else reject(new Error(`piper-exit-${code}`));
    });
    child.stdin.on("error", () => undefined);
    child.stdin.end(text.replace(/\s+/g, " ").trim());
  });
}

let synthesizer: (text: string) => Promise<Buffer> = runPiper;
export function setSynthesizerForTests(fn: ((text: string) => Promise<Buffer>) | null) {
  synthesizer = fn ?? runPiper;
}

let running = false;
const waiting: (() => void)[] = [];

/** One synthesis at a time; at most MAX_QUEUE waiting. Returns null when the queue is full. */
export async function synthesize(text: string): Promise<Buffer | null> {
  if (running) {
    if (waiting.length >= MAX_QUEUE) return null;
    await new Promise<void>((resolve) => waiting.push(resolve)); // the slot is handed over, `running` stays true
  } else {
    running = true;
  }
  try {
    return await synthesizer(text);
  } finally {
    const next = waiting.shift();
    if (next) next();
    else running = false;
  }
}
