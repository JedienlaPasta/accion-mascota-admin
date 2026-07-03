'use client';

import { AdminVisitRegistry } from '@/app/_lib/mock-data';
import {
  AppWindow,
  Calendar,
  FileCheck,
  FileText,
  Stethoscope,
  Syringe,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ComponentType } from 'react';

const cardIcons: Record<string, ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  vacuna: Syringe,
  cirugia: Stethoscope,
  control: FileText,
  consulta: FileCheck,
};

export default function VisitTableRow({
  id,
  registro,
  nombreMascota,
  especie,
  tipoAtencion,
  diagnostico,
  veterinario,
  microchip,
}: AdminVisitRegistry) {
  const VisitTypeIcon = cardIcons[tipoAtencion];

  const router = useRouter();
  const searchParams = useSearchParams();

  const openVisitModal = (id: string) => {
    if (!id) return;
    const params = new URLSearchParams(searchParams);
    params.set('visitId', id);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '', { scroll: false });
  };

  return (
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 py-4 text-sm text-zinc-600 transition-colors hover:bg-zinc-50/80">
      <td className="col-span-4 font-medium text-zinc-900 tabular-nums">
        {registro}
      </td>
      <td className="col-span-3 font-medium text-zinc-900 tabular-nums">
        {nombreMascota}
      </td>
      <td className="col-span-3 flex tabular-nums">
        <span className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-semibold text-gray-700 capitalize">
          <VisitTypeIcon className="size-3" />
          {tipoAtencion}
        </span>
      </td>
      <td className="col-span-9 truncate font-medium text-zinc-900">
        {diagnostico}
      </td>
      <td className="col-span-3 truncate tabular-nums">{veterinario}</td>
      <td className="relative col-span-2 flex justify-center">
        <AppWindow
          onClick={() => openVisitModal(id)}
          className="peer relative z-10 size-8 rounded-lg p-2 text-zinc-500/80 transition-colors hover:bg-zinc-200/40 hover:text-zinc-600/90"
        />
      </td>
    </tr>
  );
}
