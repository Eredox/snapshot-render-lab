import { FileText, ShieldCheck, Database, Lock, BadgeCheck, Fingerprint } from "lucide-react";
import type { CSSProperties } from "react";
import { CtaLink } from "@/components/site/cta";
import { PulsingBorderBackground } from "@/components/site/PulsingBorderBackground";
import { site } from "@/config/site";

/**
 * Eredox suite hero. Content is presentational only; the readiness values are
 * explicitly labelled as illustrative demo data and must never be presented as
 * customer results.
 */

const inbound = [
  { icon: FileText, label: "Policies", y: -70, delay: 0 },
  { icon: Database, label: "System data", y: -20, delay: 1.6 },
  { icon: Lock, label: "Access logs", y: 30, delay: 3.2 },
  { icon: Fingerprint, label: "Identity signals", y: 78, delay: 4.8 },
];

const outbound = [
  { label: "SOC 2", value: 95, y: -72, delay: 0.8 },
  { label: "ISO 27001", value: 85, y: -18, delay: 2.4 },
  { label: "ISO/IEC 42001", value: 78, y: 34, delay: 4.0 },
  { label: "Essential Eight", value: 90, y: 84, delay: 5.6 },
];

function Scene() {
  return (
    <div className="relative h-full w-full">
      {/* incoming stream */}
      <div className="absolute inset-y-0 left-0 hidden w-1/2 motion-safe:block">
        {inbound.map(({ icon: Icon, label, y, delay }) => (
          <div
            key={label}
            className="absolute left-[6%] top-1/2 flex items-center gap-2 rounded-lg border border-ink-foreground/15 bg-ink-foreground/5 px-2.5 py-1.5 text-[0.7rem] text-ink-foreground/80 backdrop-blur-sm"
            style={
              {
                "--feed-y": `${y}px`,
                animation: `eredox-feed 6.4s ${delay}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                marginTop: `${y}px`,
              } as CSSProperties
            }
          >
            <Icon aria-hidden="true" className="h-3.5 w-3.5 text-ember" />
            {label}
          </div>
        ))}
      </div>

      {/* monitor */}
      <div className="absolute left-1/2 top-1/2 w-[46%] min-w-[190px] -translate-x-1/2 -translate-y-1/2">
        <div className="relative overflow-hidden rounded-xl border border-ink-foreground/25 bg-ink/80 p-3 shadow-screen">
          <div
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-b from-transparent via-primary/25 to-transparent motion-safe:block"
            style={{ animation: "eredox-sweep 5s linear infinite" }}
          />
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-ember" />
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[0.6rem] uppercase tracking-[0.16em] text-ink-foreground/50">Eredox suite</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-1.5 w-3/4 rounded-full bg-ink-foreground/25" />
            <div className="h-1.5 w-1/2 rounded-full bg-primary/70" />
            <div className="h-1.5 w-2/3 rounded-full bg-ink-foreground/15" />
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-md border border-ink-foreground/15 bg-ink-foreground/5 p-1.5">
                  <ShieldCheck aria-hidden="true" className="h-3 w-3 text-ember" />
                  <div className="mt-1 h-1 w-full rounded-full bg-ink-foreground/20" />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mx-auto h-4 w-10 bg-ink-foreground/20" />
        <div className="mx-auto h-1.5 w-2/3 rounded-full bg-ink-foreground/25" />
        <div className="mx-auto mt-2 grid w-5/6 grid-cols-10 gap-[3px] rounded-md border border-ink-foreground/15 bg-ink-foreground/5 p-1.5">
          {Array.from({ length: 30 }).map((_, i) => (
            <span key={i} className="h-1 rounded-[2px] bg-ink-foreground/20" />
          ))}
        </div>
      </div>

      {/* emerging readiness */}
      <div className="absolute inset-y-0 right-0 w-1/2">
        {outbound.map(({ label, value, y, delay }, index) => (
          <div
            key={label}
            className="absolute left-[8%] top-1/2 hidden w-[8.5rem] rounded-lg border border-ink-foreground/15 bg-ink-foreground/8 px-2.5 py-2 backdrop-blur-sm motion-safe:block"
            style={
              {
                "--emerge-x": "150%",
                "--emerge-y": `${y}px`,
                animation: `eredox-emerge 7s ${delay}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
                marginTop: `${y / 3}px`,
              } as CSSProperties
            }
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-ink-foreground">
                <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 text-ember" />
                {label}
              </span>
              <span className="text-[0.7rem] font-semibold text-ember">{value}%</span>
            </div>
            <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-ink-foreground/15">
              <span className="block h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
            </div>
            <span className="sr-only">Illustrative demo data, position {index + 1}</span>
          </div>
        ))}

        {/* static, reduced-motion fallback */}
        <div className="absolute inset-0 flex flex-col justify-center gap-2 pl-[8%] pr-4 motion-safe:hidden">
          {outbound.map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-ink-foreground/15 bg-ink-foreground/8 px-2.5 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-1.5 text-[0.7rem] font-medium text-ink-foreground">
                  <BadgeCheck aria-hidden="true" className="h-3.5 w-3.5 text-ember" />
                  {label}
                </span>
                <span className="text-[0.7rem] font-semibold text-ember">{value}%</span>
              </div>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-ink-foreground/15">
                <span className="block h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EredoxHero() {
  return (
    <section className="relative overflow-hidden bg-ink text-ink-foreground">
      <div className="grid-mesh pointer-events-none absolute inset-0 opacity-[0.07]" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-primary/30 blur-3xl motion-safe:[animation:eredox-glow_9s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-ember/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative z-10 grid gap-12 py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center">
        <div>
          <p className="eyebrow text-ember">The Eredox suite</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
            Build Trust. Prove Compliance. Move Forward.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-ink-foreground/75">
            Eredox brings compliance, customer relationships, and business operations together in one connected suite of
            intelligent applications.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to="/platform">Explore the Eredox Suite</CtaLink>
            <CtaLink to="/book-demo" variant="inverted">
              Book a Demo
            </CtaLink>
          </div>
          <p className="mt-6 max-w-xl text-sm text-ink-foreground/60">{site.humanStatement}</p>
        </div>

        <div className="relative">
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-ink-foreground/15 bg-ink/60 sm:aspect-[16/10]"
            role="img"
            aria-label="Illustrative animation: business documents, system data and security signals flow into a workstation, which produces compliance readiness scores for SOC 2, ISO 27001, ISO/IEC 42001 and Essential Eight."
          >
            <Scene />
          </div>
          <p className="mt-3 text-center text-xs text-ink-foreground/55">
            Illustrative demo data. Readiness percentages are examples, not customer results.
          </p>
        </div>
      </div>
    </section>
  );
}
