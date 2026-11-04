import {
  validateMicrochip,
  validateRutDv,
} from '@/app/_lib/utils/check-values';
import { capitalize, capitalizeAll, formatRUT } from '@/app/_lib/utils/format';
import { getAge, getPetIcon } from '@/app/_lib/utils/get-values';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import {
  BadgeCheck,
  CalendarDays,
  Fingerprint,
  Hash,
  HeartPulse,
  Palette,
  Pill,
  ShieldAlert,
  ShieldCheck,
  Weight,
  X,
  XCircle,
  Check,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

type PetData = {
  rut: string;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: string;
  color: string;
  peso: string;
  chip: string;
  esterilizado: string;
};

type NewPetPreviewDataProps = {
  petData: PetData;
  isSubmitting: boolean;
  handleSubmit: () => void;
};

export default function NewPetPreviewData({
  petData,
  isSubmitting,
  handleSubmit,
}: NewPetPreviewDataProps) {
  const router = useRouter();

  const especieLabel =
    petData.especie === 'perro'
      ? 'Perro'
      : petData.especie === 'gato'
        ? 'Gato'
        : '';

  const especieRaw =
    petData.especie === 'perro'
      ? 'CANINO'
      : petData.especie === 'gato'
        ? 'FELINO'
        : '';

  const PetIcon = getPetIcon(especieRaw);

  const sexoLabel = petData.sexo ? capitalize(petData.sexo) : '';
  const esterilizadoLabel =
    petData.esterilizado === 'true'
      ? 'Sí'
      : petData.esterilizado === 'false'
        ? 'No'
        : '';

  const progress =
    (Object.values(petData).filter((v) => Boolean(String(v).trim())).length /
      Object.keys(petData).length) *
    100;

  const camposCompletados = Object.values(petData).filter((v) =>
    Boolean(String(v).trim())
  ).length;

  return (
    <div className="space-y-6">
      {/* Tarjeta de previsualizacion */}
      <aside className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        {/* Header + gradiente */}
        <div className="relative h-24 bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700">
          <div className="absolute -bottom-9 left-6">
            <div className="flex size-18 items-center justify-center rounded-2xl bg-white shadow-lg ring-4 shadow-emerald-900/10 ring-white">
              {petData.especie ? (
                <PetIcon className="size-9 text-emerald-700" />
              ) : (
                <PetIcon className="size-9 text-gray-400" />
              )}
            </div>
          </div>
        </div>

        <div className="px-6 pt-12 pb-6">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-gray-900">
                {petData.nombre.trim() ? (
                  capitalizeAll(petData.nombre)
                ) : (
                  <span className="text-gray-400">Nombre de la mascota</span>
                )}
              </h3>
              <div className="mt-1 flex items-center gap-1.5">
                {petData.especie ? (
                  <>
                    <BadgeCheck className="size-3.5 text-slate-500" />
                    <span className="flex text-xs font-semibold text-slate-700">
                      {especieLabel}
                      {petData.raza.trim() &&
                        ` · ${capitalizeAll(petData.raza)}`}
                    </span>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">
                    Especie pendiente
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Lista de datos (solo aparecen los que tienen valor) */}
          <ul className="mt-5 space-y-2.5 text-xs">
            {petData.fechaNacimiento.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <CalendarDays className="size-3.5 shrink-0 text-gray-400" />
                <span>
                  {petData.fechaNacimiento} — {getAge(petData.fechaNacimiento)}
                </span>
              </li>
            )}
            {sexoLabel && (
              <li className="flex items-center gap-2 text-gray-600">
                <HeartPulse className="size-3.5 shrink-0 text-gray-400" />
                <span>{sexoLabel}</span>
              </li>
            )}
            {petData.color.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <Palette className="size-3.5 shrink-0 text-gray-400" />
                <span className="truncate">{petData.color.trim()}</span>
              </li>
            )}
            {petData.peso.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <Weight className="size-3.5 shrink-0 text-gray-400" />
                <span>{petData.peso.replace(',', '.')} kg</span>
              </li>
            )}
            {esterilizadoLabel && (
              <li className="flex items-center gap-2 text-gray-600">
                <Pill className="size-3.5 shrink-0 text-gray-400" />
                <span>Esterilizado: {esterilizadoLabel}</span>
              </li>
            )}
            {petData.chip.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <Fingerprint className="size-3.5 shrink-0 text-gray-400" />
                <span className="truncate tabular-nums">
                  {petData.chip.trim()}
                </span>
              </li>
            )}
            {petData.rut.trim() && (
              <li className="flex items-center gap-2 text-gray-600">
                <BadgeCheck className="size-3.5 shrink-0 text-gray-400" />
                <span>Propietario: {formatRUT(petData.rut)}</span>
              </li>
            )}
            {!petData.fechaNacimiento.trim() &&
              !petData.sexo &&
              !petData.color.trim() &&
              !petData.peso.trim() &&
              !petData.esterilizado &&
              !petData.chip.trim() &&
              !petData.rut.trim() && (
                <li className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500 ring-1 ring-slate-100">
                  Completa los campos del formulario — aquí se verá una vista
                  previa de cómo quedará la ficha de la mascota.
                  <br />
                  <span className="text-[10px]">
                    Solo se muestran los campos que hayas completado.
                  </span>
                </li>
              )}
          </ul>
        </div>
      </aside>

      {/* Validador de Microchip */}
      <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
          <ShieldCheck className="size-4 text-slate-600" />
          Validador Microchip
        </h2>
        {(() => {
          const chip = petData.chip.trim();
          const warnings = chip ? validateMicrochip(chip) : [];
          const valid = chip.length === 15 && warnings.length === 0;
          const statusColor = valid
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
            : chip
              ? 'bg-rose-50 text-rose-700 ring-rose-100'
              : 'bg-slate-50 text-slate-500 ring-slate-100';
          const iconLeft = valid ? (
            <ShieldCheck className="size-4 text-emerald-600" />
          ) : chip ? (
            <ShieldAlert className="size-4 text-rose-600" />
          ) : (
            <XCircle className="size-4 text-slate-400" />
          );
          return (
            <div className={`rounded-xl p-3 text-xs ring-1 ${statusColor}`}>
              <div className="flex items-center gap-2">
                {iconLeft}
                <span className="leading-tight font-semibold">
                  {valid
                    ? 'Microchip válido'
                    : chip
                      ? 'Revisa el microchip'
                      : 'Aún no hay microchip para validar'}
                </span>
              </div>
              {chip && !valid && (
                <ul className="mt-1.5 list-disc space-y-0.5 pl-9 text-[11px] leading-relaxed">
                  {warnings.length > 0 ? (
                    warnings.map((w, i) => <li key={i}>{w}</li>)
                  ) : (
                    <li>Faltan dígitos ({chip.length}/15).</li>
                  )}
                </ul>
              )}
              {!chip && (
                <p className="mt-1.5 pl-6 text-[11px] leading-relaxed">
                  Es opcional — puedes dejarlo vacío si la mascota no tiene
                  microchip registrado.
                </p>
              )}
            </div>
          );
        })()}
      </aside>

      {/* Validador de Digito Verificador (RUT en vivo) */}
      <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
          <ShieldCheck className="size-4 text-slate-600" />
          Validador RUT
        </h2>
        {(() => {
          const { valid, expectedDv, actualDv } = validateRutDv(petData.rut);
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
                  <br />
                  Recuerda que el RUT debe tener al menos 8 dígitos.
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
      <aside className="space-y-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center justify-between text-sm font-bold text-gray-900">
            <span className="flex items-center gap-2">
              <Hash className="size-4 text-slate-600" />
              Progreso
            </span>
            <span className="text-[11px] font-bold text-emerald-700">
              {Math.min(100, Math.round(progress))}%
            </span>
          </h2>
          <div className="space-y-2">
            <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
              <div
                className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                style={{ width: `${Math.min(100, progress)}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              <span className="font-semibold text-slate-700">
                {camposCompletados}
              </span>{' '}
              de {Object.keys(petData).length} campos completados.
            </p>
            <p className="mt-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 ring-1 ring-slate-100">
              La{' '}
              <span className="font-semibold text-slate-800">
                identificación{' '}
              </span>
              de la mascota es opcional; el resto de datos se puede completar
              más adelante directamente en la ficha.
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className="hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-md lg:block">
          <div className="flex items-stretch justify-evenly gap-3">
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
              className="h-10 w-full gap-2 bg-emerald-600 text-sm hover:bg-emerald-700"
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
