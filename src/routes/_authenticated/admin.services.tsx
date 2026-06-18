import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ResourceEditor, type FieldDef } from "@/components/admin/resource-editor";

export const Route = createFileRoute("/_authenticated/admin/services")({
  component: AdminServices,
});

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  name_es: string | null;
  description: string | null;
  description_es: string | null;
  price_eur: number | null;
  features: unknown;
  features_es: unknown;
  active: boolean;
  sort_order: number;
};

const FIELDS: FieldDef[] = [
  { name: "slug", label: "Slug" },
  { name: "name", label: "Name (EN)" },
  { name: "name_es", label: "Name (ES)" },
  { name: "description", label: "Description (EN)", type: "textarea" },
  { name: "description_es", label: "Description (ES)", type: "textarea" },
  { name: "price_eur", label: "Price (EUR)", type: "number" },
  { name: "features", label: "Features (EN) — JSON array", type: "json" },
  { name: "features_es", label: "Features (ES) — JSON array", type: "json" },
  { name: "sort_order", label: "Sort order", type: "number" },
  { name: "active", label: "Active", type: "boolean" },
];

const EMPTY: Partial<ServiceRow> = {
  slug: "",
  name: "",
  name_es: "",
  description: "",
  description_es: "",
  price_eur: null,
  features: [],
  features_es: [],
  active: true,
  sort_order: 0,
};

function AdminServices() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<ServiceRow> | null>(null);

  const query = useQuery({
    queryKey: ["admin", "services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ServiceRow[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: Partial<ServiceRow>) => {
      const { id, ...rest } = values;
      if (id) {
        const { error } = await supabase.from("services").update(rest as never).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("services").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "services"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "services"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">{t("admin.services.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.services.subtitle")}</p>
        </div>
        <Button onClick={() => setEditing(EMPTY)}>{t("admin.new")}</Button>
      </div>

      <div className="mt-6 space-y-2">
        {(query.data ?? []).map((s) => (
          <div
            key={s.id}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3"
          >
            <div>
              <div className="font-medium">
                {s.name}{" "}
                <span className="ml-2 text-xs text-muted-foreground">/{s.slug}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {s.active ? "active" : "inactive"} · €{s.price_eur ?? "—"} · order{" "}
                {s.sort_order}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditing(s)}>
                {t("admin.edit")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => confirm(t("admin.confirmDelete") ?? "Delete?") && remove.mutate(s.id)}
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
