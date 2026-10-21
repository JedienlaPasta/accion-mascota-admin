'use client';

import { AppWindow, Cat, Clock, Dog, PawPrint, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { capitalize, capitalizeAll, formatRUT } from '@/app/_lib/utils/format';
import { ComponentType, memo } from 'react';
import { AppointmentListItem } from '@/app/_lib/data-types/citas';
import { TIPO_STYLES } from '@/app/_lib/static-data/tipos-atencion';

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

function StatusBadge({ estado }: { estado: string | null }) {
  const e = (estado || 'pendiente').toLowerCase();
  const style =
    e === 'cancelada' || e === 'cancelado'
      ? 'bg-red-50 text-red-600 ring-red-200/60'
      : e === 'confirmada' || e === 'agendado' || e === 'agendada'
        ? 'bg-sky-50 text-sky-700 ring-sky-200/60'
        : e === 'completada' || e === 'completado' || e === 'atendida'
          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/60'
          : 'bg-amber-50 text-amber-700 ring-amber-200/60';
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-lg px-2.5 py-1 text-[11px] font-semibold capitalize ring-1 ${style}`}
    >
      {estado || 'Pendiente'}
    </span>
  );
}

function AppointmentsTableRowInner(props: AppointmentListItem) {
  const {
    id,
    hora_agendada,
    nombre_mascota,
    especie,
    public_id_mascota,
    nombre_propietario,
    rut_propietario,
    public_id_propietario,
    // motivo,
    tipo_atencion,
    estado,
    microchip,
  } = props;

  const { Icon: EspecieIcon } = getEspecieIcon(especie);
  const fecha = hora_agendada?.slice(0, 10) ?? '—';
  const hora = hora_agendada?.slice(11, 16) ?? '—';
  const atencion = TIPO_STYLES[tipo_atencion.toLowerCase()].displayName || '—';

  const router = useRouter();
  const searchParams = useSearchParams();

  const openAppointmentModal = (id: string) => {
    if (!id) return;
    const params = new URLSearchParams(searchParams);
    params.set('appointmentId', id);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '', { scroll: false });
  };

  return (
    <tr className="grid h-17 grid-cols-24 items-center gap-4 px-8 py-4 text-sm text-gray-600 transition-colors focus-within:bg-gray-50/80 hover:bg-gray-50/80">
      {/* 1. Fecha + hora agendada */}
      <td className="col-span-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <Clock
              className="size-3.5 shrink-0 text-gray-400"
              aria-hidden="true"
            />
            <span className="text-xs font-medium text-gray-800 tabular-nums">
              {hora} hrs
            </span>
          </div>
          <span className="pl-5.5 text-[11px] text-gray-400 tabular-nums">
            {fecha}
          </span>
        </div>
      </td>

      {/* 2. Mascota con icono especie */}
      <td className="col-span-4 min-w-0">
        <Link
          href={`/admin/mascotas/${public_id_mascota}`}
          className="flex items-center gap-2.5"
        >
          <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 ring-1 ring-gray-200">
            <EspecieIcon className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate font-semibold text-gray-900 transition-colors hover:text-indigo-700"
              title={capitalize(nombre_mascota)}
            >
              {capitalize(nombre_mascota)}
            </p>
            <p className="truncate text-[11px] text-gray-400 tabular-nums">
              chip: {microchip || 'Sin registrar'}
            </p>
          </div>
        </Link>
      </td>

      {/* 3. Propietario */}
      <td className="col-span-7 min-w-0">
        {nombre_propietario && rut_propietario ? (
          <Link
            href={`/admin/propietarios/${public_id_propietario}`}
            className="flex items-center gap-2.5"
          >
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-gray-200">
              <User className="size-3.5 shrink-0 text-gray-400" />
            </span>
            <div className="group min-w-0 flex-1">
              <p
                className="truncate text-xs font-semibold text-gray-700 group-hover:text-indigo-700"
                title={capitalizeAll(nombre_propietario)}
              >
                {capitalizeAll(nombre_propietario)}
              </p>
              <p className="shrink-0 text-[11px] text-gray-500/80 tabular-nums">
                {formatRUT(rut_propietario)}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-gray-200">
              <User className="size-3.5 shrink-0 text-gray-400" />
            </span>
            <p className="shrink-0 text-xs font-medium text-gray-400/70">
              Sin propietario
            </p>
          </div>
        )}
      </td>

      {/* 4. tipo de servicio */}
      <td className="col-span-5 truncate">
        <span
          className="truncate text-xs font-medium text-gray-700"
          title={atencion ? capitalizeAll(atencion) : undefined}
        >
          {atencion ? capitalizeAll(atencion) : 'No especificado'}
        </span>
      </td>

      {/* 5. Estado */}
      <td className="col-span-3 flex justify-center tabular-nums">
        <StatusBadge estado={estado} />
      </td>

      {/* 6. Acciones */}
      <td className="relative col-span-2 flex items-center justify-center gap-2">
        <Link
          href={`/admin/mascotas/${public_id_mascota}`}
          title="Ficha mascota"
          className="inline-flex size-8 items-center justify-center rounded-lg text-gray-500/80 transition-all hover:bg-gray-200/40 hover:text-gray-700"
        >
          <PawPrint className="size-4" />
        </Link>
        <button
          type="button"
          onClick={() => openAppointmentModal(id)}
          title="Ver detalle cita"
          aria-label="Ver detalle cita"
          className="inline-flex size-8 cursor-pointer items-center justify-center rounded-lg text-gray-500/80 transition-all hover:bg-gray-200/40 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
        >
          <AppWindow className="size-4.5" />
        </button>
      </td>
    </tr>
  );
}

export default memo(AppointmentsTableRowInner);
