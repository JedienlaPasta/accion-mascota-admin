import TableWrapper from '@/app/ui/admin/TableWrapper';
import SummaryCard from '@/app/ui/admin/dashboard/SummaryCard';
import AppointmentTable from '@/app/ui/admin/dashboard/TodayAppointments';
import HeatMap from '@/app/ui/admin/dashboard/heatmap/Heatmap';
import { SecondaryButton } from '@/app/ui/components/Button';
import { Download, ListFilter } from 'lucide-react';

type PortalAdminProps = {
  searchParams?: Promise<{
    year?: string;
  }>;
};

export default async function PortalAdmin(props: PortalAdminProps) {
  const searchParams = await props.searchParams;
  const currentYear = new Date().getFullYear();
  const year = searchParams?.year || String(currentYear);

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
          <SummaryCard title="Citas (hoy)" value={8} icon="calendar" />
          <SummaryCard title={`Atenciones (mes)`} value={6} icon="month" />
          <SummaryCard title="Mascotas registradas" value={7} icon="paw" />
          <SummaryCard title="Operativos (mes)" value={2} icon="calendar" />
        </div>

        <HeatMap year={year} />

        {/* Appointments Table */}
        <TableWrapper title="Horario de Hoy">
          <AppointmentTable />
        </TableWrapper>

        {/* Dashboard Metrics & Data */}
        <div className="flex gap-4">
          <AttentionBoard />
          <AppointmentsBoard />
        </div>
      </section>
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
