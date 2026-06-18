import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ResourceEditor, type FieldDef } from "@/components/admin/resource-editor";

export const Route = createFileRoute("/_authenticated/admin/knowledge")({
  component: AdminKnowledge,
});

type Row = {
  id: string;
  slug: string;
  category: string;
  title: string;
  title_es: string | null;
  content: string | null;
  content_es: string | null;
  url: string | null;
  published: boolean;
  sort_order: number;
};

const FIELDS: FieldDef[] = [
  { name: "slug", label: "Slug" },
  { name: "category", label: "Category" },
  { name: "title", label: "Title (EN)" },
  { name: "title_es", label: "Title (ES)" },
  { name: "content", label: "Content (EN)", type: "textarea" },
  { name: "content_es", label: "Content (ES)", type: "textarea" },
  { name: "url", label: "External URL" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "published", label: "Published", type: "boolean" },
];

const EMPTY: Partial<Row> = {
  slug: "",
  category: "",
  title: "",
  title_es: "",
  content: "",
  content_es: "",
  url: "",
  published: true,
  sort_order: 0,
};

function AdminKnowledge() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const query = useQuery({
    queryKey: ["admin", "knowledge"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("knowledge_base")
        .select("*")
        .order("category", { ascending: true })
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: Partial<Row>) => {
      const { id, ...rest } = values;
      if (id) {
        const { error } = await supabase.from("knowledge_base").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("knowledge_base").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "knowledge"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("knowledge_base").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "knowledge"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">{t("admin.knowledge.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.knowledge.subtitle")}</p>
        </div>
        <Button onClick={() => setEditing(EMPTY)}>{t("admin.new")}</Button>
      </div>
      <div className="mt-6 space-y-2">
        {(query.data ?? []).map((r) => (
          <div
            key={r.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3"
          >
            <div>
              <div className="font-medium">{r.title}</div>
              <div className="text-xs text-muted-foreground">
                {r.category} · /{r.slug} · {r.published ? "published" : "draft"}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(r)}>
                {t("admin.edit")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => confirm(t("admin.confirmDelete") ?? "Delete?") && remove.mutate(r.id)}
              >
                {t("admin.delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <ResourceEditor
        open={editing !== null}
        onOpenChange={(o) => !o && setEditing(null)}
        title={editing?.id ? t("admin.edit") : t("admin.new")}
        fields={FIELDS}
        initial={editing ?? EMPTY}
        onSubmit={async (v) => upsert.mutateAsync(v)}
      />
    </div>
  );
}
