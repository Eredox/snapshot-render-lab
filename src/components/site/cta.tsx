import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { site } from "@/config/site";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  ember: "bg-ember text-ember-foreground hover:bg-ember/90",
  outline: "border border-border-strong bg-background text-foreground hover:bg-surface",
  ghost: "text-primary hover:bg-primary-soft",
  inverted: "bg-ink-foreground text-ink hover:bg-ink-foreground/90",
} as const;

export type CtaVariant = keyof typeof variants;
type RouteTo = NonNullable<ComponentProps<typeof Link>["to"]>;

const routeTo = (path: string): RouteTo => path as RouteTo;

export function CtaLink({
  to,
  children,
  variant = "primary",
  className,
  external = false,
}: {
  to: string;
  children: ReactNode;
  variant?: CtaVariant;
  className?: string;
  external?: boolean;
}) {
  const classes = cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition-colors",
    variants[variant],
    className,
  );

  if (external) {
    return (
      <a href={to} className={classes} target="_blank" rel="noreferrer noopener">
        {children}
        <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
        <span className="sr-only">(opens the NOVA application in a new tab)</span>
      </a>
    );
  }

  return (
    <Link to={routeTo(to)} className={classes}>
      {children}
    </Link>
  );
}

export function ConversionCta({
  title = "See NOVA against your own compliance obligations",
  description = "Start free to explore the workflow, or walk through your framework, evidence and reporting requirements with us.",
  primary = { label: "Start free", to: "/start" },
  secondary = { label: "Book a demo", to: "/book-demo" },
  tertiary,
}: {
  title?: string;
  description?: string;
  primary?: { label: string; to: string };
  secondary?: { label: string; to: string };
  tertiary?: { label: string; to: string };
}) {
  return (
    <section className="bg-ink py-16 text-ink-foreground md:py-20">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
            <p className="mt-4 max-w-2xl text-lg text-ink-foreground/75">{description}</p>
            <p className="mt-6 text-sm text-ink-foreground/60">{site.humanStatement}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <CtaLink to={primary.to} variant="primary">
              {primary.label}
            </CtaLink>
            <CtaLink to={secondary.to} variant="inverted">
              {secondary.label}
            </CtaLink>
            {tertiary ? (
              <CtaLink
                to={tertiary.to}
                variant="ghost"
                className="text-ink-foreground hover:bg-ink-foreground/10 hover:text-ink-foreground"
              >
                {tertiary.label}
              </CtaLink>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
