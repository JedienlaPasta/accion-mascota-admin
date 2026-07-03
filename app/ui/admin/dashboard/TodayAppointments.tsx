'use client';

import { adminTodayAppointments } from '@/app/_lib/mock-data';
import { Ellipsis } from 'lucide-react';

type AppointmentStatus = 'confirmada' | 'pendiente';

export default function AppointmentTable() {
  return (
    <div className="borders rounded-xls overflow-hidden border-zinc-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-zinc-50s border-b border-zinc-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 py-3 text-left text-zinc-500">
              <th className="col-span-4 text-xs font-normal">Hora</th>
              <th className="col-span-3 text-xs font-normal">Mascota</th>
              <th className="col-span-6 text-xs font-normal">Propietario</th>
              <th className="col-span-6 text-xs font-normal">Tipo</th>
              <th className="col-span-3 text-center text-xs font-normal">
                Estado
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 bg-white">
            {adminTodayAppointments.map((item) => (
              <AppointmentTableRow
                key={`${item.horaInicio}-${item.nombreMascota}`}
                horaInicio={item.horaInicio}
                horaFin={item.horaFin}
                nombreMascota={item.nombreMascota}
                nombrePropietario={item.nombrePropietario}
                tipoConsulta={item.tipoConsulta}
                estado={item.estado}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type AppointmentRowProps = {
  horaInicio: string;
  horaFin: string;
  nombreMascota: string;
  nombrePropietario: string;
  tipoConsulta: string;
  estado: AppointmentStatus;
};

function AppointmentTableRow({
  horaInicio,
  horaFin,
  nombreMascota,
  nombrePropietario,
  tipoConsulta,
  estado,
}: AppointmentRowProps) {
  const isConfirmed = estado === 'confirmada';
  return (
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 py-4 text-sm text-zinc-600 transition-colors hover:bg-zinc-50/80">
      <td className="col-span-4 font-medium text-zinc-900 tabular-nums">
        {horaInicio}
        <span className="px-2 text-zinc-300">—</span>
        {horaFin}
      </td>
      <td className="col-span-3">{nombreMascota}</td>
      <td className="col-span-6 truncate font-medium text-zinc-900">
        {nombrePropietario}
      </td>
      <td className="col-span-6 truncate">{tipoConsulta}</td>
      <td className="col-span-3 flex justify-center">
        <span
          className={`inline-flex shrink-0 items-center gap-2 rounded-md border px-2.5 py-1 text-[11px] font-semibold capitalize ${
            isConfirmed
              ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
              : 'border-yellow-200 bg-yellow-50 text-yellow-600'
          }`}
        >
          {estado}
        </span>
      </td>
      <td className="relative col-span-2 flex justify-center">
        <Ellipsis className="peer relative z-10 size-6 hover:text-zinc-800" />
        <span className="absolute top-1/2 z-0 size-8 -translate-y-1/2 rounded-full bg-transparent transition-colors peer-hover:bg-zinc-200/80" />
      </td>
    </tr>
  );
}
