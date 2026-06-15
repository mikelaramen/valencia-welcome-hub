import { useMatches } from "@tanstack/react-router";

import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";

/**
 * Wraps public pages with the marketing nav + footer.
 * Hides chrome on authenticated routes (under /_authenticated) and on /assessment.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  const matches = useMatches();
  const path = matches[matches.length - 1]?.pathname ?? "/";

  const hideChrome =
    path.startsWith("/dashboard") ||
    path.startsWith("/admin") ||
    path.startsWith("/auth") ||
    path.startsWith("/reset-password") ||
    path.startsWith("/assessment");

  if (hideChrome) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
