import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ResourceEditor, type FieldDef } from "@/components/admin/resource-editor";

export const Route = createFileRoute("/_authenticated/admin/blog")({
  component: AdminBlog,
});

type Row = {
  id: string;
  slug: string;
  title: string;
  title_es: string | null;
  excerpt: string | null;
  excerpt_es: string | null;
  content: string | null;
  content_es: string | null;
  cover_image: string | null;
  author: string | null;
  tags: string[];
  published: boolean;
  published_at: string | null;
};

const FIELDS: FieldDef[] = [
  { name: "slug", label: "Slug" },
  { name: "title", label: "Title (EN)" },
  { name: "title_es", label: "Title (ES)" },
  { name: "excerpt", label: "Excerpt (EN)", type: "textarea" },
  { name: "excerpt_es", label: "Excerpt (ES)", type: "textarea" },
  { name: "content", label: "Content (EN, Markdown)", type: "textarea" },
  { name: "content_es", label: "Content (ES, Markdown)", type: "textarea" },
  { name: "cover_image", label: "Cover image URL" },
  { name: "author", label: "Author" },
  { name: "tags", label: "Tags (comma-separated)", type: "tags" },
  { name: "published", label: "Published", type: "boolean" },
];

const EMPTY: Partial<Row> = {
  slug: "",
  title: "",
  title_es: "",
  excerpt: "",
  excerpt_es: "",
  content: "",
  content_es: "",
  cover_image: "",
  author: "",
  tags: [],
  published: false,
};

function AdminBlog() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const query = useQuery({
    queryKey: ["admin", "blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: Partial<Row>) => {
      const { id, ...rest } = values;
      const payload = {
        ...rest,
        published_at:
          rest.published && !rest.published_at
            ? new Date().toISOString()
            : rest.published_at ?? null,
      };
      if (id) {
        const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert(payload as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "blog"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">{t("admin.blog.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.blog.subtitle")}</p>
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
                /{r.slug} · {r.published ? "published" : "draft"} ·{" "}
                {r.tags?.join(", ") || "no tags"}
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
