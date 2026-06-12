import { createFileRoute } from "@tanstack/react-router";
import { DashboardScreen } from "@/screens/dashboard/DashboardScreen";
import { parseStateParam, type DataState } from "@/components/states";

export const Route = createFileRoute("/")({
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
  component: DashboardRoute,
});

function DashboardRoute() {
  const { state } = Route.useSearch();
  const navigate = Route.useNavigate();
  const onRetry = () => navigate({ search: { state: "ready" as DataState } });
  return <DashboardScreen state={state} onRetry={onRetry} />;
}
