import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { CalendarCheck, Mail, Clock, Users, Layers, Building2 } from "lucide-react";
import { Section, PageHero, Card } from "@/components/site/primitives";
import { CtaLink } from "@/components/site/cta";
import { formsConfig, site } from "@/config/site";
import { pageMeta, ldScript, breadcrumbSchema } from "@/lib/seo";

const confirmationSearchSchema = z.object({
  name: z.string().trim().max(100).optional().default(""),
  email: z.string().trim().email().max(255).optional().or(z.literal("")).default(""),
  company: z.string().trim().max(100).optional().default(""),
  framework: z.string().trim().max(100).optional().default(""),
  teamSize: z.string().trim().max(20).optional().default(""),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal(""))
    .default(""),
  timeSlot: z.string().trim().max(10).optional().default(""),
});

export const Route = createFileRoute("/book-demo/confirmed")({
  validateSearch: (search: Record<string, unknown>) => confirmationSearchSchema.parse(search),
  head: () => {
    const base = pageMeta({
      title: "Demo booking received — NOVA Compliance",
      description: "Your NOVA Compliance demo booking has been received. Review your preferred slot and what happens next.",
      path: "/book-demo/confirmed",
    });
    return {
      ...base,
      meta: [...base.meta, { name: "robots", content: "noindex" }],
      scripts: [ldScript(breadcrumbSchema([{ label: "Book a demo", to: "/book-demo" }]))],
    };
  },
  component: BookingConfirmedPage,
});

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(`${iso}T00:00:00+10:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function googleCalendarUrl(date: string, timeSlot: string, framework: string) {
  if (!date || !timeSlot) return null;
  const start = `${date.replace(/-/g, "")}T${timeSlot.replace(":", "")}00`;
  const [h, m] = timeSlot.split(":").map(Number);
  const endMinutes = h * 60 + m + 30;
  const end = `${date.replace(/-/g, "")}T${String(Math.floor(endMinutes / 60)).padStart(2, "0")}${String(endMinutes % 60).padStart(2, "0")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `NOVA Compliance demo${framework ? ` — ${framework}` : ""}`,
    dates: `${start}/${end}`,
    ctz: "Australia/Brisbane",
    details: "30-minute walkthrough of NOVA Compliance with the Eredox team.",
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function BookingConfirmedPage() {
  const booking = Route.useSearch();
  const calendarUrl = googleCalendarUrl(booking.date, booking.timeSlot, booking.framework);

  const details = [
    booking.date && booking.timeSlot
      ? { icon: Clock, label: "Preferred slot", value: `${formatDate(booking.date)} at ${booking.timeSlot} AEST` }
      : null,
    booking.framework ? { icon: Layers, label: "Framework of interest", value: booking.framework } : null,
    booking.teamSize ? { icon: Users, label: "Team size", value: `${booking.teamSize} people` } : null,
    booking.company ? { icon: Building2, label: "Company", value: booking.company } : null,
    booking.email ? { icon: Mail, label: "Confirmation to", value: booking.email } : null,
  ].filter((d): d is NonNullable<typeof d> => d !== null);

  return (
    <>
      <PageHero
        eyebrow="Booking received"
        title={booking.name ? `Thanks, ${booking.name} — your demo request is in` : "Your demo request is in"}
        description="Review your booking below. The Eredox team will confirm your slot by email."
        breadcrumbs={[
          { label: "Book a demo", to: "/book-demo" },
          { label: "Confirmed", to: "/book-demo/confirmed" },
        ]}
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <Card>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-soft text-primary">
                <CalendarCheck aria-hidden="true" className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold">Your preferred slot</h2>
            </div>
            {details.length > 0 ? (
              <dl className="mt-6 space-y-4">
                {details.map((d) => (
                  <div key={d.label} className="flex items-start gap-3">
                    <d.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{d.label}</dt>
                      <dd className="mt-0.5 text-sm font-medium">{d.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">No booking details were provided.</p>
            )}
            {calendarUrl ? (
              <a
                href={calendarUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border-strong bg-background px-5 text-sm font-medium transition-colors hover:bg-surface"
              >
                Add to Google Calendar
              </a>
            ) : null}
          </Card>

          <div>
            <h2 className="text-lg font-semibold">What happens next</h2>
            <ol className="mt-6 space-y-4">
              {[
                "We check the slot against the team's calendar.",
                `You receive a confirmation email${booking.email ? ` at ${booking.email}` : ""} with a meeting link.`,
                "We tailor the walkthrough to your framework and team before the call.",
              ].map((step, i) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground">{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-muted-foreground">{site.humanStatement}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Need to change something? Email{" "}
              <a href={`mailto:${formsConfig.fallbackEmail}`} className="text-primary underline">
                {formsConfig.fallbackEmail}
              </a>{" "}
              and we will adjust the booking.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CtaLink to={"/platform" as any} variant="primary">
                Explore the platform
              </CtaLink>
              <CtaLink to={"/frameworks" as any} variant="outline">
                Browse frameworks
              </CtaLink>
            </div>
            <p className="mt-6 text-sm">
              <Link to={"/book-demo" as any} className="text-primary underline">
                Book another demo
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
