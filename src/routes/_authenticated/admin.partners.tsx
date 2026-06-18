import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ResourceEditor, type FieldDef } from "@/components/admin/resource-editor";

export const Route = createFileRoute("/_authenticated/admin/partners")({
  component: AdminPartners,
});

type Row = {
  id: string;
  name: string;
  category: string;
  description: string | null;
  description_es: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  website: string | null;
  notes: string | null;
  active: boolean;
};

const FIELDS: FieldDef[] = [
  { name: "name", label: "Name" },
  { name: "category", label: "Category", placeholder: "lawyer, gestor, realtor…" },
  { name: "description", label: "Description (EN)", type: "textarea" },
  { name: "description_es", label: "Description (ES)", type: "textarea" },
  { name: "contact_email", label: "Email" },
  { name: "contact_phone", label: "Phone" },
  { name: "website", label: "Website" },
  { name: "notes", label: "Internal notes", type: "textarea" },
  { name: "active", label: "Active", type: "boolean" },
];

const EMPTY: Partial<Row> = {
  name: "",
  category: "",
  description: "",
  description_es: "",
  contact_email: "",
  contact_phone: "",
  website: "",
  notes: "",
  active: true,
};

function AdminPartners() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const query = useQuery({
    queryKey: ["admin", "partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("category", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Row[];
    },
  });

  const upsert = useMutation({
    mutationFn: async (values: Partial<Row>) => {
      const { id, ...rest } = values;
      if (id) {
        const { error } = await supabase.from("partners").update(rest).eq("id", id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("partners").insert(rest as never);
        if (error) throw error;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "partners"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "partners"] }),
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl">{t("admin.partners.title")}</h1>
          <p className="mt-2 text-muted-foreground">{t("admin.partners.subtitle")}</p>
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
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-muted-foreground">
                {r.category} · {r.contact_email ?? "—"} · {r.active ? "active" : "inactive"}
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
