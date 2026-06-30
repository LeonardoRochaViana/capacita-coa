import { LucideIcon, ArrowUpRight } from "lucide-react";

export function MetricCard({ label, value, detail, icon: Icon, tone = "green" }: { label:string; value:string; detail?:string; icon:LucideIcon; tone?: "green"|"neutral"|"amber"|"red" }) {
  const tones = { green:"bg-emerald-50 text-sprout", neutral:"bg-slate-100 text-slate-700", amber:"bg-amber-50 text-amber-700", red:"bg-red-50 text-red-700" };
  return <div className="card group p-4 transition hover:-translate-y-0.5 hover:border-leaf/40">
    <div className="flex items-start justify-between"><span className={`rounded-xl p-2.5 ${tones[tone]}`}><Icon size={19}/></span><ArrowUpRight size={16} className="text-gray-300 transition group-hover:text-leaf"/></div>
    <div className="mt-4 text-2xl font-bold tracking-tight">{value}</div>
    <div className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-300">{label}</div>
    {detail && <div className="mt-2 text-[11px] text-gray-400 dark:text-gray-400">{detail}</div>}
  </div>;
}
