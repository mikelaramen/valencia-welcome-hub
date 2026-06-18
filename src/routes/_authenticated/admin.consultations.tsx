import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin/consultations")({
  component: AdminConsultations,
});

const STATUSES = ["new", "contacted", "scheduled", "done", "closed"] as const;

function AdminConsultations() {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin", "consultations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("consultations")
        .select("id,name,email,phone,message,status,source,service_id,created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("consultations").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "consultations"] }),
  });

  const rows = query.data ?? [];

  return (
    <div>
      <h1 className="font-serif text-3xl">{t("admin.consult.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("admin.consult.subtitle")}</p>
      <div className="mt-6 space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="rounded-xl border border-border bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="font-medium">{r.name}</div>
                <div className="text-sm text-muted-foreground">{r.email}</div>
                {r.phone ? (
                  <div className="text-sm text-muted-foreground">{r.phone}</div>
                ) : null}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {new Date(r.created_at).toLocaleString()}
                </span>
                <Select
                  value={r.status}
                  onValueChange={(v) => updateStatus.mutate({ id: r.id, status: v })}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {r.message ? (
              <p className="mt-3 whitespace-pre-line text-sm text-foreground/80">{r.message}</p>
            ) : null}
            {r.source ? (
              <div className="mt-2 text-xs text-muted-foreground">source: {r.source}</div>
            ) : null}
          </div>
        ))}
        {rows.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            {t("admin.consult.empty")}
          </div>
        ) : null}
      </div>
    </div>
  );
}
