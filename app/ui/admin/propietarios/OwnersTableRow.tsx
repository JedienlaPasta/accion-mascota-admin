import { PropietariosTableData } from '@/app/_lib/data-types/propietarios';
import { formatPhone, formatRUT } from '@/app/_lib/utils/format';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OwnerTableRow({
  id,
  nombre_propietario,
  rut,
  correo,
  direccion,
  comuna,
  region,
  telefono,
  total_mascotas,
}: PropietariosTableData) {
  return (
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 py-4 text-sm text-zinc-600 transition-colors hover:bg-zinc-50/80">
      <td className="col-span-5">
        <p className="font-medium text-zinc-900">{nombre_propietario}</p>
        <p className="text-xs tabular-nums">{formatRUT(rut)}</p>
      </td>
      <td className="col-span-5">
        <p className="font-medium text-zinc-900 tabular-nums">
          {formatPhone(telefono)}
        </p>
        <p className="text-xs">{correo}</p>
      </td>
      <td className="col-span-7 truncate">
        <p className="font-medium text-zinc-900">{direccion}</p>
      </td>

      <td className="col-span-3 flex justify-center tabular-nums">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 capitalize">
          {total_mascotas}
        </span>
      </td>
      <td className="col-span-2 truncate text-center tabular-nums">
        {comuna}, {region}
      </td>
      <td className="relative col-span-2 flex justify-center">
        <Link href={`/admin/propietarios/${id}`}>
          <ArrowRight className="peer relative z-10 size-8 rounded-lg p-2 text-zinc-500/80 transition-colors hover:bg-zinc-200/40 hover:text-zinc-600/90" />
        </Link>
      </td>
    </tr>
  );
}
