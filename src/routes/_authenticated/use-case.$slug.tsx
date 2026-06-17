import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { parseStateParam, type DataState } from "@/components/states";
import { UseCaseDetailScreen } from "@/screens/use-case/UseCaseDetailScreen";
import { useCasesQueryOptions, slugify } from "@/lib/queries";

export const Route = createFileRoute("/_authenticated/use-case/$slug")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: parseStateParam(s.state),
  }),
  head: ({ params }) => ({
    meta: [{ title: `Use case · ${params.slug} — Product Health Dashboard` }],
  }),
  // Prefetch without awaiting so the component owns its loading state.
  loader: ({ context }) => {
    context.queryClient.prefetchQuery(useCasesQueryOptions());
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
  const { state: urlState } = Route.useSearch();
  const params = Route.useParams();
  const query = useQuery(useCasesQueryOptions());

  const uc = query.data?.find((u) => slugify(u.name) === params.slug);

  // Only treat as not-found once the query resolves successfully but the slug
  // isn't present in the data. While loading or on error, render the screen
  // in its loading/error state instead of throwing.
  if (query.isSuccess && query.data && query.data.length > 0 && !uc) {
    throw notFound();
  }

  const realState: DataState = query.isPending
    ? "loading"
    : query.isError
      ? "error"
      : !uc
        ? "empty"
        : "ready";

  const state: DataState =
    import.meta.env.DEV && urlState ? urlState : realState;

  const onRetry = () => {
    void query.refetch();
  };

  return (
    <UseCaseDetailScreen
      slug={params.slug}
      state={state}
      urlState={urlState}
      uc={uc}
      onRetry={onRetry}
    />
  );
}
