import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

import { LanguageToggle } from "./language-toggle";

export function SiteNav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links: Array<{ to: string; key: string }> = [
    { to: "/how-it-works", key: "howItWorks" },
    { to: "/services", key: "services" },
    { to: "/about", key: "about" },
    { to: "/blog", key: "blog" },
    { to: "/resources", key: "resources" },
    { to: "/contact", key: "contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="font-serif text-xl font-medium tracking-tight text-foreground"
          >
            SettleIn<span className="text-terracotta">Valencia</span>
          </Link>
          <div className="hidden items-center gap-6 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {t(`nav.${l.key}`)}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden items-center gap-5 lg:flex">
          <LanguageToggle className="border-r border-border pr-5" />
          <Link
            to="/contact"
            className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            to="/contact"
            className="group inline-flex items-center rounded-full bg-foreground py-2 pl-4 pr-3 text-sm font-medium text-background ring-1 ring-foreground transition-transform active:scale-95"
          >
            {t("nav.getStarted")}
            <svg
              className="ml-2 size-4 shrink-0 opacity-60 transition-transform group-hover:translate-x-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="lg:hidden p-2 -mr-2 text-foreground"
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open ? (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-foreground"
              >
                {t(`nav.${l.key}`)}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <LanguageToggle />
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
              >
                {t("nav.getStarted")}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
