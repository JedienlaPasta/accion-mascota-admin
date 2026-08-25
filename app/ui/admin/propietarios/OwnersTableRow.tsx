import { OwnersTableData } from '@/app/_lib/data-types/propietarios';
import { capitalizeAll, formatPhone, formatRUT } from '@/app/_lib/utils/format';
import {
  ArrowRight,
  CheckCircle2,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { memo } from 'react';

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

function OwnerTableRowInner(props: OwnersTableData) {
  const {
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
  } = props;

  const correo = correo_personal || correo_contacto || '';
  const direccionCompleta = [direccion, comuna, region]
    .filter(Boolean)
    .map((s) => capitalizeAll(String(s)))
    .join(', ');
  // "Es usuario" = SI cuando SI tiene correo_personal (cuenta registrada en el portal)
  const esUsuarioRegistrado = Boolean(
    correo_personal && correo_personal.trim().length > 0
  );

  return (
    <tr className="grid h-17 grid-cols-24 items-center gap-4 px-8 text-sm text-gray-600 transition-colors focus-within:bg-gray-50/80 hover:bg-gray-50/80">
      {/* Propietario: avatar + nombre + RUT */}
      <td className="group col-span-7 min-w-0">
        <Link
          href={`/admin/propietarios/${id}`}
          className="flex items-center gap-2.5"
        >
          <span
            className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-50 to-slate-100 text-xs font-bold text-slate-700 transition-colors group-hover:from-indigo-50 group-hover:to-violet-100 group-hover:text-indigo-700"
            aria-hidden="true"
          >
            {getInitials(nombre_propietario)}
          </span>
          <div className="min-w-0 flex-1">
            <p
              className="truncate font-semibold text-gray-900 transition-colors group-hover:text-indigo-700 group-hover:underline"
              title={capitalizeAll(nombre_propietario)}
            >
              {capitalizeAll(nombre_propietario)}
            </p>
            <p className="truncate text-xs text-gray-500 tabular-nums">
              {formatRUT(rut)}
            </p>
          </div>
        </Link>
      </td>

      {/* telefono + email */}
      <td className="col-span-5 min-w-0 space-y-1">
        <p
          className="flex items-center gap-1.5 text-gray-700 tabular-nums"
          title={telefono || 'Sin teléfono'}
        >
          <Phone className="size-3 shrink-0 text-gray-400" aria-hidden="true" />
          <span className="truncate text-xs font-semibold text-gray-700">
            {telefono ? (
              formatPhone(telefono)
            ) : (
              <span className="font-normal text-gray-400">Sin teléfono</span>
            )}
          </span>
        </p>
        <p
          className="flex items-center gap-1.5 truncate text-xs"
          title={correo.toLowerCase() || 'Sin correo'}
        >
          <Mail className="size-3 shrink-0 text-gray-400" aria-hidden="true" />
          <span className="truncate text-gray-600">
            {correo ? (
              correo.toLowerCase()
            ) : (
              <span className="text-gray-400">Sin correo</span>
            )}
          </span>
        </p>
      </td>

      {/* Direccion */}
      <td className="col-span-6 min-w-0">
        <p
          className="flex items-center gap-1.5 truncate text-gray-700"
          title={direccionCompleta || 'Sin dirección'}
        >
          <MapPin
            className="size-3.5 shrink-0 text-gray-400"
            aria-hidden="true"
          />
          <span className="truncate text-xs">
            {direccionCompleta || (
              <span className="text-gray-400">Sin dirección</span>
            )}
          </span>
        </p>
      </td>

      {/* Cantidad de mascotas */}
      <td className="col-span-2 flex justify-center tabular-nums">
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1 ${
            total_mascotas > 0
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/60'
              : 'bg-gray-100 text-gray-600 ring-gray-200/70'
          }`}
          title={`${total_mascotas} mascota${total_mascotas === 1 ? '' : 's'}`}
        >
          <PawPrint className="size-3" aria-hidden="true" />
          {total_mascotas}
        </span>
      </td>

      {/* Es usuario: check / no registrado */}
      <td className="col-span-2 flex justify-center">
        {esUsuarioRegistrado ? (
          <span
            className="inline-flex shrink-0 items-center"
            title="Usuario registrado en el portal"
          >
            <CheckCircle2 className="size-4 text-emerald-500" />
          </span>
        ) : (
          <span
            className="flex shrink-0 items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-500 ring-1 ring-gray-200/70"
            title="No tiene cuenta registrada en el portal"
          >
            <XCircle className="size-3.5 text-gray-400" aria-hidden="true" />
            <span className="text-nowrap">No registrado</span>
          </span>
        )}
      </td>

      {/* Acciones */}
      <td className="relative col-span-2 flex justify-center">
        <Link
          href={`/admin/propietarios/${id}`}
          aria-label={`Ver perfil del propietario`}
          className="peer inline-flex size-8 items-center justify-center rounded-lg text-gray-500/80 transition-all hover:bg-gray-200/40 hover:text-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-1"
        >
          <ArrowRight className="size-5" />
        </Link>
      </td>
    </tr>
  );
}

export default memo(OwnerTableRowInner);
