export function PageHeader({ eyebrow, title, description, action }: { eyebrow?:string; title:string; description:string; action?:React.ReactNode }) {
  return <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
    <div><p className="eyebrow mb-2">{eyebrow || "Capacita COA"}</p><h1 className="text-2xl font-bold tracking-tight text-ink dark:text-gray-100 sm:text-3xl">{title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-300">{description}</p></div>
    {action}
  </div>;
}
