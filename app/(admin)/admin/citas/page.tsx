import {
  getAllAppointmentsWithFilters,
  getAppointmentStatistics,
} from '@/app/_lib/data/citas';
import AppointmentsCalendarTable from '@/app/ui/admin/citas/AppointmentsCalendarTable';
import SummaryCard from '@/app/ui/admin/SummaryCard';
import { BaseLink } from '@/app/ui/components/Link';
import { Plus } from 'lucide-react';
import AppointmentDetails from '@/app/ui/admin/citas/modal/AppointmentDetails';

type AppointmentsManagementProps = {
  searchParams?: Promise<{
    appointmentId?: string;
    query?: string;
    page?: number;
  }>;
};

export default async function AppointmentsManagementPageAdmin(
  props: AppointmentsManagementProps
) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || '';
  const page = searchParams?.page || 1;
  const id = searchParams?.appointmentId ?? '';

  const { appointments, totalPages, totalCount } =
    await getAllAppointmentsWithFilters(query, page, 10);

  const { total, scheduled, finished } = await getAppointmentStatistics();

  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Appointment Details Modal */}
      {id && <AppointmentDetails id={id} />}
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Gestión de Citas
          </h2>
          <p className="text-muted-foreground text-sm">
            Administra y confirma las citas agendadas.
          </p>
        </div>
        <BaseLink
          href="/admin/citas/nueva"
          className="h-11 gap-2 text-sm shadow-md transition-all hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Nueva Cita
        </BaseLink>
      </div>

      <section className="flex flex-col gap-4 xl:col-span-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard title="Total Agendadas" value={total} icon="calendar" />
          <SummaryCard title="Total Atendidas" value={finished} icon="month" />
          <SummaryCard
            title="Pendientes de Atención"
            value={scheduled}
            icon="user"
          />
        </div>

        {/* Calendario de citas (Confirmadas y por confirmar) */}
        <AppointmentsCalendarTable
          appointments={appointments}
          page={page}
          totalPages={totalPages}
          totalCount={totalCount}
        />
      </section>
    </div>
  );
}
