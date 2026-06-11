import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & pricing — SettleInValencia" },
      {
        name: "description",
        content:
          "Three premium relocation tiers: Strategy Session (99€), Personal Plan (399€–599€), and full Concierge (1.500€+). Transparent pricing for moving to Valencia.",
      },
      { property: "og:title", content: "Services & pricing — SettleInValencia" },
      {
        property: "og:description",
        content:
          "Strategy Session, Personal Plan and Concierge — three transparent tiers for relocating to Valencia.",
      },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t } = useTranslation();

  const tiers = [
    { key: "strategy", price: "99€", suffix: t("services.perSession"), cta: t("cta.bookNow"), highlighted: false },
    { key: "plan", price: "399€", suffix: "— 599€", cta: t("cta.select"), highlighted: true },
    { key: "concierge", price: "1.500€", suffix: "— 3.000€+", cta: t("cta.inquire"), highlighted: false },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32">
      <div className="max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
          {t("home.services.eyebrow")}
        </p>
        <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl">
          {t("services.title")}
        </h1>
        <p className="mt-6 text-lg text-foreground/60">{t("services.subtitle")}</p>
      </div>

      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => {
          const features = t(`services.${tier.key}.features`, { returnObjects: true }) as string[];
          const highlighted = tier.highlighted;
          return (
            <div
              key={tier.key}
              className={
                highlighted
                  ? "relative rounded-2xl border-2 border-terracotta bg-card p-8 shadow-xl shadow-terracotta/10"
                  : "rounded-2xl border border-border bg-card p-8"
              }
            >
              {highlighted ? (
                <span className="absolute -top-3 left-8 rounded-full bg-terracotta px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  {t("home.services.popular")}
                </span>
              ) : null}
              <p className={`text-xs font-bold uppercase tracking-widest ${highlighted ? "text-terracotta" : "text-foreground/40"}`}>
                {t(`services.${tier.key}.name`)}
              </p>
              <p className="mt-6 flex items-baseline gap-2 font-serif text-4xl font-medium text-foreground">
                {tier.price}
                <span className="text-sm font-normal text-foreground/40">{tier.suffix}</span>
              </p>
              <p className="mt-4 text-sm text-foreground/60">{t(`services.${tier.key}.summary`)}</p>
              <ul className="mt-6 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/70">
                    <Check className="mt-0.5 size-4 shrink-0 text-terracotta" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={
                  highlighted
                    ? "mt-8 inline-flex w-full items-center justify-center rounded-full bg-foreground py-3 text-sm font-medium text-background"
                    : "mt-8 inline-flex w-full items-center justify-center rounded-full border border-border bg-background py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                }
              >
                {tier.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
