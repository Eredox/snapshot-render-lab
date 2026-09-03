import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { footerColumns } from "@/config/navigation";
import { site, appUrls, socialLinks } from "@/config/site";
import { CookiePreferencesButton } from "@/components/site/CookieConsent";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-ink-foreground">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-sm text-sm text-ink-foreground/70">{site.tagline}</p>
            <p className="mt-4 max-w-sm text-sm text-ink-foreground/60">{site.ownership}</p>
            <a
              href={appUrls.app}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-ink-foreground hover:underline"
            >
              Sign in to NOVA
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.label}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-foreground/50">{col.label}</h2>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.to}>
                      <Link to={item.to} className="text-sm text-ink-foreground/80 hover:text-ink-foreground hover:underline">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-foreground/15 pt-6 text-sm text-ink-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.company}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <CookiePreferencesButton className="text-ink-foreground/70 hover:text-ink-foreground" />
            {socialLinks.map((s) => (
              <a key={s.href} href={s.href} className="hover:text-ink-foreground" target="_blank" rel="noreferrer noopener">
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-foreground/50">{site.frameworkDisclaimer}</p>
      </div>
    </footer>
  );
}
