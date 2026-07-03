'use client';

import { propietariosAdmin } from '@/app/_lib/mock-data';
import { formatPhone, formatRUT } from '@/app/_lib/utils/format';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OwnersTable() {
  return (
    <div className="borders overflow-hidden border-zinc-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-zinc-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 py-3 text-left text-zinc-500">
              <th className="col-span-5 text-xs font-normal">Propietario</th>
              <th className="col-span-5 text-xs font-normal">Contacto</th>
              <th className="col-span-7 text-xs font-normal">Dirección</th>
              <th className="col-span-3 text-center text-xs font-normal">
                Mascotas
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Registro
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 bg-white">
            {propietariosAdmin.map((item) => (
              <OwnerTableRow
                key={`${item.rut}`}
                nombrePropietario={item.nombre}
                rut={item.rut}
                contacto={item.contacto}
                correo={item.correo}
                direccion={item.direccion}
                mascotas={item.mascotas}
                registro={item.registro}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type OwnerTableRowProps = {
  nombrePropietario: string;
  rut: string;
  contacto: string;
  correo: string;
  direccion: string;
  mascotas: number;
  registro: string;
};

function OwnerTableRow({
  nombrePropietario,
  rut,
  contacto,
  correo,
  direccion,
  mascotas,
  registro,
}: OwnerTableRowProps) {
  const subrut = rut.split('-')[0];
  const dv = rut.split('-')[1];
  const formattedRut = formatRUT(subrut, dv);

  const id = '1';

  return (
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 py-4 text-sm text-zinc-600 transition-colors hover:bg-zinc-50/80">
      <td className="col-span-5">
        <p className="font-medium text-zinc-900">{nombrePropietario}</p>
        <p className="text-xs tabular-nums">{formattedRut}</p>
      </td>
      <td className="col-span-5">
        <p className="font-medium text-zinc-900 tabular-nums">
          {formatPhone(contacto)}
        </p>
        <p className="text-xs">{correo}</p>
      </td>
      <td className="col-span-7 truncate">
        <p className="font-medium text-zinc-900">{direccion}</p>
      </td>

      <td className="col-span-3 flex justify-center tabular-nums">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 capitalize">
          {mascotas}
        </span>
      </td>
      <td className="col-span-2 truncate text-center tabular-nums">
        {registro}
      </td>
      <td className="relative col-span-2 flex justify-center">
        <Link href={`/admin/propietarios/${id}`}>
          <ArrowRight className="peer relative z-10 size-8 rounded-lg p-2 text-zinc-500/80 transition-colors hover:bg-zinc-200/40 hover:text-zinc-600/90" />
        </Link>
      </td>
    </tr>
  );
}
