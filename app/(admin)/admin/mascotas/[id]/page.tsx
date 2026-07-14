import Link from 'next/link';
import {
  ArrowLeft,
  PawPrint,
  Calendar,
  Syringe,
  Stethoscope,
  Scissors,
  Clock,
  Pencil,
  HeartPulse,
  Palette,
  ChevronDown,
  ChevronRight,
  Cpu,
  Shield,
} from 'lucide-react';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import {
  citas,
  especieIcon,
  historialClinico,
  mascotas,
  tipoColors,
  tipoIcon,
  tipoLabels,
} from '@/app/_lib/mock-data';
import Badge from '@/app/ui/components/Badge';
import {
  capitalize,
  capitalizeAll,
  formatDate,
  formatShortDate,
} from '@/app/_lib/utils/format';
import { BaseLink } from '@/app/ui/components/Link';
import { getAge } from '@/app/_lib/utils/get-values';
import {
  getPetClinicHistoryById,
  getPetDetailsById,
} from '@/app/_lib/data/mascotas';

type MascotaDetalleProps = {
  params: Promise<{ id: string }>;
};

export default async function MascotaDetallePage(props: MascotaDetalleProps) {
  const { id } = await props.params;
  const mascota = await getPetDetailsById(id);
  const clinicHistory = await getPetClinicHistoryById(id);
  console.log(clinicHistory);

  if (!mascota) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <PawPrint className="text-muted-foreground -mt-40 mb-4 h-16 w-16" />
        <h2 className="text-foreground mb-2 text-xl font-semibold">
          Mascota no encontrada
        </h2>
        <p className="text-muted-foreground mb-4">
          No se encontró una mascota con el ID proporcionado.
        </p>
        <BaseLink href="/admin/mascotas">
          <ArrowLeft className="h-4 w-4" />
          Volver a mascotas
        </BaseLink>
      </div>
    );
  }

  const EspecieIcon = especieIcon[mascota?.especie.toLowerCase()] || PawPrint;

  const historial = historialClinico
    .filter((h) => h.mascotaId === mascota.id)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const citasMascota = citas.filter(
    (c) =>
      c.mascotaId === mascota.id &&
      (c.estado === 'pendiente' || c.estado === 'confirmada')
  );

  const tratamientoActivo = historial.find((h) => h.tratamiento);

  const totalVacunas = historial.filter((h) => h.tipo === 'vacuna').length;
  const totalConsultas = historial.filter((h) => h.tipo === 'consulta').length;
  const totalCirugias = historial.filter((h) => h.tipo === 'cirugia').length;

  return (
    <div className="min-h-full bg-gray-50/50 p-6 lg:p-8">
      {/* Volver btn */}
      <Link
        href="/admin/mascotas"
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mascotas
      </Link>

      {/* Header Card */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="p-7">
          <div className="flex flex-col items-start gap-7 sm:flex-row">
            {/* Avatar mejorado con anillo y efecto */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-emerald-100/50 to-blue-100/50 shadow-sm shadow-gray-200">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-emerald-500/10 to-blue-500/10"></div>
              <EspecieIcon className="relative h-14 w-14 text-emerald-700" />
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-foreground text-4xl font-bold tracking-tight">
                      {capitalize(mascota.nombre_mascota)}
                    </h1>
                  </div>
                  <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-base">
                    <span className="font-semibold text-gray-800">
                      {capitalize(mascota.raza)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm font-medium text-gray-500">
                      {getAge(mascota.fecha_nacimiento)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="font-medium text-gray-800">
                      {capitalizeAll(mascota.nombre_propietario)}
                    </span>
                  </p>
                </div>
                <Button className="gap-2 shadow-md transition-all hover:shadow-lg">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {/* Badges premium */}
                {mascota.esterilizado ? (
                  <Badge className="border-emerald-200 bg-emerald-50 px-3 text-emerald-700 shadow-sm">
                    <span className="flex items-center gap-1">
                      Esterilizado
                    </span>
                  </Badge>
                ) : mascota.esterilizado === null ? (
                  <Badge className="border-gray-200 bg-gray-50 px-3 py-1 text-gray-600 shadow-sm">
                    No especificado
                  </Badge>
                ) : (
                  <Badge className="border-rose-200 bg-rose-50 px-3 py-1 text-rose-700 shadow-sm">
                    <span className="flex items-center gap-1">
                      Sin esterilizar
                    </span>
                  </Badge>
                )}
                {mascota.microchip ? (
                  <Badge className="border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 shadow-sm">
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5" />
                      {mascota.microchip}
                    </span>
                  </Badge>
                ) : (
                  <Badge className="border-gray-200 bg-gray-50 px-3 text-gray-500 shadow-sm">
                    Sin microchip
                  </Badge>
                )}
                {mascota.sexo && (
                  <Badge className="border-slate-200 bg-slate-50 px-3 text-slate-700 shadow-sm">
                    {capitalize(mascota.sexo)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Info Grid mejorado */}
          <div className="border-border mt-8 grid grid-cols-2 gap-5 border-t pt-8 sm:grid-cols-4">
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-gray-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <PawPrint className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium uppercase">
                  Especie
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {capitalize(mascota.especie)}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-gray-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <Palette className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium uppercase">
                  Color
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {mascota.color ? capitalizeAll(mascota.color) : '-'}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-gray-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium uppercase">
                  Nacimiento
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {formatShortDate(
                    mascota.fecha_nacimiento ? mascota.fecha_nacimiento : '-'
                  )}
                </p>
              </div>
            </div>

            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-gray-100">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium uppercase">
                  Peso
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {mascota.peso ? `${mascota.peso} kg` : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Vacunas */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100/90 to-emerald-200/90">
            <Syringe className="size-5 text-emerald-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalVacunas}</p>
            <p className="-mt-0.5 text-sm font-medium text-gray-500">Vacunas</p>
          </div>
        </div>

        {/* Consultas */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-blue-200">
            <Stethoscope className="size-5 text-blue-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalConsultas}</p>
            <p className="-mt-0.5 text-sm font-medium text-gray-500">
              Consultas
            </p>
          </div>
        </div>

        {/* Cirugías */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-rose-100 to-rose-200">
            <Scissors className="size-5 text-rose-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalCirugias}</p>
            <p className="-mt-0.5 text-sm font-medium text-gray-500">
              Cirugías
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Historial medico */}
        <div className="space-y-4 lg:col-span-2">
          {/* Tratamiento activo */}
          {tratamientoActivo && (
            <div className="flex flex-col items-start gap-3 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow">
              <div className="pb-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Tratamiento Vigente
                </h3>
                <p className="text-rose-700">
                  {'Indicado el ' +
                    formatDate(tratamientoActivo.fecha) +
                    ' por ' +
                    tratamientoActivo.veterinario}
                  .
                </p>
              </div>
              <span className="w-full">
                <p className="text-foreground font-medium">
                  {tratamientoActivo.diagnostico}
                </p>
                <p className="text-muted-foreground text-sm">
                  {tratamientoActivo.tratamiento}
                </p>
                {tratamientoActivo.proximaVisita && (
                  <div className="mt-2 flex items-center gap-2 rounded-md bg-rose-100/50 p-2 text-sm text-rose-700">
                    <Calendar className="h-4 w-4" />
                    {'Próximo control: ' +
                      formatDate(tratamientoActivo.proximaVisita)}
                  </div>
                )}
              </span>
            </div>
          )}

          {/* Historial clínico (todos los registros) */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Historial Clínico
                </h3>
                <p className="text-sm text-gray-500">
                  Registro de atenciones y procedimientos
                </p>
              </div>
              <Link href="/admin/atenciones">
                <SecondaryButton className="gap-1.5 px-3.5 text-xs text-gray-600 hover:bg-gray-50">
                  Ver atenciones
                  <ChevronRight className="h-3 w-3" />
                </SecondaryButton>
              </Link>
            </div>

            <div className="space-y-3">
              {clinicHistory.length > 0 ? (
                clinicHistory.map((registro) => {
                  const TipoIcon =
                    tipoIcon[registro.tipo_atencion.toLowerCase()] ||
                    Stethoscope;
                  const colors =
                    tipoColors[registro.tipo_atencion.toLowerCase()] ||
                    tipoColors.consulta;

                  return (
                    <details
                      key={registro.id}
                      className="group overflow-hidden rounded-xl border border-gray-200/80 bg-white transition-colors select-none hover:border-gray-200"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                        <div className="flex min-w-0 items-center gap-4">
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.bg} ${colors.text}`}
                          >
                            <TipoIcon className="h-5 w-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-gray-900">
                              {registro.tipo_atencion.toLowerCase() ===
                              'operativo'
                                ? 'Operativo Sanitario'
                                : registro.tipo_atencion}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-medium text-gray-500 tabular-nums">
                                {formatShortDate(registro.fecha_atencion)}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 font-medium ${colors.bg} ${colors.text}`}
                              >
                                {tipoLabels[registro.tipo_atencion] ||
                                  registro.tipo_atencion}
                              </span>
                              <span className="text-gray-400">·</span>
                              <span className="font-medium text-gray-600">
                                {registro.veterinario}
                              </span>
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4 text-sm">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                              {registro.tipo_atencion.toLowerCase() ===
                              'operativo'
                                ? 'Procedimientos'
                                : 'Diagnóstico'}
                            </p>
                            <div className="mt-1 space-y-2">
                              {registro.tipo_atencion.toLowerCase() ===
                              'operativo' ? (
                                <div className="flex flex-wrap gap-2">
                                  {registro.procedimientos_aplicados ? (
                                    Object.entries(
                                      registro.procedimientos_aplicados
                                    )
                                      .filter(([_, value]) => value)
                                      .map(([key, _]) => {
                                        // Mapear nombres de keys a nombres legibles
                                        const nombresLegibles: Record<
                                          string,
                                          string
                                        > = {
                                          octuple: 'Óctuple',
                                          antirrabica: 'Antirrábica',
                                          verificacion: 'Verificación',
                                          triple_felina: 'Triple Felina',
                                          microchip_implantado:
                                            'Microchip Implantado',
                                          desparasitacion_externa:
                                            'Desparasitación Externa',
                                          desparasitacion_interna:
                                            'Desparasitación Interna',
                                        };
                                        return (
                                          <Badge
                                            key={key}
                                            className="border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 shadow-sm"
                                          >
                                            {nombresLegibles[key] || key}
                                          </Badge>
                                        );
                                      })
                                  ) : (
                                    <p className="text-sm text-gray-500">
                                      Sin procedimientos registrados
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="font-medium text-gray-900">
                                  {'Sin diagnóstico registrado'}
                                </p>
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                              Tratamiento
                            </p>
                            <p className="mt-1 text-gray-700">
                              {registro.tratamiento ||
                                'Sin tratamiento registrado'}
                            </p>
                          </div>
                        </div>

                        {registro.proximaVisita && (
                          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-emerald-700">
                            <Calendar className="h-4 w-4" />
                            <p className="text-sm font-semibold">
                              Próximo control:{' '}
                              {formatDate(registro.proximaVisita)}
                            </p>
                          </div>
                        )}
                      </div>
                    </details>
                  );
                })
              ) : (
                <div className="py-6 text-center text-sm text-gray-500">
                  Sin registros clínicos todavía
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Proximas citas */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Próximas Citas
            </h3>
            {citasMascota.length > 0 ? (
              <div className="space-y-3">
                {citasMascota.map((cita) => (
                  <div
                    key={cita.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Badge className="border-gray-200">
                        {capitalize(cita.estado)}
                      </Badge>
                      <span className="text-xs font-medium text-gray-500 capitalize">
                        {cita.tipo}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        {capitalize(
                          new Date(cita.fecha).toLocaleDateString('es-CL', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        )}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      <span>{cita.hora + ' hrs'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">
                Sin citas pendientes
              </div>
            )}
            <Link href="/admin/citas">
              <Button className="mt-4 w-full gap-2 bg-emerald-600 text-white hover:bg-emerald-700">
                <Calendar className="h-4 w-4" />
                Gestionar citas
              </Button>
            </Link>
          </div>

          {/* Acciones rapidas */}
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Acciones Rápidas
            </h3>
            <div className="flex flex-col space-y-2">
              <Link href="/admin/atenciones">
                <SecondaryButton className="w-full justify-start gap-2 border-gray-200 px-3 hover:bg-gray-50 hover:text-gray-900">
                  <Stethoscope className="h-4 w-4 text-gray-500" />
                  Ver atenciones
                </SecondaryButton>
              </Link>
              {!mascota.microchip && (
                <Link href="/admin/propietarios">
                  <SecondaryButton className="w-full justify-start gap-2 border-gray-200 px-3 hover:bg-gray-50 hover:text-gray-900">
                    <Cpu className="h-4 w-4 text-gray-500" />
                    Registrar microchip
                  </SecondaryButton>
                </Link>
              )}
              {!mascota.esterilizado && (
                <Link href="/admin/citas">
                  <SecondaryButton className="w-full justify-start gap-2 border-gray-200 px-3 hover:bg-gray-50 hover:text-gray-900">
                    <Shield className="h-4 w-4 text-gray-500" />
                    Agendar esterilización
                  </SecondaryButton>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
