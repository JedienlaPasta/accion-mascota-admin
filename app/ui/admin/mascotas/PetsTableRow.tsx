'use client';
import { MascotasTableData } from '@/app/_lib/data-types/mascotas';
import { validateMicrochip } from '@/app/_lib/utils/check-values';
import {
  capitalize,
  capitalizeAll,
  formatPhone,
} from '@/app/_lib/utils/format';
import { getAge } from '@/app/_lib/utils/get-values';
import { ArrowRight, Check, CircleAlert, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function PetTableRow({
  id,
  nombre_mascota,
  especie,
  raza,
  fecha_nacimiento,
  microchip,
  esterilizado,
  nombre_propietario,
  telefono,
}: MascotasTableData) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const formattedPhone = formatPhone(telefono);

  const handleClick = () => {
    if (!microchip) return;
    const params = new URLSearchParams(searchParams);
    params.set('id', String(microchip));
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '', { scroll: false });
  };

  return (
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 py-4 text-sm text-zinc-600 transition-colors hover:bg-zinc-50/80">
      <td className="col-span-4 lg:col-span-5">
        <p className="font-medium text-zinc-900">
          {capitalize(nombre_mascota)}
        </p>
        <p className="text-xs">{getAge(fecha_nacimiento)}</p>
      </td>
      <td className="col-span-4">
        <p className="font-medium text-zinc-900 capitalize">
          {capitalize(especie)}
        </p>
        <p className="text-xs">{capitalizeAll(raza)}</p>
      </td>
      <td className="col-span-7 truncate lg:col-span-6">
        <p className="font-medium text-zinc-900">
          {capitalizeAll(nombre_propietario)}
        </p>
        <p className="text-xs tabular-nums">{formattedPhone}</p>
      </td>
      <td
        onClick={handleClick}
        className="truncates relative col-span-5 tabular-nums hover:underline"
      >
        {validateMicrochip(microchip).length > 0 && (
          <span title={validateMicrochip(microchip)[0]}>
            <CircleAlert className="absolute top-1/2 -left-6 size-4 -translate-y-1/2 text-zinc-500/80" />
          </span>
        )}
        {microchip}
      </td>
      <td className="col-span-2 flex justify-center">
        <span className="inline-flex w-5 shrink-0 items-center justify-center">
          {esterilizado === null ? (
            <span className="text-[10px] text-nowrap text-gray-400">
              No especificado
            </span>
          ) : esterilizado ? (
            <Check className="text-emerald-500" />
          ) : (
            <X className="text-indigo-500" />
          )}
        </span>
      </td>
      <td className="relative col-span-2 flex justify-center">
        <Link href={`/admin/mascotas/${id}`}>
          <ArrowRight className="peer relative z-10 size-8 rounded-lg p-2 text-zinc-500/80 transition-colors hover:bg-zinc-200/40 hover:text-zinc-600/90" />
        </Link>
      </td>
    </tr>
  );
}
