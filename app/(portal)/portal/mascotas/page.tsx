'use client';

export const dynamic = 'force-dynamic';

import {
  PawPrint,
  Plus,
  Calendar,
  CheckCircle,
  ChevronRight,
  AlarmClock,
  AlarmClockOff,
} from 'lucide-react';
import {
  citas,
  especieIcon,
  historialClinico,
  mascotas,
} from '@/app/_lib/mock-data';
import { capitalize } from '@/app/_lib/utils/format';
import { useSession } from 'next-auth/react';
import { BaseLink, BaseMutedLink } from '@/app/ui/components/Link';

export function calcularEdad(fechaNacimiento: string) {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  const diff = hoy.getTime() - nacimiento.getTime();
  const años = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const meses = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30)
  );
  if (años === 0) {
    return `${meses} meses`;
  }
  return `${años} año${años > 1 ? 's' : ''}`;
}

export default function MascotasPage() {
  const { data: session } = useSession();

  return (
    <div className="h-full space-y-6 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-lg font-bold">Mis Mascotas</h2>
          <p className="text-muted-foreground text-sm">
            Gestiona el perfil de tus mascotas registradas
          </p>
        </div>
        <BaseLink href="/portal/mascotas/registro">
          <Plus className="h-4 w-4" />
          Registrar Mascota
        </BaseLink>
      </div>

      {/* Pet Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {mascotas.map((mascota) => {
          const Icon = especieIcon[mascota.especie];
          const citasPendientes = citas.filter(
            (c) =>
              c.mascotaId === mascota.id &&
              (c.estado === 'pendiente' || c.estado === 'confirmada')
          );
          const ultimoHistorial = historialClinico
            .filter((h) => h.mascotaId === mascota.id)
            .sort(
              (a, b) =>
                new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
            )[0];

          return (
            <div
              key={mascota.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all hover:shadow-md"
            >
              {/* Header con estado */}
              <div className="border-b border-gray-50 bg-gray-50/50 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {citasPendientes.length > 0 ? (
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <CheckCircle className="h-4 w-4 fill-emerald-600 text-white" />
                        <span className="text-xs font-semibold">
                          Cita agendada
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <CheckCircle className="h-4 w-4 fill-gray-400 text-white" />
                        <span className="text-xs font-medium">
                          Sin pendientes
                        </span>
                      </div>
                    )}
                  </div>
                  {/* Badges */}
                  <div className="flex gap-1.5">
                    {mascota.esterilizado ? (
                      <span className="h-5s inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-600/10 ring-inset">
                        Esterilizado
                      </span>
                    ) : (
                      <span className="h-5s inline-flex items-center rounded-full bg-gray-50 px-2 text-[10px] font-medium text-gray-700 ring-1 ring-gray-600/10 ring-inset">
                        Sin Esterilizar
                      </span>
                    )}
                    {mascota.chip ? (
                      <span className="py-0.5s inline-flex h-5 items-center rounded-full bg-blue-50 px-2 text-[10px] font-medium text-blue-700 ring-1 ring-blue-600/10 ring-inset">
                        Con Chip
                      </span>
                    ) : (
                      <span className="inline-flex h-5 items-center rounded-full bg-gray-50 px-2 text-[10px] font-medium text-gray-700 ring-1 ring-gray-600/10 ring-inset">
                        Sin Chip
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Contenido Principal */}
              <div className="flex flex-1 flex-col justify-between px-6 pt-6 pb-6">
                <div>
                  <div className="mb-6 flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
                      <Icon className="h-8 w-8 text-gray-600" />
                    </div>

                    {/* Info Principal */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {mascota.nombre}
                      </h3>
                      <p className="text-sm font-medium text-gray-500">
                        {mascota.raza}
                      </p>
                      <p className="text-xs text-gray-400">
                        {calcularEdad(mascota.fechaNacimiento)}
                      </p>
                    </div>
                  </div>

                  {/* Detalles Grid */}
                  <div className="mb-6 grid grid-cols-2 gap-y-4 rounded-xl bg-gray-50 p-4">
                    <div>
                      <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        SEXO
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-700 capitalize">
                        {mascota.sexo}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                        COLOR
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-gray-700">
                        {mascota.color}
                      </p>
                    </div>
                    {citasPendientes.length > 0 ? (
                      <div className="col-span-2 border-t border-gray-200 pt-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100/60 text-blue-600">
                            <AlarmClock className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                              PRÓXIMA CITA
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {capitalize(
                                new Date(
                                  citasPendientes[0].fecha
                                ).toLocaleDateString('es-CL', {
                                  weekday: 'long',
                                  day: 'numeric',
                                  month: 'long',
                                })
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {citasPendientes[0].hora} hrs
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="col-span-2 border-t border-gray-200 pt-3">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100/60 text-slate-600">
                            <AlarmClockOff className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                              SIN PENDIENTES
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              Sin citas pendientes
                            </p>
                            <p className="text-xs text-gray-500">--:--</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <BaseMutedLink
                    href={`/portal/mascotas/${mascota.id}`}
                    className="w-full"
                  >
                    Ver perfil
                    <ChevronRight className="h-4 w-4" />
                  </BaseMutedLink>

                  <BaseMutedLink href={`/portal/citas/nueva/${mascota.id}`}>
                    <Calendar className="h-4 w-4" />
                  </BaseMutedLink>
                </div>
              </div>
            </div>
            // </div>
          );
        })}
      </div>

      {/* Empty State */}
      {mascotas.length === 0 && (
        <div className="flex flex-col gap-6 rounded-xl border border-slate-200 bg-white py-6 text-gray-600 shadow-md">
          <div className="bg-muted mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
            <PawPrint className="text-muted-foreground h-8 w-8" />
          </div>
          <h3 className="text-foreground mb-2 text-lg font-medium">
            No tienes mascotas registradas
          </h3>
          <p className="text-muted-foreground mb-6">
            Registra a tu primera mascota para comenzar a gestionar sus citas y
            historial médico.
          </p>

          <BaseLink href="/portal/mascotas/registro">
            <Plus className="h-4 w-4" />
            Registrar mi primera cita
          </BaseLink>
        </div>
      )}
    </div>
  );
}
