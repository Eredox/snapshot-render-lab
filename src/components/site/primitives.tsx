import { Link } from "@tanstack/react-router";
import { Check, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  tone = "default",
  className,
  id,
}: {
  children: ReactNode;
  tone?: "default" | "surface" | "soft" | "ink";
  className?: string;
  id?: string;
}) {
  const tones = {
    default: "bg-background",
    surface: "bg-surface",
    soft: "bg-primary-soft/50",
    ink: "bg-ink text-ink-foreground",
  } as const;
  return (
    <section id={id} className={cn("border-b border-border py-14 md:py-20", tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  inverted = false,
  align = "left",
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  inverted?: boolean;
  align?: "left" | "center";
  as?: "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow ? <p className={cn("eyebrow", inverted && "text-ember")}>{eyebrow}</p> : null}
      <Heading
        className={cn(
          "mt-3 text-3xl font-semibold md:text-4xl",
          inverted ? "text-ink-foreground" : "text-foreground",
        )}
      >
        {title}
      </Heading>
      {description ? (
        <p className={cn("mt-4 text-lg", inverted ? "text-ink-foreground/75" : "text-muted-foreground")}>
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function Card({
  children,
  className,
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5 md:p-6",
        interactive && "transition-shadow hover:shadow-lift",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AvailabilityBadge({ value }: { value: string }) {
  const isAvailable = value === "Available now";
  const isPartial = value === "Partly available";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        isAvailable && "bg-primary-soft text-accent-foreground",
        isPartial && "bg-ember-soft text-ember-foreground",
        !isAvailable && !isPartial && "bg-secondary text-secondary-foreground",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isAvailable ? "bg-primary" : isPartial ? "bg-ember" : "bg-muted-foreground",
        )}
      />
      {value}
    </span>
  );
}

export function FeatureList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm">
          <Check aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span className="text-muted-foreground">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Disclaimer({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "rounded-lg border-l-2 border-ember bg-surface px-4 py-3 text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export type Crumb = { label: string; to: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link to="/" className="hover:text-primary hover:underline">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.to} className="flex items-center gap-1.5">
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-foreground">
                {item.label}
              </span>
            ) : (
              <Link to={item.to as any} className="hover:text-primary hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  badge,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumbs: Crumb[];
  badge?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="border-b border-border bg-surface">
      <div className="container-page py-10 md:py-14">
        <Breadcrumbs items={breadcrumbs} />
        <div className="mt-8 max-w-3xl">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">{eyebrow}</p>
            {badge}
          </div>
          <h1 className="mt-3 text-4xl font-semibold leading-tight md:text-5xl">{title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{description}</p>
        </div>
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </section>
  );
}

export function RelatedLinks({
  title = "Related pages",
  items,
  className,
}: {
  title?: string;
  items: { label: string; to: string; description?: string }[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className={className}>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to as any}
            className="group rounded-lg border border-border bg-card p-4 transition-shadow hover:shadow-soft"
          >
            <span className="flex items-center justify-between gap-2 font-medium group-hover:text-primary">
              {item.label}
              <ChevronRight aria-hidden="true" className="h-4 w-4 text-muted-foreground" />
            </span>
            {item.description ? (
              <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}

export function StatGrid({ items }: { items: { label: string; value: string }[] }) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="rounded-xl border border-border bg-card p-5">
          <dt className="text-sm text-muted-foreground">{s.label}</dt>
          <dd className="mt-2 text-2xl font-semibold">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}
