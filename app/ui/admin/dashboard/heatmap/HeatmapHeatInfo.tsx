export default function HeatInfo() {
  return (
    <div className="flex w-fit flex-nowrap justify-end gap-1 self-start rounded-lg border border-slate-200 px-2 py-1">
      <p className="text-xs text-slate-400">Poco</p>
      <div className="group relative flex h-4 w-4 items-center justify-center rounded border border-slate-300/40 bg-slate-100"></div>
      <div className="group relative flex h-4 w-4 items-center justify-center rounded border border-teal-200/70 bg-teal-100"></div>
      <div className="group relative flex h-4 w-4 items-center justify-center rounded border border-teal-300/70 bg-teal-200"></div>
      <div className="group relative flex h-4 w-4 items-center justify-center rounded border border-teal-400/50 bg-teal-300"></div>
      <div className="group relative flex h-4 w-4 items-center justify-center rounded border border-teal-500/50 bg-teal-400"></div>
      <div className="group relative flex h-4 w-4 items-center justify-center rounded border border-teal-600/50 bg-teal-500"></div>
      <p className="text-xs text-slate-400">Mucho</p>
    </div>
  );
}
