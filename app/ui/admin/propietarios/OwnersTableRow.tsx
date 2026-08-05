import { OwnersTableData } from '@/app/_lib/data-types/propietarios';
import { capitalizeAll, formatPhone, formatRUT } from '@/app/_lib/utils/format';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OwnerTableRow({
  id,
  nombre_propietario,
  rut,
  correo_personal,
  correo_contacto,
  direccion,
  comuna,
  region,
  telefono,
  total_mascotas,
}: OwnersTableData) {
  const correo = correo_personal || correo_contacto || '';

  return (
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 px-8 py-4 text-sm text-gray-600 transition-colors last:mb-2 hover:bg-gray-50/80">
      <td className="col-span-5">
        <p className="font-medium text-gray-900">
          {capitalizeAll(nombre_propietario)}
        </p>
        <p className="text-xs tabular-nums">{formatRUT(rut)}</p>
      </td>
      <td className="col-span-5">
        <p className="text-gray-600 tabular-nums">{formatPhone(telefono)}</p>
        <p className="text-xs">{correo.toLowerCase() || 'Sin correo'}</p>
      </td>
      <td className="col-span-7 truncate">
        <p className="text-gray-600">{capitalizeAll(direccion || '')}</p>
      </td>

      <td className="col-span-3 flex justify-center tabular-nums">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-linear-to-br from-slate-500 to-slate-700 px-2.5 py-1 text-[11px] font-semibold text-white capitalize">
          {total_mascotas}
        </span>
      </td>
      <td className="col-span-2 truncate text-center tabular-nums">
        {comuna}, {region}
      </td>
      <td className="relative col-span-2 flex justify-center">
        <Link href={`/admin/propietarios/${id}`}>
          <ArrowRight className="peer relative z-10 size-8 rounded-lg p-2 text-gray-500/80 transition-colors hover:bg-gray-200/40 hover:text-gray-600/90" />
        </Link>
      </td>
    </tr>
  );
}
