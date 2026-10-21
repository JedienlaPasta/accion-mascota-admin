import { getSanitaryOperatorStatsByMonth } from '@/app/_lib/data/estadisticas';
import { months } from '@/app/_lib/static-data';
import { SANITARY_METRICS } from '@/app/_lib/static-data/reportes';
import YearFilter from '@/app/ui/admin/dashboard/YearFilter';
import { CalendarRange } from 'lucide-react';

type MonthlyStatsTableProps = {
  year: string;
  defaultYear: string;
};

export default async function MonthlyStatsTable({
  year,
  defaultYear,
}: MonthlyStatsTableProps) {
  const rows = await getSanitaryOperatorStatsByMonth(year);
  const byMonth = new Map(rows.map((row) => [row.mes, row]));

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-4 px-8 pt-8 pb-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
            <CalendarRange className="size-5" />
          </span>
          <h3 className="text-xl font-bold text-gray-900">
            Detalle Mensual {year}
          </h3>
        </div>
        <YearFilter defaultYear={defaultYear} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-y border-gray-200/80 bg-gray-50/60">
            <tr className="text-xs text-gray-500">
              <th className="px-6 py-3 text-left font-normal">Indicador</th>
              {months.map((month) => (
                <th key={month} className="px-3 py-3 text-center font-normal">
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SANITARY_METRICS.map((metric) => (
              <tr
                key={metric.key}
                className="text-sm transition-colors hover:bg-gray-50/70"
              >
                <td className="px-6 py-3 font-medium whitespace-nowrap text-slate-700">
                  {metric.shortLabel}
                </td>
                {months.map((_, index) => (
                  <td
                    key={index}
                    className="px-3 py-3 text-center text-slate-600 tabular-nums"
                  >
                    {(byMonth.get(index + 1)?.[metric.key] ?? 0).toLocaleString(
                      'es-CL'
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
