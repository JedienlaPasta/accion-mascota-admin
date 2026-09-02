import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Heart,
  Home,
  Mail,
  MapPin,
  Pencil,
  PawPrint,
  Phone,
  Plus,
  Ruler,
  User,
  UserCheck,
  XCircle,
  Microchip,
} from 'lucide-react';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import Badge from '@/app/ui/components/Badge';
import {
  capitalize,
  capitalizeAll,
  formatPhone,
  formatRUT,
  formatShortDate,
} from '@/app/_lib/utils/format';
import { BaseLink } from '@/app/ui/components/Link';
import {
  getOwnerDetailsById,
  getPetsByOwnerId,
} from '@/app/_lib/data/propietarios';
import { validateMicrochip } from '@/app/_lib/utils/check-values';
import { getAge } from '@/app/_lib/utils/get-values';
import { citas } from '@/app/_lib/mock-data';

type PropietarioDetalleProps = {
  params: Promise<{ id: string }>;
};

export default async function PropietarioDetallePage(
  props: PropietarioDetalleProps
) {
  const { id } = await props.params;
  const propietario = await getOwnerDetailsById(id);
  const mascotas = await getPetsByOwnerId(id);

  if (!propietario) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <User className="text-muted-foreground -mt-40 mb-4 h-16 w-16" />
        <h2 className="text-foreground mb-2 text-xl font-semibold">
          Propietario no encontrado
        </h2>
        <p className="text-muted-foreground mb-4">
          No se encontró un propietario con el ID proporcionado.
        </p>
        <BaseLink href="/admin/propietarios">
          <ArrowLeft className="h-4 w-4" />
          Volver a propietarios
        </BaseLink>
      </div>
    );
  }

  const emailPrincipal =
    propietario.correo_personal || propietario.correo_contacto || '';
  const tieneCuentaPortal = Boolean(propietario.correo_personal?.trim());
  const totalMascotas = propietario.total_mascotas || mascotas.length || 0;

  const getInitials = (name: string): string => {
    const words = name.trim().split(/\s+/);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Próximas citas para cualquiera de sus mascotas
  const mascotasIds = mascotas.map((m) => m.id);
  const proximasCitas = citas
    .filter((c) => mascotasIds.includes(c.mascotaId))
    .filter((c) => c.estado === 'pendiente' || c.estado === 'confirmada')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
    .slice(0, 4);

  return (
    <div className="min-h-full bg-gray-50/50 p-6 lg:p-8">
      {/* Breadcrumb y volver */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/admin/propietarios"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a propietarios
        </Link>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-xs text-gray-500">
            {propietario.id}
          </span>
        </div>
      </div>

      {/* Header Card */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="p-7">
          <div className="flex flex-col items-start gap-6 sm:flex-row">
            {/* Avatar con iniciales del propietario */}
            <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-indigo-100/50 to-violet-100/50 shadow-sm shadow-gray-200">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-indigo-500/10 to-violet-500/10"></div>
              <span className="relative text-4xl font-black tracking-tight text-indigo-700">
                {getInitials(propietario.nombre_propietario)}
              </span>
            </div>

            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
                      {capitalizeAll(propietario.nombre_propietario)}
                    </h1>
                  </div>
                  <p className="text-muted-foreground flex flex-wrap items-center gap-2 text-base">
                    <span className="font-mono text-sm font-semibold text-gray-700">
                      {formatRUT(propietario.rut)}
                    </span>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm font-medium text-gray-500">
                      {totalMascotas} mascota{totalMascotas === 1 ? '' : 's'}
                    </span>
                    {propietario.comuna && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="text-sm font-medium text-gray-600">
                          {capitalizeAll(propietario.comuna)}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <Button className="gap-2 shadow-md transition-all hover:shadow-lg">
                  <Pencil className="h-4 w-4" />
                  Editar
                </Button>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {/* Estado cuenta portal */}
                {tieneCuentaPortal ? (
                  <Badge className="bg-emerald-50 px-3 text-emerald-700 shadow-sm ring-emerald-200">
                    <span className="flex items-center gap-1">
                      <UserCheck className="h-3.5 w-3.5" />
                      Usuario registrado
                    </span>
                  </Badge>
                ) : (
                  <Badge className="bg-gray-50 px-3 py-1 text-gray-500 shadow-sm ring-gray-200">
                    <span className="flex items-center gap-1">
                      <XCircle className="h-3.5 w-3.5" />
                      Sin cuenta en portal
                    </span>
                  </Badge>
                )}

                {/* RSH si existe */}
                {propietario.rsh ? (
                  <Badge className="bg-sky-50 px-3 text-sky-700 shadow-sm ring-sky-200">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      RSH N° {propietario.rsh}
                    </span>
                  </Badge>
                ) : null}

                {/* Profesión si existe */}
                {propietario.profesion ? (
                  <Badge className="bg-slate-50 px-3 py-1 text-slate-700 shadow-sm ring-slate-200">
                    {capitalizeAll(propietario.profesion)}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>

          {/* Info grid principal 4 tarjetas */}
          <div className="mt-4 grid grid-cols-2 gap-5 border-t border-slate-100 pt-4 sm:grid-cols-4">
            {/* Teléfono */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-emerald-100/90 to-emerald-200/90 text-emerald-700 transition-all group-hover:scale-105">
                <Phone className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Teléfono
                </p>
                <p
                  className="truncate text-sm font-bold text-gray-800 tabular-nums"
                  title={propietario.telefono || 'No registrado'}
                >
                  {propietario.telefono
                    ? formatPhone(propietario.telefono)
                    : 'No registrado'}
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-sky-100 to-sky-200 text-sky-700 transition-all group-hover:scale-105">
                <Mail className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Email
                </p>
                <p
                  className="truncate text-sm font-bold text-gray-800"
                  title={emailPrincipal || 'No registrado'}
                >
                  {emailPrincipal || 'No registrado'}
                </p>
              </div>
            </div>

            {/* Nacimiento / Edad */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-violet-100 to-violet-200 text-violet-700 transition-all group-hover:scale-105">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Nacimiento
                </p>
                <p
                  className="text-sm font-bold text-gray-800 tabular-nums"
                  title={propietario.fecha_nacimiento || 'No registrado'}
                >
                  {propietario.fecha_nacimiento
                    ? formatShortDate(propietario.fecha_nacimiento)
                    : 'No registrado'}
                </p>
              </div>
            </div>

            {/* Registro creado */}
            <div className="group flex items-center gap-3 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-slate-100 to-slate-200 text-slate-700 transition-all group-hover:scale-105">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-muted-foreground text-[10px] font-medium tracking-wide uppercase">
                  Creado
                </p>
                <p
                  className="text-sm font-bold text-gray-800 tabular-nums"
                  title={propietario.creado_en || '-'}
                >
                  {propietario.creado_en
                    ? formatShortDate(propietario.creado_en)
                    : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección Dirección Completa */}
      <div className="mt-4 rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:shadow-md">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-gray-900">
              Domicilio
            </h3>
            <p className="text-sm text-gray-500">
              Dirección registrada en el sistema
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* Calle/Dirección */}
          <div className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50 sm:col-span-2">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-orange-100 to-orange-200 text-orange-700 transition-all group-hover:scale-105">
              <Home className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Dirección
              </p>
              <p
                className="truncate font-bold text-gray-900"
                title={capitalizeAll(propietario.direccion || '')}
              >
                {propietario.direccion
                  ? capitalizeAll(propietario.direccion)
                  : 'Sin dirección registrada'}
              </p>
            </div>
          </div>

          {/* Comuna */}
          <div className="group flex items-center gap-4 rounded-2xl bg-gray-50 p-4 transition-all hover:bg-slate-50">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-teal-100 to-teal-200 text-teal-700 transition-all group-hover:scale-105">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-0.5">
              <p className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Comuna / Región
              </p>
              <p
                className="truncate font-bold text-gray-900"
                title={[propietario.comuna, propietario.region]
                  .filter(Boolean)
                  .map((s) => capitalizeAll(String(s)))
                  .join(', ')}
              >
                {propietario.comuna
                  ? [propietario.comuna, propietario.region]
                      .filter(Boolean)
                      .map((s) => capitalizeAll(String(s)))
                      .join(', ')
                  : 'Sin ubicación'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total mascotas */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-100/90 to-indigo-200/90">
            <PawPrint className="size-5 text-indigo-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalMascotas}</p>
            <p className="-mt-0.5 text-sm font-medium text-gray-500">
              Mascotas a cargo
            </p>
          </div>
        </div>

        {/* Próximas citas */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-100 to-blue-200">
            <Calendar className="size-5 text-blue-700" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {proximasCitas.length}
            </p>
            <p className="-mt-0.5 text-sm font-medium text-gray-500">
              Próximas citas
            </p>
          </div>
        </div>

        {/* Estado verificación */}
        <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
          <div
            className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
              tieneCuentaPortal
                ? 'bg-linear-to-br from-emerald-100 to-emerald-200'
                : 'bg-linear-to-br from-slate-100 to-slate-200'
            }`}
          >
            <UserCheck
              className={`size-5 ${tieneCuentaPortal ? 'text-emerald-700' : 'text-slate-500'}`}
            />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {tieneCuentaPortal ? 'Activa' : 'Sin'}
            </p>
            <p className="-mt-0.5 text-sm font-medium text-gray-500">
              Cuenta portal
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Columna principal - Listado de mascotas */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <PawPrint className="h-5 w-5 text-indigo-600" />
                  Mascotas registradas
                </h3>
                <p className="text-sm text-gray-500">
                  {totalMascotas === 0
                    ? 'Este propietario aún no tiene mascotas registradas'
                    : `Mascotas asociadas a ${capitalize(propietario.nombre_propietario.split(' ')[0])}`}
                </p>
              </div>
              <Link href="/admin/mascotas">
                <SecondaryButton className="gap-2 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow">
                  Ver todas las mascotas
                  <ChevronRight className="h-3 w-3" />
                </SecondaryButton>
              </Link>
            </div>

            {mascotas.length > 0 ? (
              <div className="space-y-2">
                {mascotas.map((mascota) => {
                  const mcErrors = validateMicrochip(mascota.microchip);
                  const hasMcError = mcErrors.length > 0;
                  return (
                    <Link
                      key={mascota.id}
                      href={`/admin/mascotas/${mascota.id}`}
                      className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50/40 p-4 transition-all hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm"
                    >
                      {/* Avatar mini mascota */}
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-slate-100 to-zinc-200 shadow-sm">
                        <PawPrint className="size-6 text-slate-600" />
                      </div>
                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate font-semibold text-gray-900 transition-colors group-hover:text-indigo-700">
                            {capitalize(mascota.nombre_mascota)}
                          </p>
                          <Badge className="bg-slate-50 px-2 py-0.5 text-[10px] text-slate-600 ring-slate-200">
                            {capitalize(mascota.especie)}
                          </Badge>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Ruler className="h-3 w-3 text-gray-400" />
                            {capitalizeAll(mascota.raza) || 'Sin raza'}
                          </span>
                          <span className="flex items-center gap-1 tabular-nums">
                            <CalendarDays className="h-3 w-3 text-gray-400" />
                            {getAge(mascota.fecha_nacimiento)}
                          </span>
                          <span
                            className={`flex items-center gap-1 tabular-nums ${hasMcError ? 'text-rose-600' : ''}`}
                            title={
                              hasMcError
                                ? mcErrors[0]
                                : mascota.microchip || 'Sin microchip'
                            }
                          >
                            <Microchip
                              className={`h-3 w-3 ${hasMcError ? 'text-rose-500' : 'text-gray-400'}`}
                            />
                            {mascota.microchip || 'Sin microchip'}
                          </span>
                        </div>
                      </div>
                      {/* Estado esterilizado */}
                      <div className="hidden shrink-0 items-center gap-2 pr-2 sm:flex">
                        {mascota.esterilizado === null ? (
                          <Badge className="bg-slate-50 px-2 text-[11px] text-slate-500 ring-slate-200">
                            N/E
                          </Badge>
                        ) : mascota.esterilizado ? (
                          <Badge className="flex items-center gap-1 bg-emerald-50 px-2 text-[11px] text-emerald-700 ring-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Esterilizado
                          </Badge>
                        ) : (
                          <Badge className="flex items-center gap-1 bg-rose-50 px-2 text-[11px] text-rose-600 ring-rose-200">
                            <XCircle className="h-3 w-3" />
                            Sin esterilizar
                          </Badge>
                        )}
                      </div>
                      {/* Flecha */}
                      <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/40 p-10 text-center">
                <PawPrint className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                <p className="text-sm font-medium text-gray-600">
                  Sin mascotas registradas
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Puedes agregar una mascota nueva asociada a este propietario.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar derecho - acciones y citas */}
        <div className="space-y-4">
          {/* Acciones administrativas */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <FileText className="h-5 w-5 text-emerald-600" />
              Acciones Administrativas
            </h3>
            <div className="flex flex-col space-y-2">
              <Link href="#">
                <SecondaryButton className="w-full justify-start gap-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                  <Plus className="h-4 w-4 text-gray-500" />
                  Registrar nueva mascota
                </SecondaryButton>
              </Link>
              <Link href="#">
                <SecondaryButton className="w-full justify-start gap-2 border-gray-200 hover:bg-gray-50 hover:text-gray-900">
                  <Pencil className="h-4 w-4 text-gray-500" />
                  Editar propietario
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
                  <Mail className="h-4 w-4 text-gray-500" />
                  Enviar correo
                </SecondaryButton>
              </Link>
            </div>
          </div>

          {/* Próximas citas */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Calendar className="h-5 w-5 text-blue-600" />
                Próximas Citas
              </h3>
            </div>
            {proximasCitas.length > 0 ? (
              <div className="space-y-3">
                {proximasCitas.map((cita) => (
                  <div
                    key={cita.id}
                    className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:bg-gray-50"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <Badge className="ring-gray-200">
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

          {/* Detalles rápidos */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <UserCheck className="h-5 w-5 text-purple-600" />
              Detalles Administrativos
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Cuenta portal</span>
                {tieneCuentaPortal ? (
                  <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-200">
                    Registrado
                  </Badge>
                ) : (
                  <Badge className="bg-gray-50 text-gray-500 ring-gray-200">
                    Sin cuenta
                  </Badge>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email secundario</span>
                <span
                  className="max-w-[50%] truncate text-xs text-gray-500 tabular-nums"
                  title={propietario.correo_contacto || 'N/A'}
                >
                  {propietario.correo_contacto || 'N/A'}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">RUT formateado</span>
                <Badge className="bg-slate-50 text-slate-600 tabular-nums ring-slate-200">
                  {formatRUT(propietario.rut)}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">RSH</span>
                <Badge
                  className={`${
                    propietario.rsh
                      ? 'bg-sky-50 text-sky-700 ring-sky-200'
                      : 'bg-gray-50 text-gray-500 ring-gray-200'
                  }`}
                >
                  {propietario.rsh ? `N° ${propietario.rsh}` : 'No aplica'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
