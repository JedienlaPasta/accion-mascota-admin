import { adminAppointments } from '@/app/_lib/mock-data';
import AppointmentDetailsModal from '@/app/ui/admin/citas/AppointmentDetailsModal';
import AppointmentsCalendarTable from '@/app/ui/admin/citas/AppointmentsCalendarTable';
import SummaryCard from '@/app/ui/admin/SummaryCard';
import { BaseLink } from '@/app/ui/components/Link';
import { Plus } from 'lucide-react';

type AppointmentsManagementProps = {
  searchParams?: Promise<{ appointmentId?: string }>;
};

export default async function AppointmentsManagementPageAdmin(
  props: AppointmentsManagementProps
) {
  const searchParams = await props.searchParams;
  const id = searchParams?.appointmentId ?? '';

  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Appointment Details Modal */}
      {id && (
        <AppointmentDetailsModal id={id} appointmentData={adminAppointments} />
      )}
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
          <SummaryCard title="Total Agendadas" value={100} icon="calendar" />
          <SummaryCard title="Total Atendidas" value={100} icon="month" />
          <SummaryCard
            title="Pendientes de Confirmar"
            value={100}
            icon="user"
          />
        </div>

        {/* Calendario de citas (Confirmadas y por confirmar) */}
        <AppointmentsCalendarTable />
      </section>
    </div>
  );
}
