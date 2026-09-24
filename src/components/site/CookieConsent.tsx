import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nova-cookie-consent-v1";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}

function writeConsent(state: ConsentState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("nova-consent-change", { detail: state }));
  } catch {
    /* storage unavailable */
  }
}

export function CookieConsent() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const existing = readConsent();
    if (existing) {
      setAnalytics(existing.analytics);
      setMarketing(existing.marketing);
    } else {
      setVisible(true);
    }
    setReady(true);
    const open = () => {
      setShowPrefs(true);
      setVisible(true);
    };
    window.addEventListener("nova-open-cookie-preferences", open);
    return () => window.removeEventListener("nova-open-cookie-preferences", open);
  }, []);

  function save(next: { analytics: boolean; marketing: boolean }) {
    writeConsent({ necessary: true, ...next, decidedAt: new Date().toISOString() });
    setAnalytics(next.analytics);
    setMarketing(next.marketing);
    setVisible(false);
    setShowPrefs(false);
  }

  if (!ready || !visible) return null;

  return (
    <div
      role="region"
      aria-labelledby="cookie-consent-title"
      className="cookie-consent fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background shadow-lift"
    >
      <div className="container-page py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h2 id="cookie-consent-title" className="text-base font-semibold">
              Cookies and your choices
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Necessary cookies keep this site working. Analytics and marketing cookies stay
              switched off until you choose to enable them, and no non-essential provider is loaded
              before consent. See the{" "}
              <Link to={"/legal/cookies" as any} className="text-primary underline">
                Cookie Policy
              </Link>
              .
            </p>

            {showPrefs ? (
              <fieldset className="mt-4 space-y-3">
                <legend className="sr-only">Cookie categories</legend>
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" checked readOnly disabled className="mt-1 h-4 w-4" />
                  <span>
                    <span className="font-medium text-foreground">Necessary</span>
                    <span className="block text-muted-foreground">
                      Always active. Required for the site to work.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={analytics}
                    onChange={(e) => setAnalytics(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span>
                    <span className="font-medium text-foreground">Analytics</span>
                    <span className="block text-muted-foreground">
                      Helps us understand site usage. No analytics provider is configured yet.
                    </span>
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={marketing}
                    onChange={(e) => setMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4"
                  />
                  <span>
                    <span className="font-medium text-foreground">Marketing</span>
                    <span className="block text-muted-foreground">
                      Used for campaign measurement. No marketing provider is configured yet.
                    </span>
                  </span>
                </label>
              </fieldset>
            ) : null}
          </div>

          <div className="flex flex-wrap gap-2 lg:justify-end">
            {showPrefs ? null : (
              <button
                type="button"
                onClick={() => setShowPrefs(true)}
                className="inline-flex min-h-11 items-center rounded-lg border border-border-strong px-4 text-sm font-medium hover:bg-surface"
              >
                Manage preferences
              </button>
            )}
            <button
              type="button"
              onClick={() => save({ analytics: false, marketing: false })}
              className="inline-flex min-h-11 items-center rounded-lg border border-border-strong px-4 text-sm font-medium hover:bg-surface"
            >
              Reject non-essential
            </button>
            <button
              type="button"
              onClick={() =>
                showPrefs
                  ? save({ analytics, marketing })
                  : save({ analytics: true, marketing: true })
              }
              className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {showPrefs ? "Save choices" : "Accept all"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CookiePreferencesButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={cn("underline", className)}
      onClick={() => window.dispatchEvent(new CustomEvent("nova-open-cookie-preferences"))}
    >
      Cookie preferences
    </button>
  );
}
