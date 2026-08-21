'use client';

import {
  AppWindow,
  CalendarDays,
  Cat,
  ClipboardList,
  Dog,
  FileCheck,
  PawPrint,
  Scale,
  Stethoscope,
  Syringe,
  User,
} from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  capitalize,
  capitalizeAll,
  formatRUT,
  formatShortDate,
} from '@/app/_lib/utils/format';
import { ComponentType, memo } from 'react';
import { Visits } from '@/app/_lib/data-types/atenciones';

type TipoStyle = {
  Icon: ComponentType<{ className?: string }>;
  bg: string;
  text: string;
  ring: string;
};

const DEFAULT_TIPO: TipoStyle = {
  Icon: ClipboardList,
  bg: 'bg-slate-50',
  text: 'text-slate-700',
  ring: 'ring-slate-200/70',
};

const getTipoStyle = (tipoRaw: string): TipoStyle => {
  const t = tipoRaw.trim().toLowerCase();
  if (t.includes('consulta'))
    return {
      Icon: Stethoscope,
      bg: 'bg-sky-50',
      text: 'text-sky-700',
      ring: 'ring-sky-200/60',
    };
  if (t.includes('vacuna') || t.includes('vacunacion'))
    return {
      Icon: Syringe,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      ring: 'ring-emerald-200/60',
    };
  if (t.includes('cirugia') || t.includes('operativ'))
    return {
      Icon: FileCheck,
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      ring: 'ring-rose-200/60',
    };
  if (
    t.includes('control') ||
    t.includes('seguimient') ||
    t.includes('post-opera')
  )
    return {
      Icon: ClipboardList,
      bg: 'bg-violet-50',
      text: 'text-violet-700',
      ring: 'ring-violet-200/60',
    };
  if (t.includes('emergencia') || t.includes('urgencia'))
    return {
      Icon: PawPrint,
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      ring: 'ring-orange-200/60',
    };
  return DEFAULT_TIPO;
};

function getEspecieIcon(especieRaw: string): {
  Icon: ComponentType<{ className?: string }>;
  label: string;
} {
  const e = especieRaw.trim().toLowerCase();
  if (e.includes('canin') || e === 'perro' || e === 'perra')
    return { Icon: Dog, label: 'Perro' };
  if (e.includes('felin') || e === 'gato' || e === 'gata')
    return { Icon: Cat, label: 'Gato' };
  return { Icon: PawPrint, label: capitalize(especieRaw) };
}

