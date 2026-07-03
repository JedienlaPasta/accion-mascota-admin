'use client';
import {
  especieIcon,
  historialClinico,
  mascotas,
  tipoColors,
  tipoIcon,
  tipoLabels,
} from '@/app/_lib/mock-data';
import { Calendar, Info } from 'lucide-react';
import { capitalize } from '@/app/_lib/utils/format';
import { useState } from 'react';
import HistoryListItem from '@/app/ui/portal/historial/HistoryListItem';
import HistoryDetail from '@/app/ui/portal/historial/HistoryDetail';

export const getPetName = (id: string) => {
  return mascotas.find((mascota) => mascota.id === id)?.nombre || 'Mascota';
};

const getPetEspecie = (id: string) => {
  return mascotas.find((mascota) => mascota.id === id)?.especie;
};

function getMonthYear(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-CL', {
    month: 'long',
    year: 'numeric',
  });
}

export default function HistorialClinicMascotas() {
  const [selectedPetId, setSelectedPetId] = useState('');
  const [activeRecord, setActiveRecord] = useState<
    (typeof historialClinico)[0] | null
  >(null);

  const filteredHistory = selectedPetId
    ? historialClinico.filter(
        (registro) => registro.mascotaId === selectedPetId
      )
    : historialClinico;

  const groupedByMonth = filteredHistory.reduce(
    (acc, registro) => {
      const monthKey = getMonthYear(registro.fecha);
      if (!acc[monthKey]) acc[monthKey] = [];
      acc[monthKey].push(registro);
      return acc;
    },
    {} as Record<string, typeof historialClinico>
  );

  return (
    <div className="relative h-full space-y-6 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div>
        <h2 className="text-foreground text-lg font-bold">Historial Clínico</h2>
        <p className="text-muted-foreground text-sm">
          Registro completo de atenciones de todas tus mascotas.
        </p>
      </div>

      {/* Pets List */}
      <div className="mb-10 space-y-6">
        {mascotas.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mascotas.map((mascota) => {
              const especie = getPetEspecie(mascota.id);
              const Icon = especieIcon[especie || 'otro'];
              return (
                <div
                  key={mascota.id}
                  className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                    selectedPetId === mascota.id
                      ? 'border-emerald-500 ring-1 ring-emerald-500'
                      : 'border-gray-100'
                  }`}
                  onClick={() =>
                    setSelectedPetId(
                      selectedPetId === mascota.id ? '' : mascota.id
                    )
                  }
                >
                  <div className="translate-y--8 absolute top-0 right-0 h-24 w-24 translate-x-8 rounded-full bg-emerald-50/50 blur-2xl transition-all group-hover:bg-emerald-100/50" />

                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
                          <Icon className="h-8 w-8 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {getPetName(mascota.id)}
                          </h3>
                          <p className="text-sm text-gray-500 capitalize">
                            {mascota.raza}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                          selectedPetId === mascota.id
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-transparent bg-transparent text-transparent'
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="size-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="space-y-3 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                            Última Visita
                          </p>
                          <p className="text-sm font-semibold">
                            {capitalize(
                              new Date(
                                mascota.fechaNacimiento
                              ).toLocaleDateString('es-CL', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                              })
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 py-12 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-100">
              <Info className="h-6 w-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No tienes mascotas registradas
            </h3>
            <p className="max-w-sm text-sm text-gray-500">
              Una vez que registres tu mascota, podrás ver su historial de citas
              y agendar nuevas visitas.
            </p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {Object.entries(groupedByMonth).map(([month, records]) => {
          return (
            <div key={month}>
              <div className="mb-4 flex items-center gap-3">
                <div className="bg-border/65 h-px flex-1" />
                <span className="text-muted-foreground px-2 text-sm font-medium capitalize">
                  {month}
                </span>
                <div className="bg-border/65 h-px flex-1" />
              </div>

              <div className="grid gap-4">
                {records.map((registro) => {
                  const TipoIcon = tipoIcon[registro.tipo];
                  const colors = tipoColors[registro.tipo];
                  const Icon =
                    especieIcon[
                      mascotas.find(
                        (mascota) => mascota.id === registro.mascotaId
                      )?.especie || 'otro'
                    ];
                  const label = tipoLabels[registro.tipo] || registro.tipo;

                  return (
                    <HistoryListItem
                      key={registro.id}
                      registro={registro}
                      label={label}
                      Icon={Icon}
                      TipoIcon={TipoIcon}
                      colors={colors}
                      petName={getPetName(registro.mascotaId)}
                      onClick={() => setActiveRecord(registro)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {activeRecord && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-60 bg-gray-800/70 transition-all"
            onClick={() => setActiveRecord(null)}
          />
          <HistoryDetail
            registro={activeRecord}
            label={tipoLabels[activeRecord.tipo] || activeRecord.tipo}
            Icon={
              especieIcon[
                mascotas.find((m) => m.id === activeRecord.mascotaId)
                  ?.especie || 'otro'
              ]
            }
            TipoIcon={tipoIcon[activeRecord.tipo]}
            colors={tipoColors[activeRecord.tipo]}
            petName={getPetName(activeRecord.mascotaId)}
            closeModal={() => setActiveRecord(null)}
          />
        </>
      )}
    </div>
  );
}
