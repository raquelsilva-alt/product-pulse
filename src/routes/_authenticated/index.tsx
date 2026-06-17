import { createFileRoute, useNavigate as useNav } from "@tanstack/react-router";
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import { parseStateParam, type DataState } from "@/components/states";
import { dashboardQueryOptions } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: parseStateParam(s.state),
  }),
  head: () => ({
    meta: [
      { title: "Measure it · AI Operations Platform — Product Health Dashboard" },
      {
        name: "description",
        content:
          "Measure it · AI Operations Platform — Product Health Dashboard. Traffic, pipeline, use cases, roadmap and Q3 2026 forecast in one view.",
      },
    ],
  }),
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(dashboardQueryOptions());
  },
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-red-600">Error: {String(error)}</div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-sm text-neutral-600">Not found.</div>
  ),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { state } = Route.useSearch();
  const navigate = Route.useNavigate();
  const topNav = useNav();
  const queryClient = useQueryClient();
  const ctx = Route.useRouteContext() as { user?: { email?: string | null } };
  const userEmail = ctx.user?.email ?? "";
  const onRetry = () => navigate({ search: { state: "ready" as DataState } });
  const onSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    topNav({ to: "/auth", replace: true });
  };
  return (
    <DashboardScreen
      state={state}
      onRetry={onRetry}
      userEmail={userEmail}
      onSignOut={onSignOut}
    />
  );
}
