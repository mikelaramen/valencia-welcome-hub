import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: AdminOverview,
});

async function count(table: "consultations" | "services" | "knowledge_base" | "blog_posts" | "partners" | "profiles", filter?: { col: string; val: unknown }) {
  let q = supabase.from(table).select("*", { count: "exact", head: true });
  if (filter) q = q.eq(filter.col, filter.val as never);
  const { count: c } = await q;
  return c ?? 0;
}

function AdminOverview() {
  const { t } = useTranslation();

  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => ({
      leads: await count("consultations"),
      newLeads: await count("consultations", { col: "status", val: "new" }),
      services: await count("services"),
      knowledge: await count("knowledge_base"),
      partners: await count("partners"),
      posts: await count("blog_posts"),
      users: await count("profiles"),
    }),
  });

  const recent = useQuery({
    queryKey: ["admin", "recent_leads"],
    queryFn: async () => {
      const { data } = await supabase
        .from("consultations")
        .select("id,name,email,status,created_at")
        .order("created_at", { ascending: false })
        .limit(5);
      return data ?? [];
    },
  });

  const s = stats.data;
  const cards: Array<{ key: string; value: number; to: string }> = [
    { key: "leads", value: s?.leads ?? 0, to: "/admin/consultations" },
    { key: "newLeads", value: s?.newLeads ?? 0, to: "/admin/consultations" },
    { key: "users", value: s?.users ?? 0, to: "/admin/users" },
    { key: "services", value: s?.services ?? 0, to: "/admin/services" },
    { key: "posts", value: s?.posts ?? 0, to: "/admin/blog" },
    { key: "knowledge", value: s?.knowledge ?? 0, to: "/admin/knowledge" },
    { key: "partners", value: s?.partners ?? 0, to: "/admin/partners" },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl">{t("admin.overview.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("admin.overview.subtitle")}</p>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-muted"
          >
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              {t(`admin.overview.${c.key}`)}
            </div>
            <div className="mt-2 font-serif text-3xl">{c.value}</div>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 font-serif text-xl">{t("admin.overview.recentLeads")}</h2>
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {(recent.data ?? []).map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between border-b border-border px-5 py-3 last:border-b-0"
          >
            <div>
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground">{r.email}</div>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{r.status}</span>
              <div className="mt-1 text-xs text-muted-foreground">
                {new Date(r.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
        {(recent.data ?? []).length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            {t("admin.overview.noLeads")}
          </div>
        ) : null}
      </div>
    </div>
  );
}