function VisitsTableRowInner(props: Visits) {
  const {
    id,
    fecha_atencion,
    nombre_mascota,
    especie,
    public_id_mascota,
    nombre_propietario,
    rut_propietario,
    public_id_propietario,
    tipo_atencion,
    motivo_atencion,
    pre_dx,
    veterinario,
    microchip,
    peso_actual,
  } = props;

  const tipoStyle = getTipoStyle(tipo_atencion);
  const TipoIcon = tipoStyle.Icon;
  const { Icon: EspecieIcon } = getEspecieIcon(especie);

  const router = useRouter();
  const searchParams = useSearchParams();

  const openVisitModal = (id: string) => {
    if (!id) return;
    const params = new URLSearchParams(searchParams);
    params.set('visitId', id);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '', { scroll: false });
  };

  const textoCorto =
    motivo_atencion && motivo_atencion.trim()
      ? capitalizeAll(motivo_atencion.trim().slice(0, 120))
      : pre_dx
        ? capitalizeAll(pre_dx.trim().slice(0, 120))
        : 'Sin descripción';
  const tooltipCompleto = [
    motivo_atencion ? `Motivo: ${capitalizeAll(motivo_atencion)}` : null,
    pre_dx ? `Pre-DX: ${capitalizeAll(pre_dx)}` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <tr className="grid grid-cols-24 items-center gap-4 px-8 py-4 text-sm text-zinc-600 transition-colors focus-within:bg-zinc-50/80 hover:bg-zinc-50/80">
      {/* 1. Fecha + hora (formato) */}
      <td className="col-span-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <CalendarDays
              className="size-3.5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-zinc-800 tabular-nums">
              {formatShortDate(fecha_atencion)}
            </span>
          </div>
          <span className="pl-5.5 text-[11px] text-zinc-400 tabular-nums">
            {/* hora si la tuvieras en timestamp — si quieres la extraes: */}
            {new Date(fecha_atencion).toLocaleTimeString('es-CL', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </td>

      {/* 2. Mascota con icono especie */}
      <td className="col-span-4 min-w-0">
        <Link
          href={`/admin/mascotas/${public_id_mascota}`}
          className="flex items-center gap-2.5"
        >
          <span
            className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ${tipoStyle.bg} ${tipoStyle.text} ${tipoStyle.ring}`}
          >
            <EspecieIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate font-semibold text-zinc-900 transition-colors hover:text-indigo-700"
              title={capitalize(nombre_mascota)}
            >
              {capitalize(nombre_mascota)}
            </p>
            <p className="truncate text-[11px] text-zinc-400 tabular-nums">
              µchip: {microchip || 'Sin registrar'}
            </p>
          </div>
        </Link>
      </td>

      {/* 3. Tipo atención (coloreado por tipo) */}
      <td className="col-span-3 flex tabular-nums">
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${tipoStyle.bg} ${tipoStyle.text} ${tipoStyle.ring}`}
          title={capitalizeAll(tipo_atencion)}
        >
          <TipoIcon className="size-3" />
          {capitalize(tipo_atencion)}
        </span>
      </td>

      {/* 4. Propietario + Motivo (ahora ocupamos las 5 cols) */}
      <td className="col-span-6 min-w-0">
        <Link
          href={`/admin/propietarios/${public_id_propietario}`}
          className="block min-w-0"
        >
          <div className="flex items-center gap-1.5">
            <User className="size-3.5 shrink-0 text-zinc-400" />
            <p
              className="truncate text-xs font-semibold text-zinc-700 hover:text-indigo-700"
              title={capitalizeAll(nombre_propietario)}
            >
              {capitalizeAll(nombre_propietario)}
            </p>
            <span className="shrink-0 text-[10px] text-zinc-400 tabular-nums">
              ({formatRUT(rut_propietario)})
            </span>
          </div>
        </Link>
        <p
          className="mt-0.5 truncate text-xs text-zinc-500"
          title={tooltipCompleto || textoCorto}
        >
          {textoCorto || '—'}
        </p>
      </td>

      {/* 5. Veterinario */}
      <td className="col-span-3 truncate tabular-nums">
        <div className="flex items-center gap-1.5">
          <User className="size-3.5 shrink-0 text-zinc-400" />
          <span
            className="truncate text-xs text-zinc-700"
            title={capitalizeAll(veterinario)}
          >
            {capitalizeAll(veterinario)}
          </span>
        </div>
      </td>

      {/* 6. Peso (NUEVA COLUMNA compacta) */}
      <td className="col-span-2 flex justify-center tabular-nums">
        {peso_actual ? (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200/60"
            title={`${peso_actual} kg`}
          >
            <Scale className="size-3" />
            {peso_actual} kg
          </span>
        ) : (
          <span
            className="text-[10px] text-nowrap text-zinc-400"
            title="Sin peso registrado"
          >
            — kg
          </span>
        )}
      </td>

      {/* 7. Acciones (ampliamos de 2 → 4 cols para 2 botones: VER + EDITAR) */}
      <td className="relative col-span-3 flex items-center justify-center gap-2">
        <Link
          href={`/admin/mascotas/${public_id_mascota}`}
          title="Ficha mascota"
          className="peer inline-flex size-8 items-center justify-center rounded-lg text-zinc-500/80 transition-all hover:bg-zinc-200/40 hover:text-zinc-700"
        >
          <PawPrint className="size-4" />
        </Link>
        <button
          type="button"
          onClick={() => openVisitModal(id)}
          title="Ver detalle atención"
          aria-label="Ver detalle atención"
          className="peer inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500/80 transition-all hover:bg-zinc-200/40 hover:text-zinc-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
        >
          <AppWindow className="size-4.5" />
        </button>
      </td>
    </tr>
  );
}

export default memo(VisitsTableRowInner);
