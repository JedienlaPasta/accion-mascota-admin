'use client';
import { CalendarX } from 'lucide-react';
import Pagination from '../../components/Pagination';
import AppointmentsTableRow from './AppointmentsTableRow';
import { AppointmentListItem } from '@/app/_lib/data-types/citas';

type AppointmentsTableProps = {
  appointments: AppointmentListItem[];
  page: number;
  totalPages: number;
  totalCount: number;
};

export default function AppointmentsTable({
  appointments,
  page,
  totalPages,
  totalCount,
}: AppointmentsTableProps) {
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
                      Sin citas para mostrar
                    </p>
                    <p className="text-xs text-gray-400">
                      Prueba cambiando los filtros o agenda una nueva cita.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Contador de resultados + Paginacion */}
        <footer className="flex flex-col-reverse items-center justify-between gap-3 border-t border-gray-200/70 bg-white px-4 py-2 sm:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <p className="tabular-numss font-medium text-gray-700">
              Mostrando{' '}
              <span className="text-slate-900">
                {totalCount === 0 ? 0 : (page - 1) * 10 + 1}
                {'-'}
                {Math.min(page * 10, Math.max(0, totalCount))}
              </span>{' '}
              de <span className="text-slate-900">{totalCount}</span>
            </p>
          </div>
          <Pagination pages={totalPages} />
        </footer>
      </div>
    </div>
  );
}
