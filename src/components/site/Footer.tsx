import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { Logo } from "@/components/site/Logo";
import { footerColumns } from "@/config/navigation";
import { site, socialLinks } from "@/config/site";
import { CookiePreferencesButton } from "@/components/site/CookieConsent";

type FooterRouteTo = NonNullable<ComponentProps<typeof Link>["to"]>;
const footerRouteTo = (path: string): FooterRouteTo => path as FooterRouteTo;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-chrome bg-ink text-ink-foreground">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2.4fr)]">
          <div>
            <Logo inverted />
            <p className="mt-5 max-w-sm text-sm text-ink-foreground/70">{site.tagline}</p>
            <p className="mt-4 max-w-sm text-sm text-ink-foreground/60">{site.ownership}</p>
          </div>

          <nav aria-label="Footer" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((col) => (
              <div key={col.label}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-foreground/50">
                  {col.label}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {col.items.map((item) => (
                    <li key={item.to}>
                      {item.external ? (
                        <a
                          href={item.to}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="text-sm text-ink-foreground/80 hover:text-ink-foreground hover:underline"
                        >
                          {item.label}
                          <span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ) : (
                        <Link
                          to={footerRouteTo(item.to)}
                          className="text-sm text-ink-foreground/80 hover:text-ink-foreground hover:underline"
                        >
                          {item.label}
                        </Link>
                      )}
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
              <a
                key={s.href}
                href={s.href}
                className="hover:text-ink-foreground"
                target="_blank"
                rel="noreferrer noopener"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs leading-relaxed text-ink-foreground/50">
          {site.frameworkDisclaimer}
        </p>
      </div>
    </footer>
  );
}
