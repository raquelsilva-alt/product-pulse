import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { parseStateParam, type DataState } from "@/components/states";
import { UseCaseDetailScreen } from "@/screens/use-case/UseCaseDetailScreen";
import { useCasesQueryOptions, slugify } from "@/lib/queries";

export const Route = createFileRoute("/use-case/$slug")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: parseStateParam(s.state),
  }),
  head: ({ params }) => ({
    meta: [{ title: `Use case · ${params.slug} — Product Health Dashboard` }],
  }),
  loader: async ({ context, params }) => {
    const list = await context.queryClient.ensureQueryData(useCasesQueryOptions());
    const uc = list.find((u) => slugify(u.name) === params.slug);
    if (!uc) throw notFound();
  },
  notFoundComponent: () => (
    <div className="p-10 text-sm text-neutral-600">
      Use case not found.{" "}
      <Link to="/" className="text-sky-600 underline">
        Back to dashboard
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-sm text-red-600">Error: {String(error)}</div>
  ),
  component: UseCaseDetailRoute,
});

function UseCaseDetailRoute() {
  const { state } = Route.useSearch();
  const params = Route.useParams();
  const navigate = Route.useNavigate();
  const onRetry = () =>
    navigate({ search: { state: "ready" as DataState }, params });
  return <UseCaseDetailScreen slug={params.slug} state={state} onRetry={onRetry} />;
}
