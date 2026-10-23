import { ReportStatsYearRow } from '@/app/_lib/data/estadisticas';
import { StatMetric } from '@/app/_lib/static-data/reportes';

export default function YearlyStatsTable({
  rows,
  columns,
  title = 'Estadísticas por Año',
}: {
  rows: ReportStatsYearRow[];
  columns: StatMetric[];
  title?: string;
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 px-8 pt-8 pb-4">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-y border-gray-200/80 bg-gray-50/60">
            <tr
              className="grid items-center gap-4 px-8 text-xs text-gray-500"
              style={{
                gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))`,
              }}
            >
              <th className="px-4 py-3 text-left font-normal">Año</th>
              {columns.map((metric) => (
                <th
                  key={metric.key}
                  className="px-4 py-3 text-right font-normal"
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
                  className="grid gap-4 px-8 py-1 text-[13px] transition-[background-color] hover:bg-gray-50/70"
                  style={{
                    gridTemplateColumns: `repeat(${columns.length + 1}, minmax(0, 1fr))`,
                  }}
                >
                  <td className="px-4 py-3 text-left font-medium text-slate-900 tabular-nums">
                    {row.anio}
                  </td>
                  {columns.map((metric) => (
                    <td
                      key={metric.key}
                      className={`px-4 py-3 text-right tabular-nums ${row[metric.key] ? `text-gray-600` : 'text-slate-400/60'}`}
                    >
                      {row[metric.key].toLocaleString('es-CL')}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + 1}
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
