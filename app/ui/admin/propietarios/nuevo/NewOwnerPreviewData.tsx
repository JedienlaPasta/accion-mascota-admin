import { validateRutDv } from '@/app/_lib/utils/check-values';
import { capitalizeAll, formatPhone, formatRUT } from '@/app/_lib/utils/format';
import { getInitials } from '@/app/_lib/utils/get-values';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import {
  AtSign,
  BadgeCheck,
  CalendarDays,
  Check,
  Hash,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type NewOwnerPreviewDataProps = {
  ownerData: OwnerData;
  isSubmitting: boolean;
  handleSubmit: () => void;
};

type OwnerData = {
  rut: string;
  nombre: string;
  correoPersonal: string;
  correoContacto: string;
  fechaNacimiento: string;
  direccion: string;
  comuna: string;
  region: string;
  telefonoPersonal: string;
  telefonoContacto: string;
  rsh: string;
};

export default function NewOwnerPreviewData({
  ownerData,
  isSubmitting,
  handleSubmit,
}: NewOwnerPreviewDataProps) {
  const router = useRouter();

  const progress =
    (Object.values(ownerData).filter((v) => Boolean(String(v).trim())).length /
      Object.keys(ownerData).length) *
    100;

  const camposCompletados = Object.values(ownerData).filter((v) =>
    Boolean(String(v).trim())
  ).length;

  return (
    <div className="space-y-6">
      {/* Tarjeta de previsualizacion */}
      <aside className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header + gradiente */}
        <div className="relative h-24 bg-linear-to-br from-sky-500 via-sky-600 to-blue-700">
          <div className="absolute -bottom-9 left-6">
            <div className="flex size-18 items-center justify-center rounded-2xl bg-white shadow-lg ring-4 shadow-blue-900/10 ring-white">
              {ownerData.nombre.trim() ? (
                <span className="text-2xl font-black text-blue-700 select-none">
                  {getInitials(ownerData.nombre)}
                </span>
              ) : (
                <UserRound className="size-9 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pt-12 pb-6">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-gray-900">
                {ownerData.nombre.trim() ? (
                  capitalizeAll(ownerData.nombre)
                ) : (
                  <span className="text-gray-400">Nombre del propietario</span>
                )}
              </h3>
              <div className="mt-1 flex items-center gap-1.5">
                {ownerData.rut.trim() ? (
                  <>
                    <BadgeCheck className="size-3.5 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700">
                      {formatRUT(ownerData.rut)}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">RUT pendiente</span>
                )}
              </div>
            </div>
          </div>

          {/* Lista de datos (solo aparecen los que tienen valor) */}
          <ul className="mt-5 space-y-2.5 text-xs">
            {ownerData.telefonoPersonal.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="size-3.5 shrink-0 text-gray-400" />
                <span className="truncate">
                  {formatPhone(ownerData.telefonoPersonal)}
                </span>
              </li>
            )}
            {ownerData.telefonoContacto.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <Phone className="size-3.5 shrink-0 text-gray-400" />
                <span className="truncate">
                  {formatPhone(ownerData.telefonoContacto)}
                </span>
              </li>
            )}
            {(ownerData.correoPersonal || ownerData.correoContacto) && (
              <li className="flex items-start gap-2 text-gray-600">
                <AtSign className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                <span className="truncate">
                  {ownerData.correoPersonal?.trim() ||
                    ownerData.correoContacto?.trim()}
                </span>
              </li>
            )}
            {ownerData.fechaNacimiento.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <CalendarDays className="size-3.5 shrink-0 text-gray-400" />
                <span>{ownerData.fechaNacimiento}</span>
              </li>
            )}
            {(ownerData.direccion || ownerData.comuna || ownerData.region) && (
              <li className="flex items-start gap-2 text-gray-600">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                <span className="line-clamp-2">
                  {[
                    ownerData.direccion.trim(),
                    ownerData.comuna.trim(),
                    ownerData.region.trim(),
                  ]
                    .filter(Boolean)
                    .map(capitalizeAll)
                    .join(' · ') || (
                    <span className="text-gray-400">Sin domicilio</span>
                  )}
                </span>
              </li>
            )}
            {!ownerData.telefonoPersonal.trim() &&
              !ownerData.telefonoContacto.trim() &&
              !ownerData.correoPersonal?.trim() &&
              !ownerData.correoContacto?.trim() &&
              !ownerData.fechaNacimiento.trim() &&
              !ownerData.direccion.trim() &&
              !ownerData.comuna.trim() &&
              !ownerData.region.trim() && (
                <li className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500 ring-1 ring-slate-100">
                  Completa los campos opcionales — aquí se verá una vista previa
                  de cómo quedará la ficha.
                  <br />
                  <span className="text-[10px]">
                    Solo se muestran los campos que hayas completado.
                  </span>
                </li>
              )}
          </ul>
        </div>
      </aside>

      {/* Validador de Digito Verificador (RUT en vivo) */}
      <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
          <ShieldCheck className="size-4 text-slate-600" />
          Validador RUT
        </h2>
        {(() => {
          const { valid, expectedDv, actualDv } = validateRutDv(ownerData.rut);
          const statusColor =
            valid === true
              ? 'bg-blue-50 text-blue-700 ring-blue-100'
              : valid === false
                ? 'bg-rose-50 text-rose-700 ring-rose-100'
                : 'bg-slate-50 text-slate-500 ring-slate-100';
          const iconLeft =
            valid === true ? (
              <ShieldCheck className="size-4 text-blue-600" />
            ) : valid === false ? (
              <ShieldAlert className="size-4 text-rose-600" />
            ) : (
              <XCircle className="size-4 text-slate-400" />
            );
          return (
            <div className={`rounded-xl p-3 text-xs ring-1 ${statusColor}`}>
              <div className="flex items-center gap-2">
                {iconLeft}
                <span className="leading-tight font-semibold">
                  {valid === true
                    ? 'Dígito verificador OK'
                    : valid === false
                      ? 'Dígito verificador inválido'
                      : 'Aún no hay RUT para validar'}
                </span>
              </div>
              {valid === false && (
                <p className="mt-1.5 pl-6 text-[11px] leading-relaxed">
                  El cuerpo del RUT corresponde al dígito{' '}
                  <span className="font-bold">
                    {expectedDv === 'K' ? 'K' : expectedDv}
                  </span>{' '}
                  y tú escribiste{' '}
                  <span className="font-bold">
                    {actualDv === 'K' ? 'K' : actualDv || '(vacío)'}
                  </span>
                  .<br />
                  Revisa si te equivocaste del último número/K.
                </p>
              )}
              {valid === null && (
                <p className="mt-1.5 pl-6 text-[11px] leading-relaxed">
                  Escribe un RUT completo (números + último dígito/K) y aquí
                  verás en tiempo real si es matemáticamente válido.
                </p>
              )}
            </div>
          );
        })()}
      </aside>

      {/* Progreso + Acciones */}
      <aside className="sticky bottom-0 z-10 space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center justify-between text-sm font-bold text-gray-900">
            <span className="flex items-center gap-2">
              <Hash className="size-4 text-slate-600" />
              Progreso
            </span>
            <span className="text-[11px] font-bold text-blue-700">
              {Math.min(100, Math.round(progress))}%
            </span>
          </h2>
          <div className="space-y-2">
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-linear-to-r from-blue-400 to-blue-600 transition-all duration-500"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">
                {camposCompletados}
              </span>{' '}
              de {Object.keys(ownerData).length} campos completados.
            </p>
            <p className="mt-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 ring-1 ring-slate-100">
              Solo{' '}
              <span className="font-semibold text-slate-800">RUT y Nombre</span>{' '}
              son estrictamente obligatorios. Todo lo demás se puede completar
              después directamente en la ficha.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-md lg:block">
          <div className="flex-cols flex items-stretch justify-evenly gap-3">
            <SecondaryButton
              className="w-full justify-center rounded-xl border-gray-200 hover:bg-gray-50"
              onClick={() => router.back()}
            >
              <X className="h-4 w-4" />
              Descartar
            </SecondaryButton>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="h-10 w-full gap-2 bg-blue-600 text-sm hover:bg-blue-700"
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? 'Guardando…' : 'Guardar'}
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}
