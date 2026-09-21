import { cn } from "@/lib/utils";

/**
 * Shared NOVA brand lockup using the approved multicolour shield mark.
 *
 * The mark is decorative here because the adjacent text provides the
 * accessible brand name. The wordmark uses the `wordmark` utility, which maps
 * to Cirqua (the only place Cirqua is used) with a geometric sans fallback
 * until the licensed `public/fonts/cirqua.woff2` file is present.
 */
export function Logo({ className, inverted = false }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/media/brand/nova-shield.png"
        alt=""
        aria-hidden="true"
        className="h-12 w-12 shrink-0 object-contain"
      />
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
