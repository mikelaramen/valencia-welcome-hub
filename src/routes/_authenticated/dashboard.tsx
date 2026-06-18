import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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

type RoadmapStep = {
  id: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
  sort_order: number;
};

type Recommendation = {
  id: string;
  category: string;
  title: string;
  description: string | null;
};

function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);

  const stepsQuery = useQuery({
    queryKey: ["roadmap_steps"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_steps")
        .select("id,category,title,description,status,sort_order")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as RoadmapStep[];
    },
  });

  const recsQuery = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recommendations")
        .select("id,category,title,description")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Recommendation[];
    },
  });

  async function toggleStep(step: RoadmapStep) {
    const nextStatus =
      step.status === "todo" ? "in_progress" : step.status === "in_progress" ? "done" : "todo";
    const { error } = await supabase
      .from("roadmap_steps")
      .update({ status: nextStatus })
      .eq("id", step.id);
    if (!error) queryClient.invalidateQueries({ queryKey: ["roadmap_steps"] });
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const steps = stepsQuery.data ?? [];
  const recommendations = recsQuery.data ?? [];
  const done = steps.filter((s) => s.status === "done").length;
  const progress = steps.length ? Math.round((done / steps.length) * 100) : 0;
  const hasPlan = steps.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="font-serif text-xl font-medium">
            SettleIn<span className="text-terracotta">Valencia</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
            <Link to="/admin" className="text-sm underline-offset-4 hover:underline">
              Admin
            </Link>
            <Button variant="outline" size="sm" onClick={signOut}>
              {t("auth.signOut")}
            </Button>
          </div>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-medium tracking-tight">
              {t("dashboard.welcome")}
            </h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">{t("dashboard.intro")}</p>
          </div>
          {hasPlan ? (
            <Link
              to="/assessment"
              className="text-sm font-medium text-terracotta hover:underline"
            >
              {t("dashboard.regenerate")}
            </Link>
          ) : null}
        </div>

        {!hasPlan && !stepsQuery.isLoading ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-10 text-center">
            <h2 className="font-serif text-2xl">{t("dashboard.noPlanTitle")}</h2>
            <p className="mt-2 text-muted-foreground">{t("dashboard.noPlanBody")}</p>
            <Link
              to="/assessment"
              className="mt-6 inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background"
            >
              {t("dashboard.startAssessment")}
            </Link>
          </div>
        ) : null}

        {hasPlan ? (
          <>
            <div className="mt-8 rounded-2xl border border-border bg-card p-6">
              <div className="flex items-baseline justify-between">
                <h2 className="font-serif text-xl">{t("dashboard.progressTitle")}</h2>
                <span className="text-sm text-muted-foreground">
                  {done} / {steps.length} · {progress}%
                </span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-terracotta transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="mt-10 grid gap-10 lg:grid-cols-3">
              <section className="lg:col-span-2">
                <h2 className="font-serif text-2xl">{t("dashboard.roadmapTitle")}</h2>
                <ol className="mt-6 space-y-3">
                  {steps.map((s, idx) => (
                    <li
                      key={s.id}
                      className="rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => toggleStep(s)}
                          className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                            s.status === "done"
                              ? "border-terracotta bg-terracotta text-background"
                              : s.status === "in_progress"
                                ? "border-terracotta text-terracotta"
                                : "border-border text-muted-foreground"
                          }`}
                          aria-label={t("dashboard.toggleStatus") ?? "Toggle status"}
                        >
                          {s.status === "done" ? "✓" : idx + 1}
                        </button>
                        <div className="flex-1">
                          <div className="text-xs uppercase tracking-wider text-muted-foreground">
                            {s.category}
                          </div>
                          <div className="mt-0.5 font-medium text-foreground">{s.title}</div>
                          {s.description ? (
                            <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                              {s.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>

              <aside>
                <h2 className="font-serif text-2xl">{t("dashboard.recommendationsTitle")}</h2>
                <div className="mt-6 space-y-3">
                  {recommendations.map((r) => (
                    <div key={r.id} className="rounded-xl border border-border bg-card p-5">
                      <div className="text-xs uppercase tracking-wider text-terracotta">
                        {r.category}
                      </div>
                      <div className="mt-1 font-medium">{r.title}</div>
                      {r.description ? (
                        <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                      ) : null}
                    </div>
                  ))}
                  {recommendations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("dashboard.noRecs")}</p>
                  ) : null}
                </div>
                <p className="mt-6 text-xs text-muted-foreground">{t("dashboard.disclaimer")}</p>
              </aside>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
