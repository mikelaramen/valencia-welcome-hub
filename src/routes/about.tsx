import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import founderImage from "@/assets/founder.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SettleInValencia" },
      {
        name: "description",
        content:
          "Founded by relocation expert Elena Martínez, SettleInValencia combines AI with a curated network of Valencia-based lawyers, gestores and real-estate partners.",
      },
      { property: "og:title", content: "About — SettleInValencia" },
      {
        property: "og:description",
        content:
          "Local knowledge plus AI relocation tooling. Built by someone who's done it.",
      },
      { property: "og:image", content: founderImage },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { t } = useTranslation();
  const paragraphs = t("about.story", { returnObjects: true }) as string[];

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:py-32">
      <div className="grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:items-start">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
            {t("home.founder.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl">
            {t("about.title")}
          </h1>
          <p className="mt-6 text-lg text-foreground/60">{t("about.subtitle")}</p>
          <div className="mt-10 space-y-6 text-foreground/70 leading-relaxed">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 border-t border-border pt-6">
            <p className="font-semibold text-foreground">{t("home.founder.name")}</p>
            <p className="text-sm text-foreground/60">{t("home.founder.role")}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-3xl">
          <img
            src={founderImage}
            alt={t("home.founder.name")}
            width={1024}
            height={1280}
            loading="lazy"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
