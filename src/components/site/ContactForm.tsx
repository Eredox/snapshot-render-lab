import { useState } from "react";
import { formsConfig } from "@/config/site";

export function ContactForm({ className, defaultMessage = "" }: { className?: string; defaultMessage?: string }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: defaultMessage });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formsConfig.endpoint) {
      fetch(formsConfig.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }).catch(() => undefined);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className={`rounded-xl border border-border bg-card p-6 ${className ?? ""}`}>
        <p className="font-medium">Thanks for your message</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {formsConfig.endpoint
            ? "We will be in touch soon."
            : `Form submissions are not yet configured. Please email ${formsConfig.fallbackEmail} directly.`}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className ?? ""}`}>
      <div>
        <label htmlFor="contact-name" className="mb-1 block text-sm font-medium">
          Name
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="contact-email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="contact-company" className="mb-1 block text-sm font-medium">
          Company
        </label>
        <input
          id="contact-company"
          type="text"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium">
          Message
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Send message
      </button>
      {!formsConfig.endpoint ? (
        <p className="text-xs text-muted-foreground">Forms are not connected yet. Please email {formsConfig.fallbackEmail}.</p>
      ) : null}
    </form>
  );
}
