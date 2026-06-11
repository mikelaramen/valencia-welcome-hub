import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SettleInValencia" },
      {
        name: "description",
        content:
          "Tell us about your move to Valencia. We respond within one business day.",
      },
      { property: "og:title", content: "Contact — SettleInValencia" },
      {
        property: "og:description",
        content: "Reach out about your Valencia relocation.",
      },
    ],
  }),
  component: ContactPage,
});

const ContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(1).max(2000),
});

function ContactPage() {
  const { t } = useTranslation();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    const form = new FormData(e.currentTarget);
    const parsed = ContactSchema.safeParse({
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    });

    if (!parsed.success) {
      setStatus("error");
      setError(parsed.error.issues[0]?.message ?? t("contact.error"));
      return;
    }

    // Phase 1: just simulate. Wired to Lovable Cloud in Phase 2.
    await new Promise((r) => setTimeout(r, 600));
    setStatus("success");
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:py-32">
      <h1 className="font-serif text-5xl font-medium tracking-tight text-foreground md:text-6xl">
        {t("contact.title")}
      </h1>
      <p className="mt-6 text-lg text-foreground/60">{t("contact.subtitle")}</p>

      <form onSubmit={onSubmit} className="mt-12 space-y-6">
        <Field name="name" label={t("contact.name")} type="text" required maxLength={120} />
        <Field name="email" label={t("contact.email")} type="email" required maxLength={255} />
        <div className="space-y-2">
          <label htmlFor="message" className="block text-sm font-medium text-foreground">
            {t("contact.message")}
          </label>
          <textarea
            id="message"
            name="message"
            required
            maxLength={2000}
            rows={6}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring/40"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center justify-center rounded-full bg-terracotta px-7 py-3.5 text-sm font-medium text-white shadow-lg shadow-terracotta/20 disabled:opacity-50"
        >
          {status === "loading" ? "…" : t("contact.send")}
        </button>

        {status === "success" ? (
          <p className="text-sm font-medium text-terracotta">{t("contact.success")}</p>
        ) : null}
        {status === "error" && error ? (
          <p className="text-sm font-medium text-destructive">{error}</p>
        ) : null}
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type,
  required,
  maxLength,
}: {
  name: string;
  label: string;
  type: string;
  required?: boolean;
  maxLength?: number;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        maxLength={maxLength}
        className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring/40"
      />
    </div>
  );
}
