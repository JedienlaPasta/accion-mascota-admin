import { AppointmentListItem } from '@/app/_lib/data-types/citas';
import { CalendarX } from 'lucide-react';
import AppointmentsTableRow from '../citas/AppointmentsTableRow';

export default function TodayAppointmentTable({
  appointments,
}: {
  appointments: AppointmentListItem[];
}) {
  return (
    <div className="borders overflow-hidden border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-b border-gray-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500">
              <th className="col-span-3 text-xs font-normal">Hora</th>
              <th className="col-span-4 text-xs font-normal">Mascota</th>
              <th className="col-span-7 text-xs font-normal">
                Propietario / RUT
              </th>
              <th className="col-span-5 text-xs font-normal">
                Tipo de atención
              </th>
              <th className="col-span-3 text-center text-xs font-normal">
                Estado
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/70 bg-white">
            {appointments.length > 0 ? (
              appointments.map((item) => (
                <AppointmentsTableRow key={item.id} {...item} />
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-16 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <CalendarX className="h-10 w-10 text-gray-300" />
                    <p className="font-medium text-gray-600">
                      Sin citas para hoy
                    </p>
                    <p className="text-xs text-gray-400">
                      No se encontraron citas agendadas para el día de hoy.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
