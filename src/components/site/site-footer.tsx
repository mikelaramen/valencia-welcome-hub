import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function SiteFooter() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-sand/40 pt-20 pb-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link to="/" className="font-serif text-2xl font-medium text-foreground">
              SettleIn<span className="text-terracotta">Valencia</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-foreground/60">{t("footer.disclaimer")}</p>
            <form
              className="mt-8 max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <p className="text-sm font-semibold">{t("footer.newsletterTitle")}</p>
              <p className="mt-1 text-xs text-foreground/60">{t("footer.newsletterBody")}</p>
              <div className="mt-4 flex gap-2">
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="h-10 flex-1 rounded-lg border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
                />
                <button
                  type="submit"
                  className="h-10 rounded-lg bg-foreground px-5 text-xs font-medium text-background transition-transform active:scale-95"
                >
                  {t("cta.subscribe")}
                </button>
              </div>
            </form>
          </div>

          <FooterCol
            title={t("footer.platform")}
            items={[
              { label: t("nav.howItWorks"), to: "/how-it-works" },
              { label: t("nav.services"), to: "/services" },
              { label: t("nav.resources"), to: "/resources" },
            ]}
          />
          <FooterCol
            title={t("footer.company")}
            items={[
              { label: t("nav.about"), to: "/about" },
              { label: t("nav.blog"), to: "/blog" },
              { label: t("nav.contact"), to: "/contact" },
            ]}
          />
          <FooterCol
            title={t("footer.legal")}
            items={[
              { label: t("footer.privacy"), to: "/contact" },
              { label: t("footer.terms"), to: "/contact" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-3 border-t border-border pt-8 text-xs text-foreground/50 sm:flex-row sm:items-center">
          <p>
            © {year} SettleInValencia S.L. {t("footer.rights")}
          </p>
          <p>{t("footer.madeIn")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: Array<{ label: string; to: string }>;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/40">{title}</p>
      <ul className="mt-5 space-y-3 text-sm text-foreground/70">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="hover:text-terracotta transition-colors">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
