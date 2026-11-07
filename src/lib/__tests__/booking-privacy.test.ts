import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { bookingConfirmationState, readBookingConfirmation } from "@/lib/booking-confirmation";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");
const form = {
  name: "Pat Example",
  email: "pat@example.com",
  company: "Example Pty Ltd",
  framework: "SOC 2",
  teamSize: "11–50",
  date: "2026-12-01",
  timeSlot: "09:00",
};

describe("booking confirmation privacy", () => {
  it("the booking form navigates without any URL search parameters (no PII in the URL)", () => {
    const source = read("src/components/site/BookingForm.tsx");
    const start = source.indexOf("await navigate(");
    const call = source.slice(start, start + 220);
    expect(call).toContain('to: "/book-demo/confirmed"');
    expect(call).toContain("state:");
    expect(call).not.toMatch(/search\s*:/);
    expect(call).not.toMatch(/\bemail\b/);
  });

  it("the confirmation route neither validates nor reads URL search parameters", () => {
    const source = read("src/routes/book-demo.confirmed.tsx");
    expect(source).not.toMatch(/validateSearch\s*:|useSearch|from "zod"/);
    expect(source).toContain("noindex");
  });

  it("round-trips details through history state and validates them defensively", () => {
    const state = bookingConfirmationState(form);
    expect(readBookingConfirmation(state)).toEqual(form);
    expect(readBookingConfirmation({})).toBeNull();
    expect(readBookingConfirmation(null)).toBeNull();
    const hostile = readBookingConfirmation({
      bookingConfirmation: {
        ...form,
        date: "javascript:alert(1)",
        timeSlot: "<b>",
        name: "x".repeat(1000),
        email: 42,
      },
    });
    expect(hostile?.date).toBe("");
    expect(hostile?.timeSlot).toBe("");
    expect(hostile?.name.length).toBe(254);
    expect(hostile?.email).toBe("");
  });

  it("the Google Calendar link is built only from slot and framework (no name or e-mail)", () => {
    const source = read("src/routes/book-demo.confirmed.tsx");
    const start = source.indexOf("function googleCalendarUrl");
    const block = source.slice(start, source.indexOf("const emptyBooking", start));
    expect(block).not.toMatch(/\bname\b|\bemail\b/);
  });
});
