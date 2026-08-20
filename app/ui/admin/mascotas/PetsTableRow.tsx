import { PetsTableData } from '@/app/_lib/data-types/mascotas';
import { validateMicrochip } from '@/app/_lib/utils/check-values';
import { capitalize, capitalizeAll, formatRUT } from '@/app/_lib/utils/format';
import { getAge } from '@/app/_lib/utils/get-values';
import {
  ArrowRight,
  CalendarDays,
  Cat,
  CheckCircle2,
  CircleAlert,
  Dog,
  Microchip,
  Minus,
  PawPrint,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

type EspecieInfo = {
  label: string;
  Icon: typeof PawPrint;
  avatarBg: string;
  avatarText: string;
  avatarRing: string;
  badgeBg: string;
  badgeText: string;
  badgeRing: string;
};

const DEFAULT_ESPECIE: EspecieInfo = {
  label: 'Mascota',
  Icon: PawPrint,
  avatarBg: 'from-slate-100 to-gray-200',
  avatarText: 'text-gray-700',
  avatarRing: 'ring-gray-200',
  badgeBg: 'bg-gray-100',
  badgeText: 'text-gray-700',
  badgeRing: 'ring-gray-200/70',
};

const getEspecieInfo = (especieRaw: string): EspecieInfo => {
  const especie = especieRaw.trim().toUpperCase();
  if (especie.includes('CANIN') || especie === 'PERRO' || especie === 'PERRA') {
    return {
      label: 'Canino',
      Icon: Dog,
      avatarBg: 'from-blue-50/30 to-blue-100',
      avatarText: 'text-sky-700',
      avatarRing: 'ring-sky-200',
      badgeBg: 'bg-sky-50',
      badgeText: 'text-sky-700',
      badgeRing: 'ring-sky-200/60',
    };
  }
  if (especie.includes('FELIN') || especie === 'GATO' || especie === 'GATA') {
    return {
      label: 'Felino',
      Icon: Cat,
      avatarBg: 'from-pinks-50 to-pink-100',
      avatarText: 'text-fuchsia-700',
      avatarRing: 'ring-fuchsia-200',
      badgeBg: 'bg-fuchsia-50',
      badgeText: 'text-fuchsia-700',
      badgeRing: 'ring-fuchsia-200/60',
    };
  }
  return {
    ...DEFAULT_ESPECIE,
    label: capitalize(especieRaw) || DEFAULT_ESPECIE.label,
  };
};

function PetTableRowInner({
  id,
  nombre_mascota,
  especie,
  raza,
  fecha_nacimiento,
  microchip,
  esterilizado,
  nombre_propietario,
  rut,
}: PetsTableData) {
  const especieInfo = getEspecieInfo(especie);
  const EspecieIcon = especieInfo.Icon;

  const edad = getAge(fecha_nacimiento);
  const microchipErrors = validateMicrochip(microchip);
  const hasMicrochipError = microchipErrors.length > 0;

  return (
    <tr className="group grid h-18 cursor-pointer grid-cols-24 items-center gap-4 px-8 text-sm text-gray-600 transition-colors focus-within:bg-gray-50/80 hover:bg-gray-50/80">
      {/* Mascota (nombre + edad) */}
      <td className="col-span-4 min-w-0 lg:col-span-5">
        <Link
          href={`/admin/mascotas/${id}`}
          className="flex items-center gap-3"
        >
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100/60 text-slate-700 group-hover:bg-emerald-400/7"
            aria-hidden="true"
          >
            <span className="flex items-center group-hover:text-emerald-700">
              <EspecieIcon className="size-4" />
            </span>
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate font-semibold text-gray-900 transition-colors group-hover:text-emerald-700"
              title={capitalize(nombre_mascota)}
            >
              {capitalize(nombre_mascota)}
            </p>
            <p
              className="flex items-center gap-1 truncate text-xs text-gray-500"
              title={edad}
            >
              <CalendarDays
                className="size-3 shrink-0 text-gray-400"
                aria-hidden="true"
              />
              {edad}
            </p>
          </div>
        </Link>
      </td>

      {/* Especie + Raza */}
      <td className="col-span-4 min-w-0">
        <span
          className={`inline-flex items-center text-xs font-semibold text-slate-900 capitalize`}
          title={especieInfo.label}
        >
          {especieInfo.label}
        </span>
        <p
          className="truncate text-xs text-gray-600"
          title={capitalizeAll(raza) || 'Sin raza especificada'}
        >
          {raza ? (
            capitalizeAll(raza)
          ) : (
            <span className="text-gray-400">Sin raza</span>
          )}
        </p>
      </td>

      {/* Propietario + RUT */}
      <td className="col-span-7 min-w-0 truncate lg:col-span-6">
        <div className="min-w-0 flex-1">
          <p
            className="truncate font-medium text-gray-900"
            title={capitalizeAll(nombre_propietario)}
          >
            {capitalizeAll(nombre_propietario)}
          </p>
          <p
            className="truncate text-xs text-gray-500 tabular-nums"
            title={formatRUT(rut)}
          >
            {formatRUT(rut)}
          </p>
        </div>
      </td>

      {/* Microchip */}
      <td
        className="relative col-span-5 min-w-0 tabular-nums"
        title={
          hasMicrochipError ? microchipErrors[0] : microchip || 'Sin microchip'
        }
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex size-7 shrink-0 items-center justify-center rounded-md ring-1 ${
              hasMicrochipError
                ? 'bg-rose-50 text-rose-500 ring-rose-200/60'
                : microchip
                  ? 'bg-emerald-50 text-emerald-600 ring-emerald-200/60'
                  : 'bg-gray-100 text-gray-400 ring-gray-200/70'
            }`}
            aria-hidden="true"
          >
            <Microchip className="size-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`truncate text-xs ${
                hasMicrochipError
                  ? 'text-rose-700'
                  : microchip
                    ? 'text-gray-800'
                    : 'text-gray-400'
              }`}
            >
              {microchip || <span>Sin microchip</span>}
            </p>
            {hasMicrochipError && (
              <p className="flex items-center gap-1 truncate text-[11px] text-rose-500">
                <CircleAlert className="size-3 shrink-0" />
                {microchipErrors[0]}
              </p>
            )}
          </div>
        </div>
      </td>

      {/* Esterilizado */}
      <td className="col-span-2 flex justify-center">
        {esterilizado === null ? (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200/70"
            title="Estado de esterilización no registrado"
          >
            <Minus className="size-3.5 text-gray-400" />
            <span className="hidden text-nowrap sm:inline">N/E</span>
          </span>
        ) : esterilizado ? (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200/60"
            title="Esterilizado/a"
          >
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span className="hidden md:inline">Sí</span>
          </span>
        ) : (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200/60"
            title="No esterilizado/a"
          >
            <XCircle className="size-4 text-indigo-500" />
            <span className="hidden md:inline">No</span>
          </span>
        )}
      </td>

      {/* Acciones */}
      <td className="relative col-span-2 flex justify-center">
        <Link
          href={`/admin/mascotas/${id}`}
          aria-label={`Ver ficha de ${capitalize(nombre_mascota)}`}
          className="peer inline-flex size-8 items-center justify-center rounded-lg text-gray-500/80 transition-all hover:bg-gray-200/40 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
        >
          <ArrowRight className="size-5" />
        </Link>
      </td>
    </tr>
  );
}

export default memo(PetTableRowInner);
