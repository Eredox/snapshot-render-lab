import { useLocation } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import { CtaLink } from "@/components/site/cta";
import { Section } from "@/components/site/primitives";
import {
  ASSISTANT_MAX_QUESTION_CHARS,
  ASSISTANT_NUDGE_AFTER,
  ASSISTANT_QUESTION_LIMIT,
  normalisePath,
  topicForPath,
} from "@/lib/assistant-topics";

type Item = { id: string; q: string; a: string; page: string; topic: string };
type Stored = { sid: string; used: number; items: Item[] };
type Speech = "idle" | "playing" | "paused";

const STORE_KEY = "nova.assistant.v1";
const MAX_FREE_COPY = "Answers come from NOVA's public information. Please do not enter personal or confidential details; questions are sent to our AI provider to produce the answer.";

const newSid = () =>
  (typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}-0000000000`).slice(0, 64);

function load(): Stored {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    if (raw) {
      const s = JSON.parse(raw) as Stored;
      if (typeof s.sid === "string" && Array.isArray(s.items) && typeof s.used === "number") return s;
    }
  } catch {
    /* storage unavailable: fall through to a fresh in-memory session */
  }
  return { sid: newSid(), used: 0, items: [] };
}

function save(s: Stored) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

const FEMALE = /(zira|jenny|aria|samantha|susan|hazel|karen|victoria|allison|ava|joanna|kendra|kimberly|salli|female|siri)/i;
const MALE = /(guy|david|mark|aaron|tom|alex|fred|evan|reed|eddy|matthew|joey|justin|ryan|male|davis|andrew|brian|christopher|roger|steffan)/i;

/** Best available American male English voice, with graceful fallbacks. */
function pickVoice(voices: SpeechSynthesisVoice[]): { voice: SpeechSynthesisVoice | null; male: boolean } {
  const us = voices.filter((v) => /^en[-_]US$/i.test(v.lang));
  const rank = (v: SpeechSynthesisVoice) => (/natural|online/i.test(v.name) ? 2 : 0) + (v.localService ? 0 : 1);
  const male = us.filter((v) => MALE.test(v.name) && !FEMALE.test(v.name)).sort((a, b) => rank(b) - rank(a))[0];
  if (male) return { voice: male, male: true };
  const neutral = us.filter((v) => !FEMALE.test(v.name))[0] ?? us[0] ?? voices.find((v) => /^en/i.test(v.lang)) ?? null;
  return { voice: neutral ?? null, male: false };
}

function sentences(text: string): string[] {
  return (text.match(/[^.!?\n]+[.!?]*\s*/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}

export function NovaAssistant() {
  const pathname = normalisePath(useLocation().pathname);
  const topic = topicForPath(pathname);
  const [state, setState] = useState<Stored>({ sid: "", used: 0, items: [] });
  const [ready, setReady] = useState(false);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [speech, setSpeech] = useState<Speech>("idle");
  const [voiceNote, setVoiceNote] = useState("");
  const [canSpeak, setCanSpeak] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const maleRef = useRef(false);

  useEffect(() => {
    const stored = load();
    setState(stored);
    save(stored);
    setActiveId(stored.items[0]?.id ?? null);
    setReady(true);
    fetch("/api/assistant", { headers: { accept: "application/json" } })
      .then((r) => r.json() as Promise<{ available?: boolean }>)
      .then((d) => setAvailable(d.available === true))
      .catch(() => setAvailable(false));
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setCanSpeak(true);
      const refresh = () => {
        const { voice, male } = pickVoice(window.speechSynthesis.getVoices());
        voiceRef.current = voice;
        maleRef.current = male;
        setVoiceNote(voice ? (male ? `Voice: ${voice.name}` : `An American male voice is not available on this device; using ${voice.name}.`) : "Using your device's default voice.");
      };
      refresh();
      window.speechSynthesis.addEventListener("voiceschanged", refresh);
      const stop = () => window.speechSynthesis.cancel();
      window.addEventListener("pagehide", stop);
      return () => {
        window.speechSynthesis.removeEventListener("voiceschanged", refresh);
        window.removeEventListener("pagehide", stop);
        window.speechSynthesis.cancel();
      };
    }
    return undefined;
  }, []);

  const stopSpeech = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeech("idle");
  }, []);

  // Audio never survives navigation or a change of the displayed answer.
  useEffect(() => {
    stopSpeech();
  }, [pathname, activeId, stopSpeech]);

  const active = state.items.find((i) => i.id === activeId) ?? null;
  const exhausted = state.used >= ASSISTANT_QUESTION_LIMIT;
  const unavailable = available === false;

  const ask = async (raw: string) => {
    const question = raw.replace(/\s+/g, " ").trim();
    if (!question || busy || exhausted || !ready || unavailable) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sid: state.sid, question, path: pathname }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; answer?: string; used?: number; code?: string; message?: string };
      if (res.ok && data.ok && data.answer) {
        const item: Item = { id: `${Date.now()}`, q: question, a: data.answer, page: pathname, topic: topic.label };
        const next = { ...state, used: data.used ?? state.used + 1, items: [item, ...state.items] };
        setState(next);
        save(next);
        setActiveId(item.id);
        setInput("");
      } else if (data.code === "limit") {
        const next = { ...state, used: ASSISTANT_QUESTION_LIMIT };
        setState(next);
        save(next);
      } else {
        setError(data.message ?? "The NOVA assistant could not answer just now. This did not use one of your questions.");
      }
    } catch {
      setError("The NOVA assistant could not be reached. This did not use one of your questions.");
    } finally {
      setBusy(false);
    }
  };

  const speak = () => {
    if (!active || !canSpeak) return;
    const synth = window.speechSynthesis;
    if (speech === "paused") {
      synth.resume();
      setSpeech("playing");
      return;
    }
    synth.cancel();
    const parts = sentences(active.a);
    parts.forEach((part, index) => {
      const u = new SpeechSynthesisUtterance(part);
      u.lang = "en-US";
      if (voiceRef.current) u.voice = voiceRef.current;
      if (!maleRef.current) u.pitch = 0.8; // lower pitch when no male voice exists on the device
      u.rate = 1;
      if (index === parts.length - 1) {
        u.onend = () => setSpeech("idle");
        u.onerror = () => setSpeech("idle");
      }
      synth.speak(u);
    });
    setSpeech("playing");
  };
  const pause = () => {
    if (speech !== "playing") return;
    window.speechSynthesis.pause();
    setSpeech("paused");
  };
  const replay = () => {
    stopSpeech();
    window.setTimeout(speak, 50);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  const btn = "inline-flex min-h-11 items-center justify-center rounded-lg border border-border-strong bg-background px-4 text-sm font-medium hover:bg-surface disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <Section tone="surface" id="nova-assistant">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow">NOVA AI Information Assistant</p>
        <h2 id="nova-assistant-title" className="mt-2 text-2xl font-semibold md:text-3xl">
          Need more information? Just ask NOVA.
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Ask about {topic.label}. You can ask up to {ASSISTANT_QUESTION_LIMIT} questions across this website visit.{" "}
          <span data-testid="assistant-count">{state.used} of {ASSISTANT_QUESTION_LIMIT} used.</span>
        </p>

        <div className="mt-5" role="group" aria-label="Suggested questions">
          <p className="text-sm font-medium">Suggested questions</p>
          <div className="mt-2 flex flex-col gap-2 md:flex-row md:flex-wrap">
            {topic.questions.map((q) => (
              <button key={q} type="button" className={btn} disabled={busy || exhausted || unavailable || !ready} onClick={() => void ask(q)}>
                {q}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
          <label htmlFor="nova-assistant-input" className="sr-only">
            Ask your own question about NOVA
          </label>
          <input
            id="nova-assistant-input"
            type="text"
            value={input}
            maxLength={ASSISTANT_MAX_QUESTION_CHARS}
            onChange={(e) => setInput(e.target.value)}
            disabled={busy || exhausted || unavailable || !ready}
            placeholder={exhausted ? "Question allowance used" : "Or type your own question"}
            autoComplete="off"
            className="min-h-11 flex-1 rounded-lg border border-border-strong bg-background px-3 text-sm disabled:opacity-50"
          />
          <button type="submit" className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50" disabled={busy || exhausted || unavailable || !ready || !input.trim()}>
            {busy ? "Asking…" : "Ask NOVA"}
          </button>
        </form>
        <p className="mt-2 text-xs text-muted-foreground">{MAX_FREE_COPY}</p>

        <div aria-live="polite" className="mt-4">
          {unavailable ? <p className="rounded-lg border border-border bg-card p-4 text-sm">The NOVA assistant is not available right now. Our Sales team can answer your questions.</p> : null}
          {error ? <p role="alert" className="rounded-lg border border-border bg-card p-4 text-sm">{error}</p> : null}
          {active ? (
            <article className="rounded-lg border border-border bg-card p-4 md:p-5" data-testid="assistant-answer">
              <p className="text-sm font-medium">{active.q}</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{active.a}</p>
              {canSpeak ? (
                <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Listen to this answer">
                  <button type="button" className={btn} onClick={speak} disabled={speech === "playing"}>{speech === "paused" ? "Resume" : "Listen"}</button>
                  <button type="button" className={btn} onClick={pause} disabled={speech !== "playing"}>Pause</button>
                  <button type="button" className={btn} onClick={stopSpeech} disabled={speech === "idle"}>Stop</button>
                  <button type="button" className={btn} onClick={replay}>Replay</button>
                  <span className="text-xs text-muted-foreground">{voiceNote}</span>
                </div>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">Audio playback is not supported in this browser. The written answer stays available.</p>
              )}
            </article>
          ) : null}
        </div>

        {state.items.length > 1 || (state.items.length === 1 && state.items[0]?.id !== activeId) ? (
          <div className="mt-5">
            <p className="text-sm font-medium">Your earlier answers (reopening does not use a question)</p>
            <ul className="mt-2 flex flex-col gap-2">
              {state.items.map((item) => (
                <li key={item.id}>
                  <button type="button" className={`${btn} w-full justify-start text-left ${item.id === activeId ? "bg-surface" : ""}`} aria-pressed={item.id === activeId} onClick={() => setActiveId(item.id)}>
                    <span className="mr-2 text-xs text-muted-foreground">{item.topic}</span>
                    {item.q}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-border bg-card p-5" id="nova-assistant-next-step">
          <h3 className="text-lg font-semibold">Suggested next step</h3>
          {exhausted ? (
            <p className="mt-2 text-sm">You have used all {ASSISTANT_QUESTION_LIMIT} questions for this visit. Our Sales team can answer anything else and show you NOVA in action.</p>
          ) : state.used >= ASSISTANT_NUDGE_AFTER ? (
            <p className="mt-2 text-sm">You have asked {state.used} of {ASSISTANT_QUESTION_LIMIT} questions. For tailored answers, contact our Sales team.</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">See NOVA working on your own obligations, or speak with the team.</p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <CtaLink to="/book-demo">See NOVA in Action</CtaLink>
            <CtaLink to="/contact" variant="outline">Talk to Sales</CtaLink>
          </div>
        </div>
      </div>
    </Section>
  );
}
