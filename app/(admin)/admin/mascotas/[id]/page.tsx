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
  User,
  Phone,
  FileText,
  Plus,
  History,
  Tag,
} from 'lucide-react';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import {
  citas,
  especieIcon,
  tipoColors,
  tipoIcon,
  tipoLabels,
} from '@/app/_lib/mock-data';
import Badge from '@/app/ui/components/Badge';
import {
  capitalize,
  capitalizeAll,
  formatDate,
  formatPhone,
  formatShortDate,
} from '@/app/_lib/utils/format';
import { BaseLink, BaseMutedLink } from '@/app/ui/components/Link';
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

  const citasMascota = citas.filter(
    (c) =>
      c.mascotaId === mascota.id &&
      (c.estado === 'pendiente' || c.estado === 'confirmada')
  );

  // Stats + tratamiento activo
  const totalConsultas = clinicHistory.filter(
    (h) => h.tipo_atencion === 'CONSULTA_MEDICA'
  ).length;
  const totalVacunas = clinicHistory.filter(
    (h) => h.tipo_atencion === 'OPERATIVO_SANITARIO'
  ).length;
  const totalCirugias = clinicHistory.filter(
    (h) => h.tipo_atencion === 'OPERATIVO_ESTERILIZACION'
  ).length;

  // Tratamiento vigente: la consulta medica mas reciente que tenga tratamiento NO VACIO
  // Revisar para definir bien como se establece un tratamiento activo
  const tratamientoActivo = [...clinicHistory]
    .filter(
      (h) =>
        h.tipo_atencion === 'CONSULTA_MEDICA' &&
        h.tratamiento &&
        h.tratamiento.trim().length > 0
    )
    .sort(
      (a, b) =>
        new Date(b.fecha_atencion).getTime() -
        new Date(a.fecha_atencion).getTime()
    )[0];

  return (
    <div className="min-h-full bg-gray-50/50 p-6 lg:p-8">
      {/* Breadcrumb y volver */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/mascotas"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a mascotas
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
            {mascota.id}
          </span>
        </div>
      </div>

      {/* Header Card */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="p-7">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
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
                    <span className="font-semibold text-gray-800">
                      {capitalizeAll(mascota.nombre_propietario)}
                    </span>
                  </p>
                </div>
                <Button className="gap-2 shadow-md transition-all hover:shadow-lg">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {/* Badges */}
                {/* Estado esterilizacion */}
                {mascota.esterilizado ? (
                  <Badge className="border-emerald-200 bg-emerald-50 px-3 text-emerald-700 shadow-sm">
                    <span className="flex items-center gap-1">
                      Esterilizado
                    </span>
                  </Badge>
                ) : mascota.esterilizado === null ? (
                  <Badge className="border-gray-200 bg-gray-50 px-3 py-1 text-gray-500 shadow-sm">
                    Esterilizado: No especificado
                  </Badge>
                ) : (
                  <Badge className="border-rose-200 bg-rose-50 px-3 py-1 text-rose-500 shadow-sm">
                    <span className="flex items-center gap-1">
                      Sin esterilizar
                    </span>
                  </Badge>
                )}
                {/* Microchip */}
                {mascota.microchip ? (
                  <Badge className="border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 shadow-sm">
                    <span className="flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5" />
                      {mascota.microchip}
                    </span>
                  </Badge>
                ) : mascota.microchip === null ? (
                  <Badge className="border-gray-200 bg-gray-50 px-3 py-1 text-gray-500 shadow-sm">
                    Microchip: No especificado
                  </Badge>
                ) : (
                  <Badge className="border-gray-200 bg-gray-50 px-3 py-1 text-gray-500 shadow-sm">
                    <span className="flex items-center gap-1">
                      Sin microchip
                    </span>
                  </Badge>
                )}
                {/* Sexo */}
                {mascota.sexo ? (
                  <Badge className="border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 shadow-sm">
                    {capitalize(mascota.sexo)}
                  </Badge>
                ) : (
                  <Badge className="border-gray-200 bg-gray-50 px-3 py-1 text-gray-500 shadow-sm">
                    Sexo: No especificado
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Info grid mascota */}
          <div className="mt-4 grid grid-cols-2 gap-5 border-t border-slate-100 pt-4 sm:grid-cols-3 lg:grid-cols-4">
            {/* Especie */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <PawPrint className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Especie
                </p>
                <p className="truncate text-sm font-bold text-gray-800">
                  {capitalize(mascota.especie)}
                </p>
              </div>
            </div>

            {/* Color + Patron */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50 sm:col-span-2 lg:col-span-1">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <Palette className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Color y Pelaje
                </p>
                <p className="truncate text-sm font-bold text-gray-800">
                  {mascota.color
                    ? capitalizeAll(mascota.color)
                    : 'Sin color registrado'}
                </p>
                {/* Solo se renderiza si existe */}
                {mascota.patron && mascota.patron.trim().length > 0 && (
                  <p className="truncate text-xs font-medium text-slate-500">
                    {capitalize(mascota.patron)}
                  </p>
                )}
              </div>
            </div>

            {/* Nacimiento */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <Calendar className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Nacimiento
                </p>
                <p className="truncate text-sm font-bold text-gray-800 tabular-nums">
                  {formatShortDate(
                    mascota.fecha_nacimiento ? mascota.fecha_nacimiento : '-'
                  )}
                </p>
              </div>
            </div>

            {/* Peso */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <HeartPulse className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Último peso
                </p>
                <p className="truncate text-sm font-bold text-gray-800 tabular-nums">
                  {mascota.peso != null
                    ? `${Number(mascota.peso).toFixed(2)} kg`
                    : 'Sin pesaje aún'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Propietario */}
      <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">
              Propietario
            </h3>
            <p className="text-sm text-gray-500">
              Información de contacto del dueño
            </p>
          </div>
          <Link href={`/admin/propietarios/${mascota.propietario_id || ''}`}>
            <SecondaryButton className="gap-2 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow">
              Ver perfil completo
              <ChevronRight className="h-3 w-3" />
            </SecondaryButton>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
              <User className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Nombre completo
              </p>
              <p className="font-bold text-gray-900">
                {capitalizeAll(mascota.nombre_propietario)}
              </p>
            </div>
          </div>

          <div className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
              <Phone className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Teléfono
              </p>
              <p className="font-bold text-gray-900 tabular-nums">
                {formatPhone(mascota.telefono) || 'No registrado'}
              </p>
            </div>
          </div>

          {mascota.correo && (
            <div className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50 sm:col-span-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <svg
                  className="h-5 w-5"
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
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                  Email
                </p>
                <p className="font-bold text-gray-900">{mascota.correo}</p>
              </div>
            </div>
          )}
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
        {/* Columna principal */}
        {/* Historial medico */}
        <div className="space-y-4 lg:col-span-2">
          {/* Tratamiento activo (última CONSULTA_MEDICA con tratamiento NO vacío) */}
          {tratamientoActivo && (
            <div className="flex flex-col items-start gap-3 rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow">
              <div className="flex w-full flex-wrap items-center justify-between gap-3 pb-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    Último Tratamiento Indicado
                  </h3>
                  <p className="text-sm text-gray-600">
                    {'Indicado el ' +
                      formatDate(tratamientoActivo.fecha_atencion) +
                      ' · por ' +
                      tratamientoActivo.veterinario +
                      '.'}
                  </p>
                </div>
                {tratamientoActivo.peso_actual != null && (
                  <Badge className="border-slate-200 bg-slate-50 px-3 py-1 text-slate-700 tabular-nums shadow-sm">
                    {Number(tratamientoActivo.peso_actual).toFixed(2)} kg
                  </Badge>
                )}
              </div>
              <span className="w-full space-y-2">
                {tratamientoActivo.pre_dx && (
                  <div>
                    <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                      Diagnóstico presuntivo
                    </p>
                    <p className="text-foreground mt-0.5 font-medium">
                      {tratamientoActivo.pre_dx}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                    Tratamiento
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-sm whitespace-pre-line">
                    {tratamientoActivo.tratamiento}
                  </p>
                </div>
              </span>
            </div>
          )}

          {/* Historial clínico (todos los registros) */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
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
                <SecondaryButton className="gap-2 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow">
                  Ver atenciones
                  <ChevronRight className="h-3 w-3" />
                </SecondaryButton>
              </Link>
            </div>

            <div className="space-y-1.5">
              {clinicHistory.length > 0 ? (
                clinicHistory.map((registro) => {
                  const tipoKey = registro.tipo_atencion.toLowerCase();
                  const TipoIcon = tipoIcon[tipoKey] || Stethoscope;
                  const colors = tipoColors[tipoKey] || tipoColors.consulta;
                  const isConsulta =
                    registro.tipo_atencion === 'CONSULTA_MEDICA';
                  const isEsterilizacion =
                    registro.tipo_atencion === 'OPERATIVO_ESTERILIZACION';
                  const isSanitario =
                    registro.tipo_atencion === 'OPERATIVO_SANITARIO';

                  return (
                    <details
                      key={registro.id}
                      className="group overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition-colors select-none hover:border-gray-200"
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
                              {tipoLabels[tipoKey] || registro.tipo_atencion}
                            </p>
                            <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                              <span className="font-medium text-gray-500 tabular-nums">
                                {formatShortDate(registro.fecha_atencion)}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 font-medium ${colors.bg} ${colors.text}`}
                              >
                                {tipoLabels[tipoKey] || registro.tipo_atencion}
                              </span>
                              <span className="text-gray-400">·</span>
                              <span className="font-medium text-gray-600">
                                {registro.veterinario}
                              </span>
                              {registro.peso_actual != null && (
                                <>
                                  <span className="text-gray-400">·</span>
                                  <span className="font-medium text-slate-600 tabular-nums">
                                    {Number(registro.peso_actual).toFixed(2)} kg
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                      </summary>

                      <div className="border-t border-gray-100 bg-gray-50/50 px-4 py-4 text-sm">
                        {/* Consultas Medicas */}
                        {isConsulta && (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Motivo consulta
                              </p>
                              <p className="mt-0.5 font-medium text-gray-900">
                                {registro.motivo || 'Sin motivo registrado'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Diagnóstico presuntivo
                              </p>
                              <p className="mt-0.5 font-medium text-gray-900">
                                {registro.pre_dx ||
                                  'Sin diagnóstico registrado'}
                              </p>
                            </div>

                            <div className="sm:col-span-2">
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Anamnesis
                              </p>
                              <p className="mt-0.5 whitespace-pre-line text-gray-700">
                                {registro.anamnesis ||
                                  'Sin antecedentes registrados'}
                              </p>
                            </div>

                            {registro.examen_fisico && (
                              <div className="sm:col-span-2">
                                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                  Examen físico
                                </p>
                                <p className="mt-0.5 whitespace-pre-line text-gray-700">
                                  {registro.examen_fisico}
                                </p>
                              </div>
                            )}

                            {registro.examenes_solicitados && (
                              <div className="sm:col-span-2">
                                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                  Exámenes solicitados
                                </p>
                                <p className="mt-0.5 whitespace-pre-line text-gray-700">
                                  {registro.examenes_solicitados}
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Tratamiento indicado
                              </p>
                              <p className="mt-0.5 whitespace-pre-line text-gray-700">
                                {registro.tratamiento ||
                                  'Sin tratamiento registrado'}
                              </p>
                            </div>

                            <div className="space-y-2">
                              {registro.derivacion_clinica_privada && (
                                <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                                  <FileText className="h-4 w-4" />
                                  <p className="text-xs font-semibold">
                                    Derivado a especialista
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Operativos Esterilizacion */}
                        {isEsterilizacion && (
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Resultado cirugía
                              </p>
                              <div className="mt-1">
                                {registro.resultado_esterilizacion ? (
                                  <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 shadow-sm">
                                    {capitalize(
                                      registro.resultado_esterilizacion
                                    )}
                                  </Badge>
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Sin resultado registrado
                                  </p>
                                )}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Tratamiento post-operatorio
                              </p>
                              <p className="mt-0.5 whitespace-pre-line text-gray-700">
                                {registro.tratamiento ||
                                  'Sin indicaciones registradas'}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Operativos Sanitarios */}
                        {isSanitario && (
                          <div className="space-y-3">
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Procedimientos aplicados
                              </p>
                              <div className="mt-2 flex flex-wrap gap-2">
                                {registro.procedimientos_aplicados &&
                                registro.procedimientos_aplicados.length > 0 ? (
                                  registro.procedimientos_aplicados.map(
                                    (proc) => (
                                      <Badge
                                        key={`${proc.codigo}-${proc.nombre}`}
                                        className="border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-800/90 shadow-sm"
                                      >
                                        {proc.nombre}
                                      </Badge>
                                    )
                                  )
                                ) : (
                                  <p className="text-sm text-gray-500">
                                    Sin procedimientos registrados en este
                                    operativo
                                  </p>
                                )}
                              </div>
                            </div>

                            {registro.tratamiento && (
                              <div>
                                <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                  Observaciones / indicaciones
                                </p>
                                <p className="mt-0.5 whitespace-pre-line text-gray-700">
                                  {registro.tratamiento}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Fallback atencion de tipo desconocido */}
                        {!isConsulta && !isEsterilizacion && !isSanitario && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Detalle
                              </p>
                              <p className="mt-0.5 text-gray-700">
                                Tipo de atención {registro.tipo_atencion} — sin
                                campos específicos renderizados.
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                                Notas
                              </p>
                              <p className="mt-0.5 whitespace-pre-line text-gray-700">
                                {registro.tratamiento ||
                                  'Sin información adicional'}
                              </p>
                            </div>
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

        {/* Sidebar administrativo */}
        <div className="space-y-4">
          {/* Acciones administrativas */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <FileText className="h-5 w-5 text-emerald-600" />
              Acciones Administrativas
            </h3>
            <div className="flex flex-col space-y-2">
              <BaseMutedLink
                href={`/admin/mascotas/${id}/nueva-atencion`}
                className="w-full justify-start gap-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900"
              >
                <Plus className="h-4 w-4 text-gray-500" />
                Registrar nueva atención
              </BaseMutedLink>
              <Link href="#">
                <SecondaryButton className="w-full justify-start gap-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                  <Pencil className="h-4 w-4 text-gray-500" />
                  Editar mascota
                </SecondaryButton>
              </Link>
              <Link href="/admin/citas">
                <SecondaryButton className="w-full justify-start gap-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  Agendar cita
                </SecondaryButton>
              </Link>
              <Link href="#">
                <SecondaryButton className="w-full justify-start gap-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                  <History className="h-4 w-4 text-gray-500" />
                  Ver historial de cambios
                </SecondaryButton>
              </Link>
            </div>
          </div>

          {/* Proximas citas */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Calendar className="h-5 w-5 text-blue-600" />
                Próximas Citas
              </h3>
            </div>
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
              <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>No hay citas agendadas</span>
                </div>
              </div>
            )}
            <Link href="/admin/citas">
              <Button className="mt-4 w-full">
                <Calendar className="h-4 w-4" />
                Gestionar citas
              </Button>
            </Link>
          </div>

          {/* Estado y detalles rápidos */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <Tag className="h-5 w-5 text-purple-600" />
              Detalles Administrativos
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Estado vital</span>
                <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  Activo
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Microchip</span>
                <Badge className="border-slate-200 bg-slate-50 text-slate-600">
                  {mascota.microchip
                    ? 'Implantado'
                    : mascota.microchip === null
                      ? 'No especificado'
                      : 'Sin microchip'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Registro nacional</span>
                <Badge className="border-gray-200 bg-blue-50 text-blue-700">
                  Registrado
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
