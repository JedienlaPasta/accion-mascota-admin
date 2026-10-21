import { SanitaryOperatorYearRow } from '@/app/_lib/data/estadisticas';
import { SANITARY_METRICS } from '@/app/_lib/static-data/reportes';
import { BarChart3 } from 'lucide-react';

export default function YearlyStatsTable({
  rows,
}: {
  rows: SanitaryOperatorYearRow[];
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 px-8 pt-8 pb-4">
        <span className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
          <BarChart3 className="size-5" />
        </span>
        <h3 className="text-xl font-bold text-gray-900">
          Operativos Sanitarios por Año
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-y border-gray-200/80 bg-gray-50/60">
            <tr className="text-xs text-gray-500">
              <th className="px-6 py-3 text-left font-normal">Año</th>
              {SANITARY_METRICS.map((metric) => (
                <th
                  key={metric.key}
                  className="px-4 py-3 text-center font-normal"
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
                  className="text-sm transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-6 py-3 font-semibold text-slate-700 tabular-nums">
                    {row.anio}
                  </td>
                  {SANITARY_METRICS.map((metric) => (
                    <td
                      key={metric.key}
                      className="px-4 py-3 text-center text-slate-600 tabular-nums"
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
