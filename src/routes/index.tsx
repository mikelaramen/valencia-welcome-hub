import { Link, createFileRoute } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, CircleDot, Circle, Sparkles } from "lucide-react";

import balconyImage from "@/assets/valencia-balcony.jpg";
import founderImage from "@/assets/founder.jpg";
import blogRuzafa from "@/assets/blog-ruzafa.jpg";
import blogBeckham from "@/assets/blog-beckham.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SettleInValencia — AI-powered relocation to Valencia" },
      {
        name: "description",
        content:
          "An AI relocation roadmap and local expert network for professionals, remote workers and families moving to Valencia, Spain.",
      },
      { property: "og:title", content: "SettleInValencia — AI-powered relocation to Valencia" },
      {
        property: "og:description",
        content:
          "Visa, housing, banking and integration — handled with a guided digital plan and a real human team in Valencia.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();

  return (
    <>
      <Hero />
      <TrustStrip />
      <HowItWorks />
      <ServicesPreview />
      <FounderTeaser />
      <BlogTeaser />
      <ClosingCta />
    </>
  );
}

function Hero() {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-terracotta/10 px-3 py-1 ring-1 ring-terracotta/20">
              <Sparkles className="size-3 text-terracotta" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
                {t("home.eyebrow")}
              </span>
            </span>
            <h1 className="mt-6 max-w-[16ch] text-balance font-serif text-5xl font-medium leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-[5rem]">
              {t("home.heroTitle")}
            </h1>
            <p className="mt-8 max-w-[52ch] text-pretty text-lg leading-relaxed text-foreground/70">
              {t("home.heroSubtitle")}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-terracotta px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-terracotta/20 ring-1 ring-terracotta/80 transition-transform active:scale-95"
              >
                {t("cta.freePlan")}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center rounded-full border border-border bg-background px-6 py-3.5 text-base font-medium text-foreground hover:bg-accent transition-colors"
              >
                {t("cta.bookCall")}
              </Link>
            </div>
            <p className="mt-8 text-xs font-medium uppercase tracking-widest text-foreground/40">
              {t("home.trustedBy")}
            </p>
          </div>

          <RoadmapMock />
        </div>
      </div>
    </section>
  );
}

function RoadmapMock() {
  const { t } = useTranslation();
  return (
    <div className="relative">
      <div className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-terracotta/10 via-sand/40 to-transparent blur-2xl" />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl shadow-foreground/5">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-2.5 rounded-full bg-terracotta" />
            <span className="text-sm font-semibold tracking-tight text-foreground">
              {t("home.roadmap.title")}
            </span>
          </div>
          <span className="text-[10px] font-medium uppercase tracking-widest text-foreground/40">
            {t("home.roadmap.progress")}
          </span>
        </div>
        <div className="space-y-3">
          <RoadmapRow
            state="done"
            title={t("home.roadmap.step1")}
            meta={t("home.roadmap.step1Meta")}
          />
          <RoadmapRow
            state="active"
            title={t("home.roadmap.step2")}
            meta={t("home.roadmap.step2Meta")}
          />
          <RoadmapRow
            state="locked"
            title={t("home.roadmap.step3")}
            meta={t("home.roadmap.step3Meta")}
          />
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden rounded-xl border border-border bg-foreground p-4 text-background shadow-2xl lg:block max-w-[16rem]">
        <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
          {t("home.roadmap.tipLabel")}
        </p>
        <p className="mt-1 text-xs font-medium leading-snug text-background/80">
          {t("home.roadmap.tipBody")}
        </p>
      </div>
    </div>
  );
}

function RoadmapRow({
  state,
  title,
  meta,
}: {
  state: "done" | "active" | "locked";
  title: string;
  meta: string;
}) {
  if (state === "done") {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-border bg-sand/40 p-4">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-terracotta/20 text-terracotta">
          <Check className="size-3.5" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
          <p className="text-[11px] text-foreground/40">{meta}</p>
        </div>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className="flex items-center gap-4 rounded-xl border border-terracotta/30 bg-terracotta/5 p-4">
        <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-terracotta text-terracotta">
          <CircleDot className="size-3 animate-pulse" />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{title}</p>
          <p className="text-[11px] font-medium text-terracotta">{meta}</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 opacity-60">
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border text-foreground/30">
        <Circle className="size-3" />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{title}</p>
        <p className="text-[11px] text-foreground/40">{meta}</p>
      </div>
    </div>
  );
}

function TrustStrip() {
  return (
    <div className="border-y border-border bg-sand/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-8 px-6 py-8 text-foreground/40">
        {["Ayuntamiento de València", "Generalitat Valenciana", "VLC Tech Hub", "Cámara Valencia", "Beckham Law experts"].map(
          (label) => (
            <span key={label} className="font-serif text-base italic">
              {label}
            </span>
          ),
        )}
      </div>
    </div>
  );
}

