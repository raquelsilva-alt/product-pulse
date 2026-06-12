import type { Status } from "@/data/useCases";

export function StatusBadge({ status }: { status: Status }) {
  const styles: Record<Status, string> = {
    Live: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Beta: "bg-amber-50 text-amber-700 border-amber-200",
    Pilot: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${styles[status]}`}
    >
      {status}
    </span>
  );
}
