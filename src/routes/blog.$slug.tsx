import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

import { blogPosts, getPost } from "@/lib/blog-posts";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return { meta: [{ title: "Article — SettleInValencia" }] };
    return {
      meta: [
        { title: `${post.title.en} — SettleInValencia` },
        { name: "description", content: post.excerpt.en },
        { property: "og:title", content: post.title.en },
        { property: "og:description", content: post.excerpt.en },
        { property: "og:image", content: post.image },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: post.image },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-serif text-4xl">Article not found</h1>
      <Link to="/blog" className="mt-6 inline-block text-terracotta">
        ← Back to blog
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <h1 className="font-serif text-3xl">Couldn't load article</h1>
      <p className="mt-2 text-sm text-foreground/60">{error.message}</p>
      <button onClick={reset} className="mt-6 text-terracotta">
        Try again
      </button>
    </div>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith("es") ? "es" : "en";

  return (
    <article className="mx-auto max-w-3xl px-6 py-20 lg:py-28">
      <Link
        to="/blog"
        className="inline-flex items-center gap-2 text-sm font-medium text-foreground/60 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t("blog.back")}
      </Link>
      <p className="mt-10 text-[10px] font-bold uppercase tracking-widest text-terracotta">
        {post.tag[lang]}
      </p>
      <h1 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {post.title[lang]}
      </h1>
      <p className="mt-4 text-sm text-foreground/50">
        {new Date(post.date).toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <div className="mt-10 overflow-hidden rounded-2xl">
        <img
          src={post.image}
          alt={post.title[lang]}
          width={1280}
          height={832}
          className="aspect-[16/10] w-full object-cover"
        />
      </div>
      <div className="mt-12 space-y-6 text-base leading-relaxed text-foreground/80">
        {post.body[lang].split(/\n\n+/).map((para: string, i: number) => (
          <p key={i}>{para}</p>
        ))}
      </div>
    </article>
  );
}
