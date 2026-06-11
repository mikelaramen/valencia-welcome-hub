import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

import { blogPosts } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/")({
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith("es") ? "es" : "en";

  return (
    <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32">
      <h1 className="font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl">
        {t("blog.title")}
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-foreground/60">{t("blog.subtitle")}</p>

      <div className="mt-16 grid gap-10 md:grid-cols-2">
        {blogPosts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group block"
          >
            <div className="overflow-hidden rounded-2xl bg-sand">
              <img
                src={p.image}
                alt={p.title[lang]}
                width={1280}
                height={832}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-terracotta">
              {p.tag[lang]}
            </p>
            <h2 className="mt-2 font-serif text-2xl font-medium text-foreground group-hover:text-terracotta transition-colors">
              {p.title[lang]}
            </h2>
            <p className="mt-2 text-sm text-foreground/60">{p.excerpt[lang]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
