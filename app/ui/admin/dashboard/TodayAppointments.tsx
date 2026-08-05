'use client';

import { adminTodayAppointments } from '@/app/_lib/mock-data';
import { AppointmentTableRow, EmptyStateRow } from './AppointmentTableRow';

export default function AppointmentTable() {
  const hasAppointments = adminTodayAppointments.length > 0;

  return (
    <div className="px-6s pb-6s overflow-hidden border-zinc-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-120">
          <thead className="border-b border-gray-200/50">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500/80">
              <th scope="col" className="col-span-4 text-xs font-medium">
                Hora
              </th>
              <th scope="col" className="col-span-3 text-xs font-medium">
                Mascota
              </th>
              <th scope="col" className="col-span-6 text-xs font-medium">
                Propietario
              </th>
              <th scope="col" className="col-span-6 text-xs font-medium">
                Tipo
              </th>
              <th
                scope="col"
                className="col-span-3 text-center text-xs font-medium"
              >
                Estado
              </th>
              <th
                scope="col"
                className="col-span-2 text-center text-xs font-medium"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {hasAppointments ? (
              adminTodayAppointments.map((item) => (
                <AppointmentTableRow
                  key={`${item.horaInicio}-${item.nombreMascota}`}
                  appointment={item}
                />
              ))
            ) : (
              <EmptyStateRow />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
