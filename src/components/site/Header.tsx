import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import { CtaLink } from "@/components/site/cta";
import { headerNav, externalNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Header() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  // Close every menu after navigation.
  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenId(null);
        setMobileOpen(false);
      }
    }
    function onClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenId(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page">
        <div className="flex h-20 items-center justify-between gap-4">
          <Link to="/" className="shrink-0" aria-label="NOVA Compliance home">
            <Logo />
          </Link>

          <div ref={navRef} className="hidden items-center gap-1 lg:flex">
            {headerNav.map((entry) =>
              entry.kind === "link" ? (
                <Link
                  key={entry.to}
                  to={entry.to as any}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-surface"
                >
                  {entry.label}
                </Link>
              ) : (
                <div key={entry.id} className="relative">
                  <button
                    type="button"
                    aria-expanded={openId === entry.id}
                    aria-haspopup="true"
                    onClick={() => setOpenId(openId === entry.id ? null : entry.id)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium hover:bg-surface",
                      openId === entry.id && "bg-surface text-primary",
                    )}
                  >
                    {entry.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn("h-4 w-4 transition-transform", openId === entry.id && "rotate-180")}
                    />
                  </button>

                  {openId === entry.id ? (
                    <div
                      className={cn(
                        "absolute left-0 top-full z-50 mt-2 rounded-xl border border-border bg-popover p-4 shadow-lift",
                        entry.groups.length > 1 ? "w-[42rem]" : "w-[24rem]",
                      )}
                    >
                      <div className={cn("grid gap-5", entry.groups.length > 1 && "grid-cols-2")}>
                        {entry.groups.map((group) => (
                          <div key={group.label}>
                            <p className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {group.label}
                            </p>
                            <ul className="mt-2 space-y-0.5">
                              {group.items.map((item) => (
                                <li key={item.to}>
                                  <Link
                                    to={item.to as any}
                                    onClick={() => setOpenId(null)}
                                    className="block rounded-lg px-2 py-2 hover:bg-surface"
                                  >
                                    <span className="flex items-center justify-between gap-2 text-sm font-medium">
                                      {item.label}
                                      {item.badge ? (
                                        <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.625rem] font-medium text-secondary-foreground">
                                          {item.badge}
                                        </span>
                                      ) : null}
                                    </span>
                                    {item.description ? (
                                      <span className="mt-0.5 block text-xs text-muted-foreground">
                                        {item.description}
                                      </span>
                                    ) : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ),
            )}
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {externalNav.map((item) => (
              <a
                key={item.to}
                href={item.to}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-1 rounded-lg px-3 text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            ))}
            <CtaLink to="/book-demo" variant="outline">
              Book a demo
            </CtaLink>
            <CtaLink to="/start" variant="primary">
              Start free
            </CtaLink>
          </div>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X aria-hidden="true" className="h-5 w-5" /> : <Menu aria-hidden="true" className="h-5 w-5" />}
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div id="mobile-navigation" className="max-h-[calc(100vh-5rem)] overflow-y-auto border-t border-border bg-background lg:hidden">
          <div className="container-page py-4">
            <ul className="space-y-1">
              {headerNav.map((entry) =>
                entry.kind === "link" ? (
                  <li key={entry.to}>
                    <Link to={entry.to} className="block rounded-lg px-3 py-3 font-medium hover:bg-surface">
                      {entry.label}
                    </Link>
                  </li>
                ) : (
                  <li key={entry.id}>
                    <button
                      type="button"
                      aria-expanded={mobileSection === entry.id}
                      onClick={() => setMobileSection(mobileSection === entry.id ? null : entry.id)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-left font-medium hover:bg-surface"
                    >
                      {entry.label}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn("h-4 w-4 transition-transform", mobileSection === entry.id && "rotate-180")}
                      />
                    </button>
                    {mobileSection === entry.id ? (
                      <div className="space-y-3 pb-2 pl-3">
                        {entry.groups.map((group) => (
                          <div key={group.label}>
                            <p className="px-2 pt-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {group.label}
                            </p>
                            <ul>
                              {group.items.map((item) => (
                                <li key={item.to}>
                                  <Link to={item.to as any} className="block rounded-lg px-2 py-2.5 text-sm hover:bg-surface">
                                    {item.label}
                                    {item.badge ? (
                                      <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-[0.625rem] text-secondary-foreground">
                                        {item.badge}
                                      </span>
                                    ) : null}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </li>
                ),
              )}
            </ul>

            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              <CtaLink to="/start" variant="primary">
                Start free
              </CtaLink>
              <CtaLink to="/book-demo" variant="outline">
                Book a demo
              </CtaLink>
              {externalNav.map((item) => (
                <CtaLink key={item.to} to={item.to as any} variant="ghost" external>
                  {item.label}
                </CtaLink>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
