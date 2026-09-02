import Link from 'next/link';
import {
  ArrowLeft,
  PawPrint,
  Calendar,
  HeartPulse,
  User,
  Phone,
  FileText,
  X,
  Cpu,
} from 'lucide-react';
import { Suspense } from 'react';
import Badge from '@/app/ui/components/Badge';
import {
  capitalize,
  capitalizeAll,
  formatPhone,
  formatShortDate,
} from '@/app/_lib/utils/format';
import { getAge } from '@/app/_lib/utils/get-values';
import { getPetDetailsById } from '@/app/_lib/data/mascotas';
import sql from '@/app/_lib/db';
import { getPetIcon } from '@/app/_lib/utils/get-values';
import { Button } from '@/app/ui/components/Button';
import { BaseMutedLink } from '@/app/ui/components/Link';
import NewAttentionForm from '@/app/ui/admin/mascotas/[id]/NewAttentionForm';
import { getProceduresList } from '@/app/_lib/data/atenciones';

type NewAttentionPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewAttentionPage(props: NewAttentionPageProps) {
  const { id } = await props.params;
  const mascota = await getPetDetailsById(id);
  const procedimientos = await getProceduresList();

  if (!mascota || !mascota.id) {
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center">
        <PawPrint className="text-muted-foreground -mt-20 mb-4 h-16 w-16" />
        <h2 className="text-foreground mb-2 text-xl font-semibold">
          Mascota no encontrada
        </h2>
        <p className="text-muted-foreground mb-4">
          No se encontró una mascota con el ID proporcionado.
        </p>
        <BaseMutedLink href="/admin/mascotas">
          <ArrowLeft className="h-4 w-4" />
          Volver a mascotas
        </BaseMutedLink>
      </div>
    );
  }

  const EspecieIconData = getPetIcon(mascota.especie);

  return (
    <div className="min-h-full bg-gray-50/50 p-6 lg:p-8">
      {/* Breadcrumb / Header Actions */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <Link
          href={`/admin/mascotas/${id}`}
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la ficha de {capitalize(mascota.nombre_mascota)}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs text-gray-500">
            paciente: {mascota.id}
          </span>
        </div>
      </div>

      {/* Título principal + botón Guardar duplicado sticky parte superior */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-foreground flex flex-wrap items-center gap-2 text-3xl font-bold tracking-tight">
            Registrar Atención Veterinaria
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Completa los datos de la atención. Según el tipo de atención se
            mostrarán los campos específicos.
          </p>
        </div>
        <div className="hidden sm:flex sm:items-center sm:gap-2">
          <BaseMutedLink href={`/admin/mascotas/${id}`}>
            <X className="h-4 w-4" />
            Cancelar
          </BaseMutedLink>
          {/* El botón Guardar PRINCIPAL está dentro del NewAttentionForm */}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* =========================================================
            COLUMNA 1-2: FORMULARIO
           ========================================================= */}
        <div className="space-y-6 lg:col-span-2">
          <Suspense
            fallback={
              <div className="h-96 animate-pulse rounded-2xl border border-gray-100 bg-white shadow-sm" />
            }
          >
            <NewAttentionForm
              petPublicId={mascota.id}
              pesoInicial={mascota.peso}
              procedimientosDisponibles={procedimientos}
              tieneMicrochipRegistrado={!!mascota.microchip}
              esterilizado={Boolean(mascota.esterilizado)}
            />
          </Suspense>
        </div>

        {/* =========================================================
            COLUMNA 3: Contexto Mascota + Propietario
           ========================================================= */}
        <aside className="space-y-4 lg:sticky lg:top-2 lg:self-start">
          {/* Tarjeta paciente mascota */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4">
              <h3 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
                Paciente
              </h3>
              <p className="text-xs text-gray-500">
                Datos de la mascota y su dueño/a para contexto clínico
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 sm:flex-row">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-100/70 to-blue-100/70 shadow-sm">
                <EspecieIconData className="relative h-10 w-10 text-emerald-700" />
              </div>
              <div className="space-y-2s flex-1">
                <h4 className="text-xl font-bold text-gray-900">
                  {capitalize(mascota.nombre_mascota)}
                </h4>
                <p className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">
                    {capitalize(mascota.raza ?? 'Mestizo')}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span>{getAge(mascota.fecha_nacimiento)}</span>
                </p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {mascota.esterilizado ? (
                    <Badge className="bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm ring-emerald-200">
                      Esterilizado
                    </Badge>
                  ) : mascota.esterilizado === null ? (
                    <Badge className="bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-500 shadow-sm ring-gray-200">
                      Esterilizado: No especificado
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-500 shadow-sm ring-rose-200">
                      Sin esterilizar
                    </Badge>
                  )}
                  {mascota.microchip ? (
                    <Badge className="bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm ring-slate-200">
                      <span className="flex items-center gap-1">
                        <Cpu className="h-3 w-3" />
                        Chip {mascota.microchip}
                      </span>
                    </Badge>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <div className="group flex items-center gap-2.5 rounded-xl bg-gray-50 p-3 transition-all">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-100 to-slate-200 text-slate-700">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Nacimiento
                  </p>
                  <p className="truncate text-sm font-bold text-gray-800 tabular-nums">
                    {formatShortDate(mascota.fecha_nacimiento)}
                  </p>
                </div>
              </div>
              <div className="group flex items-center gap-2.5 rounded-xl bg-gray-50 p-3 transition-all">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-slate-100 to-slate-200 text-slate-700">
                  <HeartPulse className="h-4 w-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                    Último peso
                  </p>
                  <p className="truncate text-sm font-bold text-gray-800 tabular-nums">
                    {mascota.peso != null
                      ? `${Number(mascota.peso).toFixed(2)} kg`
                      : 'Sin pesaje'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta propietario */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4">
              <h3 className="mb-1 text-lg font-bold tracking-tight text-gray-900">
                Propietario/a
              </h3>
              <p className="text-xs text-gray-500">
                Datos de contacto para seguimiento
              </p>
            </div>
            <div className="space-y-3">
              <div className="group flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-all">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700">
                  <User className="h-4.5 w-4.5" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                    Nombre completo
                  </p>
                  <p className="truncate text-sm font-bold text-gray-900">
                    {capitalizeAll(
                      mascota.nombre_propietario ?? 'Sin propietario'
                    )}
                  </p>
                </div>
              </div>
              {mascota.telefono ? (
                <div className="group flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      Teléfono
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900 tabular-nums">
                      {formatPhone(mascota.telefono)}
                    </p>
                  </div>
                </div>
              ) : null}
              {mascota.correo ? (
                <div className="group flex items-center gap-3 rounded-xl bg-gray-50 p-3 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700">
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      Correo
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900">
                      {mascota.correo}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-5 border-t border-slate-100 pt-4">
              <Link
                href={`/admin/propietarios/${mascota.propietario_id ?? ''}`}
                className="w-full"
              >
                <Button className="h-10 w-full justify-start gap-2 px-3 text-sm shadow-sm transition-all hover:shadow">
                  <FileText className="h-4 w-4 text-white" />
                  Ver ficha del propietario
                </Button>
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
