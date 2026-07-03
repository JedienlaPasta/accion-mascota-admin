'use client';
import { citas, especieIcon, mascotas } from '@/app/_lib/mock-data';
import { capitalize } from '@/app/_lib/utils/format';
import Badge from '@/app/ui/components/Badge';
import { SecondaryButton } from '@/app/ui/components/Button';
import { BaseLink } from '@/app/ui/components/Link';
import { Calendar, CheckCircle, Clock, Plus, Stethoscope } from 'lucide-react';

export default function Citas() {
  // Filter and sort appointments
  const pendingAppointments = citas
    .filter((c) => c.estado === 'pendiente' || c.estado === 'confirmada')
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

  const pastAppointments = citas
    .filter(
      (c) =>
        c.estado === 'completada' ||
        c.estado === 'cancelada' ||
        c.estado === 'pendiente'
    )
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

  const getPetName = (id: string) => {
    return mascotas.find((mascota) => mascota.id === id)?.nombre || 'Mascota';
  };

  const getPetEspecie = (id: string) => {
    return mascotas.find((mascota) => mascota.id === id)?.especie;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmada':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pendiente':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'completada':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelada':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="h-full space-y-6 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-foreground text-lg font-bold">Mis Citas</h2>
          <p className="text-muted-foreground text-sm">
            Revisa tus próximas visitas y el historial de atenciones.
          </p>
        </div>
        <BaseLink href="/portal/citas/nueva">
          <Plus className="size-4" />
          Nueva Cita
        </BaseLink>
      </div>

      {/* Upcoming Appointments */}
      <div className="mb-10 space-y-6">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">Citas Agendadas</h2>
        </div>

        {pendingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pendingAppointments.map((cita) => {
              const especie = getPetEspecie(cita.mascotaId);
              const Icon = especieIcon[especie || 'otro'];
              return (
                <div
                  key={cita.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
                >
                  <div className="translate-y--8 absolute top-0 right-0 h-24 w-24 translate-x-8 rounded-full bg-emerald-50/50 blur-2xl transition-all group-hover:bg-emerald-100/50" />

                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
                          <Icon className="h-8 w-8 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">
                            Paciente
                          </p>
                          <h3 className="text-lg font-bold text-gray-900">
                            {getPetName(cita.mascotaId)}
                          </h3>
                        </div>
                      </div>
                      <Badge className={getStatusColor(cita.estado)}>
                        {capitalize(cita.estado)}
                      </Badge>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Fecha
                          </p>
                          <p className="text-sm font-semibold">
                            {capitalize(
                              new Date(cita.fecha).toLocaleDateString('es-CL', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                          <Clock className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Hora
                          </p>
                          <p className="text-sm font-semibold">
                            {cita.hora} hrs
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                          <Stethoscope className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Motivo
                          </p>
                          <p className="text-sm font-semibold capitalize">
                            {cita.tipo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3 border-t border-gray-100 pt-4">
                    <SecondaryButton className="w-full justify-center border-gray-200 text-gray-600 hover:border-zinc-200/50">
                      Cancelar
                    </SecondaryButton>
                    <SecondaryButton className="w-full justify-center border-gray-700! bg-gray-950 text-white hover:bg-gray-900">
                      Reagendar
                    </SecondaryButton>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
              <CheckCircle className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No tienes citas pendientes
            </h3>
            <p className="max-w-sm text-sm text-gray-500">
              ¡Excelente! Tus mascotas están al día. Si necesitas agendar una
              nueva visita, usa el botón superior.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
