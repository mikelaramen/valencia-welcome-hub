import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — SettleInValencia" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="font-serif text-xl font-medium">
            SettleIn<span className="text-terracotta">Valencia</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              {t("auth.signOut")}
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="font-serif text-4xl font-medium tracking-tight">
          {t("dashboard.welcome")}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">{t("dashboard.intro")}</p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">{t("dashboard.assessmentTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("dashboard.assessmentBody")}
            </p>
            <p className="mt-4 text-xs uppercase tracking-wider text-terracotta">
              {t("dashboard.comingSoon")}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl">{t("dashboard.roadmapTitle")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("dashboard.roadmapBody")}</p>
            <p className="mt-4 text-xs uppercase tracking-wider text-terracotta">
              {t("dashboard.comingSoon")}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
