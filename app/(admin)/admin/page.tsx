import {
  adminOperationalLogs,
  campanas,
  mascotasAdopcion,
} from '@/app/_lib/mock-data';
import TableWrapper from '@/app/ui/admin/TableWrapper';
import { FilterSelect } from '@/app/ui/admin/dashboard/FilterSelect';
import SummaryCard from '@/app/ui/admin/dashboard/SummaryCard';
import AppointmentTable from '@/app/ui/admin/dashboard/TodayAppointments';
import { SecondaryButton } from '@/app/ui/components/Button';
import { Download, ListFilter } from 'lucide-react';

const parseISODate = (value: string) => new Date(`${value}T00:00:00`);

const isSameMonth = (value: Date, ref: Date) =>
  value.getFullYear() === ref.getFullYear() &&
  value.getMonth() === ref.getMonth();

const startDate = { year: 2026 };
const currentYear = new Date().getFullYear();
const yearOptions = Array.from(
  { length: currentYear - startDate.year + 1 },
  (_, i) => ({
    value: String(currentYear - i),
    label: String(currentYear - i),
  })
);

export default function PortalAdmin() {
  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Tabla de resumen
          </h2>
          <p className="text-muted-foreground text-sm">
            Selecciona una opcion para ver los datos
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterSelect options={yearOptions} className="rounded-lg border" />

          <SecondaryButton className="gap-2 bg-white px-4 text-sm">
            <ListFilter className="h-4 w-4" />
            Filtrar
          </SecondaryButton>

          <SecondaryButton className="gap-2 bg-white px-4 text-sm">
            <Download className="h-4 w-4" />
            Exportar
          </SecondaryButton>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        {/* <SummaryCards /> */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Citas (total)" value={8} icon="calendar" />
          <SummaryCard title="Mascotas registradas" value={7} icon="paw" />
          <SummaryCard title="Propietarios" value={7} icon="user" />
          <SummaryCard title={`Atenciones (mes)`} value={6} icon="month" />

          <SummaryCard title="Mascotas atendidas (mes)" value={3} icon="paw" />
          <SummaryCard title="Operativos (mes)" value={2} icon="calendar" />
          <SummaryCard
            title="Sectores visitados (mes)"
            value={4}
            icon="mapPin"
          />
          <SummaryCard
            title="Mascotas rescatadas (mes)"
            value={1}
            icon="report"
          />
        </div>

        {/* Appointments Table */}
        <TableWrapper title="Horario de Hoy">
          <AppointmentTable />
        </TableWrapper>

        {/* Dashboard Metrics & Data */}
        <div className="flex gap-4">
          <AttentionBoard />
          <AppointmentsBoard />
        </div>
        <GeneralActivityBoard />
      </section>
    </div>
  );
}

