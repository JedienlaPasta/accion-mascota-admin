import { SanitaryOperatorYearRow } from '@/app/_lib/data/estadisticas';
import { SANITARY_METRICS } from '@/app/_lib/static-data/reportes';

export default function YearlyStatsTable({
  rows,
}: {
  rows: SanitaryOperatorYearRow[];
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 px-8 pt-8 pb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Operativos Sanitarios por Año
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-y border-gray-200/80 bg-gray-50/60">
            <tr className="grid grid-cols-20 items-center gap-4 px-8 text-xs text-gray-500">
              <th className="col-span-2 px-4 py-3 text-left font-normal">
                Año
              </th>
              {SANITARY_METRICS.map((metric) => (
                <th
                  key={metric.key}
                  className="col-span-2 px-4 py-3 text-right font-normal"
                >
                  {metric.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length > 0 ? (
              rows.map((row) => (
                <tr
                  key={row.anio}
                  className="grid grid-cols-20 gap-4 px-8 py-1 text-[13px] transition-colors hover:bg-gray-50/70"
                >
                  <td className="col-span-2 px-4 py-3 text-left font-medium text-slate-900 tabular-nums">
                    {row.anio}
                  </td>
                  {SANITARY_METRICS.map((metric) => (
                    <td
                      key={metric.key}
                      className={`col-span-2 px-4 py-3 text-right tabular-nums ${row[metric.key] ? `text-gray-600` : 'text-slate-400/60'}`}
                    >
                      {row[metric.key].toLocaleString('es-CL')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={SANITARY_METRICS.length + 1}
                  className="px-6 py-16 text-center text-sm text-gray-400"
                >
                  No hay datos de operativos sanitarios registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
