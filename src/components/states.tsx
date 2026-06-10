// Shared loading / empty / error primitives.
// Design rule: reuse existing tokens only (neutral, sky, emerald, amber).
// Never replaces the surrounding component — these render *in place of data*.

import { Link } from "@tanstack/react-router";

export type DataState = "ready" | "loading" | "empty" | "error";

// ---------- Skeletons ----------

export function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-pulse rounded bg-neutral-200/80 align-middle ${className}`}
    />
  );
}

export function ChartSkeleton({ height = 320 }: { height?: number }) {
  // Pulsing grey bars approximating a chart canvas.
  const bars = [55, 70, 45, 80, 60, 90, 72, 85, 65, 78, 88, 95];
  return (
    <div
      className="flex w-full items-end gap-2 px-2"
      style={{ height }}
      role="status"
      aria-label="Loading chart"
    >
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-sm bg-neutral-200/80"
          style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
        />
      ))}
    </div>
  );
}

export function BarChartSkeleton({ height = 230, rows = 5 }: { height?: number; rows?: number }) {
  return (
    <div
      className="flex w-full flex-col justify-center gap-3 px-2"
      style={{ height }}
      role="status"
      aria-label="Loading chart"
    >
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-3 w-20 animate-pulse rounded bg-neutral-200/80" />
          <div
            className="h-4 animate-pulse rounded-sm bg-neutral-200/80"
            style={{ width: `${85 - i * 12}%`, animationDelay: `${i * 80}ms` }}
          />
        </div>
      ))}
    </div>
  );
}

// ---------- Empty / Error messages ----------

export function EmptyMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 py-10 text-center text-sm text-neutral-500">
      {children}
    </div>
  );
}

export function ErrorMessage({
  children,
  onRetry,
}: {
  children: React.ReactNode;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 px-6 py-10 text-center text-sm text-neutral-600">
      <p>{children}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="text-xs font-medium text-sky-600 hover:text-sky-700"
        >
          Retry →
        </button>
      )}
    </div>
  );
}

// Amber inline cached-data badge for KPI cards.
export function CachedBadge({ onRetry, date = "Jun 3" }: { onRetry?: () => void; date?: string }) {
  return (
    <span className="mt-2 inline-flex items-center gap-1 rounded-sm border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
      Showing cached data · {date} ·{" "}
      <button
        type="button"
        onClick={onRetry}
        className="font-semibold underline-offset-2 hover:underline"
      >
        Retry →
      </button>
    </span>
  );
}

// Green checkmark "all clear" used by alerts panel.
export function AllClear({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-800">
      <svg
        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M16.7 5.3a1 1 0 010 1.4l-7 7a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L9 11.6l6.3-6.3a1 1 0 011.4 0z"
          clipRule="evenodd"
        />
      </svg>
      <span>{children}</span>
    </div>
  );
}

// Helper: derive state from a `?state=` search param for demoing.
export function parseStateParam(v: unknown): DataState {
  return v === "loading" || v === "empty" || v === "error" ? v : "ready";
}

// Small inline state-toggle for demo / QA.
export function StateToggle({
  basePath,
  current,
}: {
  basePath: "/" | "/use-case/$slug";
  current: DataState;
}) {
  const states: DataState[] = ["ready", "loading", "empty", "error"];
  return (
    <div className="flex items-center gap-1 text-[10px]">
      <span className="text-neutral-400 uppercase tracking-wider">State:</span>
      {states.map((s) => (
        <Link
          key={s}
          to={basePath}
          search={(prev: Record<string, unknown>) => ({
            ...prev,
            state: s === "ready" ? undefined : s,
          })}
          params={true as never}
          className={`rounded px-1.5 py-0.5 font-medium uppercase tracking-wider transition-colors ${
            current === s
              ? "bg-neutral-900 text-white"
              : "border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-100"
          }`}
        >
          {s}
        </Link>
      ))}
    </div>
  );
}
