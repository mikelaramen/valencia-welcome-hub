import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, FileText, Brain, LayoutDashboard } from "lucide-react";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — SettleInValencia" },
      {
        name: "description",
        content:
          "Three stages: assessment, AI-generated roadmap, personal dashboard. See how SettleInValencia turns Valencia relocation into a guided plan.",
      },
      { property: "og:title", content: "How it works — SettleInValencia" },
      {
        property: "og:description",
        content:
          "Assessment, AI roadmap, dashboard. The three stages of SettleInValencia.",
      },
    ],
  }),
  component: HowItWorksPage,
});

function HowItWorksPage() {
  const { t } = useTranslation();
  const steps = [
    { key: "assessment", icon: FileText, label: t("home.how.step1.title") },
    { key: "roadmap", icon: Brain, label: t("home.how.step2.title") },
    { key: "dashboard", icon: LayoutDashboard, label: t("home.how.step3.title") },
  ] as const;

  return (
    <div className="mx-auto max-w-5xl px-6 py-20 lg:py-32">
      <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
        {t("home.how.eyebrow")}
      </p>
      <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl">
        {t("how.title")}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-foreground/60">{t("how.subtitle")}</p>

      <div className="mt-16 space-y-12">
        {steps.map((step, i) => (
          <article
            key={step.key}
            className="grid gap-8 rounded-3xl border border-border bg-card p-10 md:grid-cols-[auto_1fr] md:p-12"
          >
            <div className="flex flex-col items-start gap-4">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-terracotta/10 text-terracotta">
                <step.icon className="size-5" />
              </span>
              <span className="font-serif text-4xl font-medium text-foreground/20">
                0{i + 1}
              </span>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-medium text-foreground">{step.label}</h2>
              <p className="mt-4 max-w-prose text-foreground/70 leading-relaxed">
                {t(`how.details.${step.key}`)}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-20 flex flex-col items-start gap-4 rounded-3xl bg-foreground p-10 text-background md:flex-row md:items-center md:justify-between md:p-12">
        <p className="font-serif text-2xl tracking-tight md:text-3xl">{t("home.heroTitle")}</p>
        <Link
          to="/contact"
          className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-terracotta px-6 py-3 text-sm font-medium text-white"
        >
          {t("cta.freePlan")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
