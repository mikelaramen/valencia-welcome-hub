import { Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NAV: Array<{ to: string; key: string }> = [
  { to: "/admin", key: "overview" },
  { to: "/admin/consultations", key: "consultations" },
  { to: "/admin/services", key: "services" },
  { to: "/admin/knowledge", key: "knowledge" },
  { to: "/admin/partners", key: "partners" },
  { to: "/admin/blog", key: "blog" },
  { to: "/admin/users", key: "users" },
];

export function AdminShell() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [state, setState] = useState<"loading" | "admin" | "claimable" | "denied">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes.user;
      setEmail(user?.email ?? null);
      if (!user) {
        navigate({ to: "/auth", replace: true });
        return;
      }
      const { data: isAdmin } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (isAdmin) {
        setState("admin");
        return;
      }
      const { count } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      setState(count === 0 ? "claimable" : "denied");
    })();
  }, [navigate]);

  async function claimAdmin() {
    const { data, error } = await supabase.rpc("claim_admin_if_unclaimed");
    if (!error && data) setState("admin");
    else setState("denied");
  }

  if (state === "loading") {
    return <div className="p-12 text-center text-muted-foreground">{t("admin.loading")}</div>;
  }

  if (state === "claimable") {
    return (
      <div className="mx-auto max-w-md p-12 text-center">
        <h1 className="font-serif text-3xl">{t("admin.claimTitle")}</h1>
        <p className="mt-3 text-muted-foreground">{t("admin.claimBody")}</p>
        <Button className="mt-6" onClick={claimAdmin}>
          {t("admin.claimAction")}
        </Button>
      </div>
    );
  }

  if (state === "denied") {
    return (
      <div className="mx-auto max-w-md p-12 text-center">
        <h1 className="font-serif text-3xl">{t("admin.deniedTitle")}</h1>
        <p className="mt-3 text-muted-foreground">{t("admin.deniedBody")}</p>
        <Link to="/dashboard" className="mt-6 inline-block text-sm underline">
          {t("admin.backToDashboard")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/admin" className="font-serif text-xl font-medium">
            SettleIn<span className="text-terracotta">Valencia</span>
            <span className="ml-3 rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background">
              {t("admin.badge")}
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
            <Link to="/dashboard" className="text-sm underline-offset-4 hover:underline">
              {t("admin.viewApp")}
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-8 px-6 py-8">
        <aside className="w-56 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="rounded-md px-3 py-2 text-sm text-foreground/70 hover:bg-muted hover:text-foreground"
                activeOptions={{ exact: n.to === "/admin" }}
                activeProps={{ className: "bg-muted font-medium text-foreground" }}
              >
                {t(`admin.nav.${n.key}`)}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
