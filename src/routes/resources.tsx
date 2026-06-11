import { createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Free resources — SettleInValencia" },
      {
        name: "description",
        content:
          "Free Valencia relocation resources: visa pathways, neighborhood guides, padrón / NIE / TIE primers and the Beckham Law explained.",
      },
      { property: "og:title", content: "Free resources — SettleInValencia" },
      {
        property: "og:description",
        content: "Guides, checklists and primers for moving to Valencia.",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { t } = useTranslation();
  const items = t("resources.items", { returnObjects: true }) as Array<{
    title: string;
    body: string;
  }>;

  return (
    <div className="mx-auto max-w-6xl px-6 py-20 lg:py-32">
      <h1 className="font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl">
        {t("resources.title")}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-foreground/60">{t("resources.subtitle")}</p>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        {items.map((it) => (
          <article
            key={it.title}
            className="rounded-2xl border border-border bg-card p-8 transition-colors hover:border-terracotta/40"
          >
            <h2 className="font-serif text-2xl font-medium text-foreground">{it.title}</h2>
            <p className="mt-3 text-sm text-foreground/60 leading-relaxed">{it.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