function GeneralActivityBoard() {
  const now = new Date();

  const logsMes = adminOperationalLogs.filter((item) =>
    isSameMonth(parseISODate(item.fecha), now)
  );

  const operativosMes = logsMes.filter(
    (l) => l.categoria === 'operativo'
  ).length;
  const rescatesMes = logsMes
    .filter((l) => l.categoria === 'rescate')
    .reduce((acc, l) => acc + l.mascotasRescatadas, 0);

  const sectoresConPresenciaMes = new Set(logsMes.map((l) => l.sector)).size;

  const ingresosAdopcionMes = mascotasAdopcion.filter((m) =>
    isSameMonth(parseISODate(m.fechaIngreso), now)
  ).length;

  const campañasActivas = campanas
    .filter((c) => {
      const start = parseISODate(c.fechaInicio);
      const end = parseISODate(c.fechaFin);
      return now >= start && now <= end;
    })
    .slice(0, 3);

  const logsRecientes = [...adminOperationalLogs]
    .sort(
      (a, b) =>
        parseISODate(b.fecha).getTime() - parseISODate(a.fecha).getTime()
    )
    .slice(0, 6);

  return (
    <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
      <header className="flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-gray-900">
          Operativos y presencia territorial
        </h3>
        <div className="text-xs font-medium text-gray-500 tabular-nums">
          Ingresos a adopción (mes):{' '}
          {ingresosAdopcionMes.toLocaleString('es-CL')}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
            Sectores (mes)
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {sectoresConPresenciaMes.toLocaleString('es-CL')}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {Array.from(new Set(logsMes.map((l) => l.sector)))
              .slice(0, 10)
              .map((sector) => (
                <span
                  key={sector}
                  className="inline-flex items-center rounded-full border border-gray-200 bg-white px-2 py-0.5 text-xs font-medium text-gray-700"
                >
                  {sector}
                </span>
              ))}
            {sectoresConPresenciaMes > 10 ? (
              <span className="text-xs font-medium text-gray-500">
                +{(sectoresConPresenciaMes - 10).toLocaleString('es-CL')}
              </span>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl bg-gray-50 p-4">
          <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
            Totales (mes)
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xs font-medium text-gray-600">Operativos</p>
              <p className="mt-1 text-lg font-bold text-gray-900 tabular-nums">
                {operativosMes.toLocaleString('es-CL')}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-3">
              <p className="text-xs font-medium text-gray-600">Rescates</p>
              <p className="mt-1 text-lg font-bold text-gray-900 tabular-nums">
                {rescatesMes.toLocaleString('es-CL')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-100">
        <table className="w-full min-w-[640px] bg-white">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr className="text-left text-xs font-semibold text-gray-600">
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Sector</th>
              <th className="px-4 py-3 text-right">Atendidas</th>
              <th className="px-4 py-3 text-right">Rescatadas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {logsRecientes.map((log) => (
              <tr key={log.id} className="text-sm text-gray-700">
                <td className="px-4 py-3 tabular-nums">
                  {new Intl.DateTimeFormat('es-CL', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  }).format(parseISODate(log.fecha))}
                </td>
                <td className="px-4 py-3 capitalize">{log.categoria}</td>
                <td className="px-4 py-3">{log.sector}</td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {log.mascotasAtendidas.toLocaleString('es-CL')}
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {log.mascotasRescatadas.toLocaleString('es-CL')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl bg-gray-50 p-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold tracking-wider text-gray-500 uppercase">
              Campañas activas
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-900">
              {campañasActivas.length === 0
                ? 'Sin campañas activas'
                : `${campañasActivas.length.toLocaleString('es-CL')} activa(s)`}
            </p>
          </div>
        </div>

        {campañasActivas.length > 0 ? (
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {campañasActivas.map((c) => (
              <div
                key={c.id}
                className="rounded-lg border border-gray-200 bg-white p-3"
              >
                <p className="text-xs font-semibold text-gray-900">
                  {c.titulo}
                </p>
                <p className="mt-1 text-xs text-gray-600 capitalize">
                  {c.tipo} · Cupos: {c.cuposDisponibles.toLocaleString('es-CL')}
                </p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AttentionBoard() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-1">
        <header className="flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-gray-900">
            Atenciones por tipo (mes)
          </h3>
          <div className="text-xs font-medium text-gray-500 tabular-nums">
            56 total
          </div>
        </header>

        <div className="space-y-3">
          {/* Vacuna */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Vacuna
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${(24 / 24) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {24}
            </span>
          </div>
          {/* Consulta */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Consulta
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${(17 / 24) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {17}
            </span>
          </div>
          {/* Cirugia */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Cirugía
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${(4 / 24) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {3}
            </span>
          </div>
          {/* Control */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Control
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-emerald-400"
                style={{ width: `${(11 / 24) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {11}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentsBoard() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col gap-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-1">
        <header className="flex items-center justify-between gap-4">
          <h3 className="text-base font-bold text-gray-900">Citas (mes)</h3>
          <div className="text-xs font-medium text-gray-500 tabular-nums">
            56 total
          </div>
        </header>

        <div className="space-y-3">
          {/* Agendada */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Completada
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-400"
                style={{ width: `${(18 / 31) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {18}
            </span>
          </div>
          {/* Agendada */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Agendada
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-400"
                style={{ width: `${(31 / 31) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {31}
            </span>
          </div>
          {/* Agendada */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Pendiente
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-400"
                style={{ width: `${(12 / 31) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {12}
            </span>
          </div>
          {/* Agendada */}
          <div className="flex items-center gap-3">
            <span className="w-24 shrink-0 text-xs font-semibold text-gray-700 capitalize">
              Cancelada
            </span>
            <div className="h-2 flex-1 rounded-full bg-gray-100">
              <div
                className="h-2 rounded-full bg-blue-400"
                style={{ width: `${(4 / 31) * 100}%` }}
              />
            </div>
            <span className="w-10 shrink-0 text-right text-xs font-semibold text-gray-700 tabular-nums">
              {4}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
