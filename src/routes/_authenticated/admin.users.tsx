import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/users")({
  component: AdminUsers,
});

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  nationality: string | null;
  language: string;
  created_at: string;
};

function AdminUsers() {
  const { t } = useTranslation();

  const query = useQuery({
    queryKey: ["admin", "profiles"],
    queryFn: async () => {
      const [profilesRes, rolesRes] = await Promise.all([
        supabase
          .from("profiles")
          .select("id,full_name,email,nationality,language,created_at")
          .order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id,role"),
      ]);
      if (profilesRes.error) throw profilesRes.error;
      const roleMap = new Map<string, string[]>();
      (rolesRes.data ?? []).forEach((r) => {
        const arr = roleMap.get(r.user_id) ?? [];
        arr.push(r.role);
        roleMap.set(r.user_id, arr);
      });
      return ((profilesRes.data ?? []) as ProfileRow[]).map((p) => ({
        ...p,
        roles: roleMap.get(p.id) ?? [],
      }));
    },
  });

  const rows = query.data ?? [];

  return (
    <div>
      <h1 className="font-serif text-3xl">{t("admin.users.title")}</h1>
      <p className="mt-2 text-muted-foreground">{t("admin.users.subtitle")}</p>
      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3">{t("admin.users.name")}</th>
              <th className="px-4 py-3">{t("admin.users.email")}</th>
              <th className="px-4 py-3">{t("admin.users.country")}</th>
              <th className="px-4 py-3">{t("admin.users.lang")}</th>
              <th className="px-4 py-3">{t("admin.users.roles")}</th>
              <th className="px-4 py-3">{t("admin.users.joined")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="px-4 py-3">{p.full_name ?? "—"}</td>
                <td className="px-4 py-3">{p.email ?? "—"}</td>
                <td className="px-4 py-3">{p.nationality ?? "—"}</td>
                <td className="px-4 py-3 uppercase">{p.language}</td>
                <td className="px-4 py-3">{p.roles.join(", ") || "user"}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(p.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {t("admin.users.empty")}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
