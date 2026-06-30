import { cx } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const tone = status === "Concluído" || status === "Ativo" || status === "Em dia"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
    : status === "Atenção" || status === "Vencido"
      ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800"
      : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800";
  return <span className={cx("inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold", tone)}>{status}</span>;
}
