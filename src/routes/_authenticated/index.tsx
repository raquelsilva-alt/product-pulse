import { createFileRoute, useNavigate as useNav } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import {
  formatCachedAt,
  parseStateParam,
  type DataState,
} from "@/components/states";
import { dashboardQueryOptions } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";

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
      { property: "og:title", content: "Measure it · AI Operations Platform — Product Health Dashboard" },
      { property: "og:description", content: "Measure it · AI Operations Platform — Product Health Dashboard. Traffic, pipeline, use cases, roadmap and Q3 2026 forecast in one view." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  // Prime the cache without awaiting so the component can render its own
  // loading state via useQuery's pending flag.
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(dashboardQueryOptions());
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
  const { state: urlState } = Route.useSearch();
  const topNav = useNav();
  const queryClient = useQueryClient();
  const ctx = Route.useRouteContext() as { user?: { email?: string | null } };
  const userEmail = ctx.user?.email ?? "";

  const query = useQuery(dashboardQueryOptions());

  const realState: DataState = query.isPending
    ? "loading"
    : query.isError
      ? "error"
      : !query.data || query.data.kpis.length === 0
        ? "empty"
        : "ready";

  // Dev-only override: any ?state= value takes precedence in dev builds.
  const state: DataState =
    import.meta.env.DEV && urlState ? urlState : realState;

  const cachedAt = formatCachedAt(query.dataUpdatedAt);

  const onRetry = () => {
    void query.refetch();
  };

  const onSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    topNav({ to: "/auth", replace: true });
  };

  return (
    <DashboardScreen
      state={state}
      urlState={urlState}
      data={query.data}
      cachedAt={cachedAt}
      onRetry={onRetry}
      userEmail={userEmail}
      onSignOut={onSignOut}
    />
  );
}
