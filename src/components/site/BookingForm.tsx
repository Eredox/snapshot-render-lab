import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { formsConfig } from "@/config/site";
import { frameworks } from "@/data/frameworks";

const timeSlots = ["09:00", "10:30", "13:00", "15:30"] as const;
const teamSizes = ["1–10", "11–50", "51–200", "201–1000", "1000+"] as const;

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary";

export function BookingForm({ className, defaultFramework = "" }: { className?: string; defaultFramework?: string }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    framework: defaultFramework,
    teamSize: "",
    date: "",
    timeSlot: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    if (formsConfig.endpoint) {
      try {
        await fetch(formsConfig.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "demo-booking", ...form }),
        });
      } catch {
        // Delivery is best-effort; the confirmation page still shows the slot.
      }
    }
    navigate({
      to: "/book-demo/confirmed",
      search: {
        name: form.name,
        email: form.email,
        company: form.company,
        framework: form.framework,
        teamSize: form.teamSize,
        date: form.date,
        timeSlot: form.timeSlot,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className ?? ""}`}>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-name" className="mb-1 block text-sm font-medium">
            Name
          </label>
          <input id="booking-name" type="text" required value={form.name} onChange={set("name")} className={inputClass} />
        </div>
        <div>
          <label htmlFor="booking-email" className="mb-1 block text-sm font-medium">
            Work email
          </label>
          <input id="booking-email" type="email" required value={form.email} onChange={set("email")} className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="booking-company" className="mb-1 block text-sm font-medium">
          Company
        </label>
        <input id="booking-company" type="text" required value={form.company} onChange={set("company")} className={inputClass} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-framework" className="mb-1 block text-sm font-medium">
            Framework of interest
          </label>
          <select id="booking-framework" required value={form.framework} onChange={set("framework")} className={inputClass}>
            <option value="" disabled>
              Select a framework
            </option>
            {frameworks.map((f) => (
              <option key={f.slug} value={f.name}>
                {f.name}
              </option>
            ))}
            <option value="Multiple or not sure">Multiple / not sure yet</option>
          </select>
        </div>
        <div>
          <label htmlFor="booking-team" className="mb-1 block text-sm font-medium">
            Team size
          </label>
          <select id="booking-team" required value={form.teamSize} onChange={set("teamSize")} className={inputClass}>
            <option value="" disabled>
              Select team size
            </option>
            {teamSizes.map((s) => (
              <option key={s} value={s}>
                {s} people
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="booking-date" className="mb-1 block text-sm font-medium">
            Preferred date
          </label>
          <input
            id="booking-date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            value={form.date}
            onChange={set("date")}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="booking-time" className="mb-1 block text-sm font-medium">
            Preferred time (AEST)
          </label>
          <select id="booking-time" required value={form.timeSlot} onChange={set("timeSlot")} className={inputClass}>
            <option value="" disabled>
              Select a time
            </option>
            {timeSlots.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="booking-message" className="mb-1 block text-sm font-medium">
          Anything we should prepare? <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea id="booking-message" rows={3} value={form.message} onChange={set("message")} className={inputClass} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
      >
        {submitting ? "Booking…" : "Request demo booking"}
      </button>
      <p className="text-xs text-muted-foreground">
        {formsConfig.endpoint
          ? "We will confirm the time by email. Demos are run by the Eredox team."
          : `Booking delivery is not connected yet. Please email ${formsConfig.fallbackEmail} directly.`}
      </p>
    </form>
  );
}
