import { TodayAppointmentItem } from '@/app/_lib/data-types/citas';
import { TIPO_STYLES } from '@/app/_lib/static-data/tipos-atencion';
import { capitalize, capitalizeAll } from '@/app/_lib/utils/format';
import { CalendarDays, CheckCircle2, Clock, MoveRight } from 'lucide-react';

function normalizeStatus(raw: string | null) {
  const value = (raw ?? '').trim().toLowerCase();
  if (value === 'confirmada' || value === 'confirmado') return 'confirmada';
  if (value === 'agendada' || value === 'agendado') return 'agendada';
  if (value === 'cancelada' || value === 'cancelado') return 'cancelada';
  if (value === 'completada' || value === 'completado') return 'completada';
  return 'pendiente';
}

function StatusBadge({ estado }: { estado: string | null }) {
  const status = normalizeStatus(estado);
  const isConfirmed = status === 'confirmada';
  const StatusIcon = isConfirmed ? CheckCircle2 : Clock;

  return (
    <span
      role="status"
      aria-label={`Estado: ${status}`}
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold capitalize ${
        isConfirmed
          ? 'bg-emerald-50 text-emerald-700/90 ring-1 ring-emerald-200/60'
          : 'bg-slate-50 text-slate-700/80 ring-1 ring-slate-200/60'
      }`}
    >
      <StatusIcon
        className={`size-3 ${isConfirmed ? 'text-emerald-500' : 'text-slate-500'}`}
        aria-hidden="true"
      />
      {status}
    </span>
  );
}

type AppointmentTableRowProps = {
  appointment: TodayAppointmentItem;
};

export function TodayAppointmentTableRow({
  appointment,
}: AppointmentTableRowProps) {
  const { hora, nombre_mascota, nombre_propietario, tipo_atencion, estado } =
    appointment;

  const tipoStyle = TIPO_STYLES[tipo_atencion.toLowerCase()];
  const tipoLabel = tipoStyle?.displayName ?? capitalizeAll(tipo_atencion);

  return (
    <tr className="grid h-16 grid-cols-24 items-center gap-4 px-8 text-sm text-gray-600 transition-colors focus-within:bg-gray-50/80 hover:bg-gray-50/80">
      <td className="col-span-4">
        <div className="flex items-center gap-1">
          <CalendarDays
            className="size-4 shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <span className="text-xs font-medium tabular-nums">
            {hora || '—'}
          </span>
        </div>
      </td>
      <td className="col-span-3 font-medium text-gray-900">
        {capitalize(nombre_mascota)}
      </td>
      <td className="col-span-6 truncate font-medium text-gray-900">
        {nombre_propietario ? capitalizeAll(nombre_propietario) : 'Sin asignar'}
      </td>
      <td className="col-span-6 truncate" title={tipoLabel}>
        <span className="inline-flex items-center">{tipoLabel}</span>
      </td>
      <td className="col-span-3 flex justify-center">
        <StatusBadge estado={estado} />
      </td>
      <td className="relative col-span-2 flex justify-center">
        <button
          type="button"
          className="peer relative z-10 inline-flex size-8 cursor-pointer items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-200/60 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
        >
          <MoveRight className="peer relative z-10 size-5 hover:text-gray-800" />
        </button>
      </td>
    </tr>
  );
}

export function EmptyStateRow() {
  return (
    <tr>
      <td colSpan={6} className="px-8 py-16">
        <div
          className="flex flex-col items-center justify-center text-center"
          role="status"
          aria-label="No hay citas programadas"
        >
          <h3 className="text-sm font-semibold text-zinc-800">
            No hay citas para hoy
          </h3>
          <p className="mt-1 max-w-xs text-xs text-zinc-500">
            No se encontraron citas programadas para este día. Puedes agendar
            una nueva cita desde el módulo de gestión.
          </p>
        </div>
      </td>
    </tr>
  );
}
