/**
 * Booking confirmation hand-off.
 *
 * The confirmation page used to receive the visitor's name, e-mail address and company as URL query
 * parameters, which leaks them into browser history, nginx access logs, shareable links and any
 * same-origin Referer. The details now travel only in the in-memory/session history entry
 * (`history.state`) of the visitor's own tab: never in the URL, never sent to the server, never
 * included in Referer, and absent on a shared or reloaded-in-new-tab link (the page then shows a
 * generic confirmation).
 */
export type BookingConfirmation = {
  name: string;
  email: string;
  company: string;
  framework: string;
  teamSize: string;
  date: string;
  timeSlot: string;
};

const KEYS = ["name", "email", "company", "framework", "teamSize", "date", "timeSlot"] as const;

export function bookingConfirmationState(form: BookingConfirmation): { bookingConfirmation: BookingConfirmation } {
  const bookingConfirmation = Object.fromEntries(KEYS.map((key) => [key, String(form[key] ?? "")])) as BookingConfirmation;
  return { bookingConfirmation };
}

/** Defensive read: history state is untrusted input (any page may call history.pushState on its own origin only, but keep shapes bounded). */
export function readBookingConfirmation(state: unknown): BookingConfirmation | null {
  if (!state || typeof state !== "object") return null;
  const raw = (state as Record<string, unknown>)["bookingConfirmation"];
  if (!raw || typeof raw !== "object") return null;
  const out = {} as Record<string, string>;
  for (const key of KEYS) {
    const value = (raw as Record<string, unknown>)[key];
    out[key] = typeof value === "string" ? value.trim().slice(0, 254) : "";
  }
  if (out["date"] && !/^\d{4}-\d{2}-\d{2}$/.test(out["date"])) out["date"] = "";
  if (out["timeSlot"] && !/^\d{2}:\d{2}$/.test(out["timeSlot"])) out["timeSlot"] = "";
  return out as BookingConfirmation;
}
