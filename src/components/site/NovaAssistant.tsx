import { Link, useLocation } from "@tanstack/react-router";
import { ArrowRight, ArrowUp, Pause, RotateCcw, Sparkles, Square, Volume2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";

import {
  ASSISTANT_MAX_QUESTION_CHARS,
  ASSISTANT_NUDGE_AFTER,
  ASSISTANT_QUESTION_LIMIT,
  normalisePath,
  topicForPath,
} from "@/lib/assistant-topics";

type Item = { id: string; q: string; a: string; page: string; topic: string; n?: number; parts?: number };
type Stored = { sid: string; used: number; items: Item[] };
type Speech = "idle" | "loading" | "playing" | "paused";

const STORE_KEY = "nova.assistant.v1";

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

/** Spoken audio is synthesised on our own server (neural American male voice) and played with the Web Audio API; nothing depends on the visitor's device voices. */
const ghost = "inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted-foreground hover:bg-surface hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40";

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
  const [speechOn, setSpeechOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const tokenRef = useRef(0);
  const cacheRef = useRef(new Map<string, ArrayBuffer>());

  useEffect(() => {
    const stored = load();
    setState(stored);
    save(stored);
    setActiveId(stored.items[0]?.id ?? null);
    setReady(true);
    fetch("/api/assistant", { headers: { accept: "application/json" } })
      .then((r) => r.json() as Promise<{ available?: boolean; speech?: boolean }>)
      .then((d) => {
        setAvailable(d.available === true);
        setSpeechOn(d.speech === true && typeof window !== "undefined" && ("AudioContext" in window || "webkitAudioContext" in window));
      })
      .catch(() => setAvailable(false));
    const stop = () => haltAudio();
    window.addEventListener("pagehide", stop);
    return () => {
      window.removeEventListener("pagehide", stop);
      haltAudio();
    };
  }, []);

  const haltAudio = () => {
    tokenRef.current += 1;
    abortRef.current?.abort();
    abortRef.current = null;
    for (const source of sourcesRef.current) {
      try {
        source.onended = null;
        source.stop();
      } catch {
        /* already stopped */
      }
    }
    sourcesRef.current = [];
    void ctxRef.current?.close().catch(() => undefined);
    ctxRef.current = null;
  };
  const stopSpeech = useCallback(() => {
    haltAudio();
    setSpeech("idle");
  }, []);

  // Audio never survives navigation or a change of the displayed answer.
  useEffect(() => {
    stopSpeech();
  }, [pathname, activeId, stopSpeech]);

  const active = state.items.find((i) => i.id === activeId) ?? null;
  const remaining = Math.max(0, ASSISTANT_QUESTION_LIMIT - state.used);
  const exhausted = remaining === 0;
  const unavailable = available === false;
  const locked = busy || exhausted || unavailable || !ready;

  const ask = async (raw: string) => {
    const question = raw.replace(/\s+/g, " ").trim();
    if (!question || locked) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sid: state.sid, question, path: pathname }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; answer?: string; n?: number; parts?: number; used?: number; code?: string; message?: string };
      if (res.ok && data.ok && data.answer) {
        const item: Item = { id: `${Date.now()}`, q: question, a: data.answer, page: pathname, topic: topic.label, ...(data.n ? { n: data.n } : {}), ...(data.parts ? { parts: data.parts } : {}) };
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
        setError(data.message ?? "NOVA could not answer just now. This did not use one of your questions.");
      }
    } catch {
      setError("NOVA could not be reached. This did not use one of your questions.");
    } finally {
      setBusy(false);
    }
  };

  const speak = async () => {
    if (!active?.n || !active.parts) return;
    if (speech === "paused" && ctxRef.current) {
      await ctxRef.current.resume();
      setSpeech("playing");
      return;
    }
    haltAudio();
    const token = tokenRef.current;
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtor(); // created inside the click, so the browser allows playback
    ctxRef.current = ctx;
    const controller = new AbortController();
    abortRef.current = controller;
    setSpeech("loading");
    let startAt = 0;
    try {
      for (let i = 0; i < active.parts; i++) {
        const key = `${state.sid}:${active.n}:${i}`;
        let bytes = cacheRef.current.get(key);
        if (!bytes) {
          const res = await fetch("/api/assistant/speech", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ sid: state.sid, n: active.n, part: i }),
            signal: controller.signal,
          });
          if (!res.ok) throw new Error("speech");
          bytes = await res.arrayBuffer();
          cacheRef.current.set(key, bytes);
        }
        if (token !== tokenRef.current) return;
        const audio = await ctx.decodeAudioData(bytes.slice(0));
        if (token !== tokenRef.current) return;
        const source = ctx.createBufferSource();
        source.buffer = audio;
        source.connect(ctx.destination);
        const when = Math.max(ctx.currentTime + 0.05, startAt);
        source.start(when);
        startAt = when + audio.duration;
        sourcesRef.current.push(source);
        if (i === 0) setSpeech("playing");
        if (i === active.parts - 1) {
          source.onended = () => {
            if (token === tokenRef.current) setSpeech("idle");
          };
        }
      }
    } catch {
      if (token === tokenRef.current) {
        haltAudio();
        setSpeech("idle");
        setError("Audio is not available right now. The written answer is unchanged.");
      }
    }
  };
  const pause = () => {
    if (speech !== "playing" || !ctxRef.current) return;
    void ctxRef.current.suspend();
    setSpeech("paused");
  };
  const replay = () => {
    stopSpeech();
    window.setTimeout(() => void speak(), 50);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void ask(input);
  };

  const earlier = state.items.filter((i) => i.id !== activeId);

  return (
    <section id="nova-assistant" aria-labelledby="nova-assistant-title" className="border-b border-border bg-background py-10 md:py-14">
      <div className="container-page">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
          {/* Upper section */}
          <div className="border-b border-border bg-surface px-6 py-8 md:px-10 md:py-10">
            <div className="flex items-center gap-3">
              <img src="/media/brand/nova-shield.png" alt="NOVA Compliance" width="36" height="36" decoding="async" className="h-9 w-9 shrink-0 object-contain" />
              <p className="text-sm font-semibold text-primary">Hi, I&rsquo;m NOVA &mdash; NOVA Compliance&rsquo;s AI Information Assistant.</p>
            </div>
            <h2 id="nova-assistant-title" className="mt-5 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Need more information? Just ask me below.
            </h2>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">{topic.blurb}</p>
          </div>

          {/* Lower section */}
          <div className="bg-background px-6 py-8 md:px-10">
            <form onSubmit={onSubmit} className="relative">
              <label htmlFor="nova-assistant-input" className="sr-only">
                Ask NOVA a question
              </label>
              <input
                id="nova-assistant-input"
                type="text"
                value={input}
                maxLength={ASSISTANT_MAX_QUESTION_CHARS}
                onChange={(e) => setInput(e.target.value)}
                disabled={locked}
                placeholder={exhausted ? "You have used all your questions" : "Ask your compliance question..."}
                autoComplete="off"
                className="h-14 w-full rounded-full border border-border bg-surface pl-6 pr-16 text-base text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60"
              />
              <button
                type="submit"
                aria-label="Send question"
                disabled={locked || !input.trim()}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:bg-primary/90 disabled:opacity-40"
              >
                <ArrowUp aria-hidden="true" className="h-5 w-5" />
              </button>
            </form>

            <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Suggested questions">
              {topic.questions.map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={locked}
                  onClick={() => void ask(q)}
                  className="rounded-full border border-border bg-background px-4 py-2 text-left text-xs font-medium text-foreground shadow-sm transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <p data-testid="assistant-count" className="shrink-0 whitespace-nowrap">
                {remaining} of {ASSISTANT_QUESTION_LIMIT} questions remaining
              </p>
              <p className="max-w-xl sm:text-right">
                Answers are generated by DeepSeek and may be processed overseas, including in China. Please don&rsquo;t share confidential details.{" "}
                <Link to="/legal/privacy" className="underline hover:text-foreground">
                  Privacy
                </Link>
              </p>
            </div>

            <div aria-live="polite">
              {unavailable ? <p className="mt-5 rounded-2xl border border-border bg-surface p-4 text-sm">NOVA is not available right now. Our Sales team can answer your questions.</p> : null}
              {error ? (
                <p role="alert" className="mt-5 rounded-2xl border border-border bg-surface p-4 text-sm">
                  {error}
                </p>
              ) : null}
              {active ? (
                <article className="mt-6 rounded-2xl border border-border bg-surface/60 p-5 md:p-6" data-testid="assistant-answer">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{active.q}</p>
                  <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground">
                    {active.a.split(/\n{2,}/).map((para, i) => (
                      <p key={i} className="whitespace-pre-line">
                        {para}
                      </p>
                    ))}
                  </div>
                  {speechOn && active.n && active.parts ? (
                    <div className="mt-4 flex flex-wrap items-center gap-1 border-t border-border pt-3" role="group" aria-label="Listen to this answer">
                      <button type="button" className={ghost} onClick={() => void speak()} disabled={speech === "playing" || speech === "loading"}>
                        <Volume2 aria-hidden="true" className="h-4 w-4" />
                        {speech === "loading" ? "Preparing audio…" : speech === "paused" ? "Resume" : "Listen"}
                      </button>
                      <button type="button" className={ghost} onClick={pause} disabled={speech !== "playing"}>
                        <Pause aria-hidden="true" className="h-4 w-4" />
                        Pause
                      </button>
                      <button type="button" className={ghost} onClick={stopSpeech} disabled={speech === "idle"}>
                        <Square aria-hidden="true" className="h-4 w-4" />
                        Stop
                      </button>
                      <button type="button" className={ghost} onClick={replay}>
                        <RotateCcw aria-hidden="true" className="h-4 w-4" />
                        Replay
                      </button>
                    </div>
                  ) : null}
                </article>
              ) : null}
            </div>

            {earlier.length > 0 ? (
              <div className="mt-5">
                <p className="text-xs font-medium text-muted-foreground">Earlier answers &mdash; reopening them does not use a question</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {earlier.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(item.id)}
                        className="rounded-full border border-border bg-background px-3 py-1.5 text-left text-xs text-foreground transition-colors hover:border-primary hover:text-primary"
                      >
                        {item.q}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div id="nova-assistant-next-step" className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <Sparkles aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-foreground">Suggested next step</p>
                  {exhausted ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">You have used all {ASSISTANT_QUESTION_LIMIT} questions. Our Sales team can answer anything else and show you NOVA in action.</p>
                  ) : state.used >= ASSISTANT_NUDGE_AFTER ? (
                    <p className="mt-0.5 text-xs text-muted-foreground">For tailored answers, contact our Sales team.</p>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 sm:justify-end">
                <Link to={topic.explore.to} className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  {topic.explore.label}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
                <Link to="/contact" className="inline-flex min-h-9 items-center gap-1.5 text-sm font-medium text-foreground hover:underline">
                  Talk to Sales
                  <ArrowRight aria-hidden="true" className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
