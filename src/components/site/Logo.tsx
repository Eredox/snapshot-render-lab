import { cn } from "@/lib/utils";

/**
 * NOVA wordmark placeholder.
 *
 * When the official NOVA logo files are supplied, replace the SVG mark and the
 * wordmark below with the supplied artwork — do not recreate or distort it.
 * The wordmark uses the `wordmark` utility, which maps to Cirqua (the only
 * place Cirqua is used) with a geometric sans fallback until the licensed
 * `public/fonts/cirqua.woff2` file is present.
 */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 shrink-0">
        <rect width="32" height="32" rx="8" className="fill-primary" />
        <path d="M9 23V9h3.4l7.2 9.1V9H23v14h-3.4L12.4 14v9H9z" className="fill-primary-foreground" />
      </svg>
      <span className="leading-none">
        <span className={cn("wordmark block text-lg font-bold tracking-tight", inverted ? "text-ink-foreground" : "text-foreground")}>
          NOVA
        </span>
        <span className={cn("block text-[0.625rem] font-medium uppercase tracking-[0.18em]", inverted ? "text-ink-foreground/60" : "text-muted-foreground")}>
          Compliance
        </span>
      </span>
    </span>
  );
}