function HowItWorks() {
  const { t } = useTranslation();
  const steps = ["step1", "step2", "step3"] as const;
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
      <div className="max-w-2xl">
        <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
          {t("home.how.eyebrow")}
        </p>
        <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
          {t("home.how.title")}
        </h2>
        <p className="mt-4 text-foreground/60">{t("home.how.subtitle")}</p>
      </div>
      <div className="mt-16 grid gap-12 md:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s} className="group">
            <span className="font-serif text-4xl font-medium text-terracotta/30 transition-colors group-hover:text-terracotta">
              0{i + 1}
            </span>
            <h3 className="mt-4 text-lg font-semibold text-foreground">
              {t(`home.how.${s}.title`)}
            </h3>
            <p className="mt-3 max-w-[36ch] text-pretty text-sm leading-relaxed text-foreground/60">
              {t(`home.how.${s}.body`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ServicesPreview() {
  const { t } = useTranslation();
  const tiers = [
    {
      key: "strategy",
      price: "99€",
      suffix: t("services.perSession"),
      cta: t("cta.bookNow"),
      highlighted: false,
    },
    {
      key: "plan",
      price: "399€",
      suffix: "— 599€",
      cta: t("cta.select"),
      highlighted: true,
    },
    {
      key: "concierge",
      price: "1.500€",
      suffix: "— 3.000€+",
      cta: t("cta.inquire"),
      highlighted: false,
    },
  ];

  return (
    <section className="bg-sand/40 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
            {t("home.services.eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {t("home.services.title")}
          </h2>
          <p className="mt-4 text-foreground/60">{t("home.services.subtitle")}</p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier) => {
            const features = t(`services.${tier.key}.features`, {
              returnObjects: true,
            }) as string[];
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
                <p
                  className={`text-xs font-bold uppercase tracking-widest ${highlighted ? "text-terracotta" : "text-foreground/40"}`}
                >
                  {t(`services.${tier.key}.name`)}
                </p>
                <p className="mt-6 flex items-baseline gap-2 font-serif text-4xl font-medium text-foreground">
                  {tier.price}
                  <span className="text-sm font-normal text-foreground/40">{tier.suffix}</span>
                </p>
                <p className="mt-4 text-sm text-foreground/60">
                  {t(`services.${tier.key}.summary`)}
                </p>
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
    </section>
  );
}

function FounderTeaser() {
  const { t } = useTranslation();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
      <div className="overflow-hidden rounded-3xl bg-foreground text-background">
        <div className="grid lg:grid-cols-[1.2fr_1fr]">
          <div className="flex flex-col justify-center p-10 md:p-16">
            <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
              {t("home.founder.eyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-medium tracking-tight md:text-4xl">
              {t("home.founder.title")}
            </h2>
            <p className="mt-6 max-w-prose text-pretty text-base leading-relaxed text-background/70">
              {t("home.founder.body")}
            </p>
            <div className="mt-8">
              <p className="text-sm font-semibold">{t("home.founder.name")}</p>
              <p className="text-xs text-background/50">{t("home.founder.role")}</p>
            </div>
          </div>
          <img
            src={founderImage}
            alt={t("home.founder.name")}
            width={1024}
            height={1280}
            loading="lazy"
            className="h-full w-full object-cover aspect-[4/5] lg:aspect-auto"
          />
        </div>
      </div>
    </section>
  );
}

function BlogTeaser() {
  const { t } = useTranslation();
  const posts = [
    {
      slug: "ruzafa-digital-nomad-guide",
      title:
        t("blog.title").includes("Ideas")
          ? "Guía 2026 de nómada digital en Ruzafa"
          : "The 2026 digital nomad guide to Ruzafa",
      excerpt:
        t("blog.title").includes("Ideas")
          ? "Los mejores cafés, espacios de coworking y rincones ocultos del barrio más vibrante de Valencia."
          : "The best cafés, coworking spaces and hidden corners of Valencia's most vibrant neighborhood.",
      image: blogRuzafa,
      tag: t("blog.title").includes("Ideas") ? "Barrios" : "Neighborhoods",
    },
    {
      slug: "beckham-law-explained",
      title:
        t("blog.title").includes("Ideas")
          ? "La Ley Beckham para nómadas remotos"
          : "Understanding the Beckham Law for remote workers",
      excerpt:
        t("blog.title").includes("Ideas")
          ? "Cómo los trabajadores remotos pueden ahorrar hasta un 24% en impuestos al mudarse a España."
          : "How remote workers can save up to 24% on Spanish taxes when relocating in 2026.",
      image: blogBeckham,
      tag: t("blog.title").includes("Ideas") ? "Fiscalidad" : "Tax",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 lg:pb-32">
      <div className="flex items-end justify-between gap-8">
        <div className="max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-terracotta">
            {t("home.blog.eyebrow")}
          </p>
          <h2 className="mt-3 font-serif text-4xl font-medium tracking-tight text-foreground md:text-5xl">
            {t("home.blog.title")}
          </h2>
          <p className="mt-4 text-foreground/60">{t("home.blog.subtitle")}</p>
        </div>
        <Link
          to="/blog"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-terracotta transition-colors"
        >
          {t("cta.viewAll")} <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="group block"
          >
            <div className="overflow-hidden rounded-2xl bg-sand">
              <img
                src={p.image}
                alt={p.title}
                width={1280}
                height={832}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <p className="mt-5 text-[10px] font-bold uppercase tracking-widest text-terracotta">
              {p.tag}
            </p>
            <h3 className="mt-2 font-serif text-2xl font-medium text-foreground group-hover:text-terracotta transition-colors">
              {p.title}
            </h3>
            <p className="mt-2 text-sm text-foreground/60">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ClosingCta() {
  const { t } = useTranslation();
  return (
    <section className="border-t border-border bg-sand/40">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
            {t("home.heroTitle")}
          </h2>
        </div>
        <Link
          to="/contact"
          className="group inline-flex items-center gap-2 self-start rounded-full bg-terracotta px-7 py-3.5 text-base font-medium text-white shadow-lg shadow-terracotta/20"
        >
          {t("cta.freePlan")}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <img
        src={balconyImage}
        alt="Valencia balcony at golden hour"
        width={1280}
        height={896}
        loading="lazy"
        className="mx-auto max-w-7xl w-full h-64 md:h-80 object-cover px-6 pb-20"
      />
    </section>
  );
}
