import { getSanitaryOperatorStatsByMonth } from '@/app/_lib/data/estadisticas';
import { months } from '@/app/_lib/static-data';
import { SANITARY_METRICS } from '@/app/_lib/static-data/reportes';
import YearFilter from '@/app/ui/admin/dashboard/YearFilter';

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
          <h3 className="text-xl font-bold text-gray-900">
            Detalle Mensual {year}
          </h3>
        </div>
        <YearFilter defaultYear={defaultYear} />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-y border-gray-200/80 bg-gray-50/60">
            <tr className="grid grid-cols-28 items-center gap-4 px-8 text-xs text-gray-500">
              <th className="col-span-4 px-4 py-3 text-left font-normal">
                Indicador
              </th>
              {months.map((month) => (
                <th
                  key={month}
                  className="col-span-2 px-4 py-3 text-right font-normal"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {SANITARY_METRICS.map((metric) => (
              <tr
                key={metric.key}
                className="grid grid-cols-28 gap-4 px-8 py-1 text-[13px] transition-colors hover:bg-gray-50/70"
              >
                <td className="col-span-4 px-4 py-3 text-left font-medium whitespace-nowrap text-slate-900">
                  {metric.shortLabel}
                </td>
                {months.map((_, index) => (
                  <td
                    key={index}
                    className={`col-span-2 px-4 py-3 text-right tabular-nums ${byMonth.get(index + 1)?.[metric.key] ? `text-gray-600` : 'text-slate-400/60'}`}
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
