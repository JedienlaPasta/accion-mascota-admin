'use client';
import { useState } from 'react';
import { especieIcon } from '@/app/_lib/mock-data';
import {
  Check,
  SearchX,
  RotateCcw,
  User2,
  Microchip,
  PawPrint,
  CheckCircle2,
  Loader,
} from 'lucide-react';
import { capitalize, capitalizeAll, formatRUT } from '@/app/_lib/utils/format';
import { Button } from '@/app/ui/components/Button';
import { PetSearchBar } from './PetSearchBar';
import { AppointmentPet } from '@/app/_lib/data-types/citas';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function PetSelection({
  pets,
  searchBy,
  selectedPetId,
  setSelectedPetId,
  onNext,
}: {
  pets: AppointmentPet[];
  searchBy: 'owner' | 'chip' | '';
  selectedPetId: string | null;
  setSelectedPetId: (petId: string | null) => void;
  onNext: () => void;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // valor URL
  const search = searchParams.get('query') ?? '';
  const [searchValue, setSearchValue] = useState(search);
  // Loading levantado desde PetSearchBar: true durante debounce + server response.
  const [isSearching, setIsSearching] = useState(false);

  const activeTab: 'owner' | 'chip' = searchBy === 'chip' ? 'chip' : 'owner';

  const resetQueryAndSetTab = (nextTab: 'owner' | 'chip') => {
    const params = new URLSearchParams(searchParams);
    setSearchValue('');
    params.delete('query');
    params.set('searchBy', nextTab);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const total = pets.length;
  const placeholder =
    activeTab === 'owner'
      ? 'Busca por nombre dueño, RUT o nombre mascota...'
      : 'Busca por número de microchip (ej: 956000012345678)';

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Busca una Mascota</h1>
        <p className="text-sm font-medium text-gray-500">
          Agenda la cita más rápido: busca primero por el dueño o por el
          microchip del paciente.
        </p>
      </div>

      {/* ===== Barra de búsqueda con TABS ===== */}
      <div className="space-y-2">
        <div className="inline-flex w-full rounded-xl border border-gray-200 bg-gray-50 p-1 text-xs font-semibold text-gray-500">
          <button
            type="button"
            onClick={() => resetQueryAndSetTab('owner')}
            className={`flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all ${
              activeTab === 'owner'
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-gray-200'
                : 'hover:text-gray-700'
            }`}
            aria-selected={activeTab === 'owner'}
            role="tab"
          >
            <span className="flex items-center justify-center gap-1.5">
              <User2 className="size-4" />
              Por Dueño
            </span>
          </button>
          <button
            type="button"
            onClick={() => resetQueryAndSetTab('chip')}
            className={`flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all ${
              activeTab === 'chip'
                ? 'bg-white text-emerald-700 shadow-sm ring-1 ring-gray-200'
                : 'hover:text-gray-700'
            }`}
            aria-selected={activeTab === 'chip'}
            role="tab"
          >
            <span className="flex items-center justify-center gap-1.5">
              <Microchip className="h-4 w-4" />
              Por Microchip
            </span>
          </button>
        </div>

        <PetSearchBar
          placeholder={placeholder}
          searchBy={searchBy}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          onLoadingChange={setIsSearching}
        />

        {/* Resumen de resultados */}
        <div className="relative flex items-center justify-between px-1 text-xs text-gray-500">
          <span>
            {searchValue.trim() ? (
              <>
                {total > 0 ? (
                  <>
                    <span className="font-semibold text-gray-700">
                      {total} resultado{total === 1 ? '' : 's'}
                    </span>{' '}
                    para{' '}
                    <span className="font-mono font-semibold">
                      “{searchValue.trim()}”
                    </span>
                  </>
                ) : (
                  <>
                    {isSearching ? (
                      <>Buscando coincidencias…</>
                    ) : (
                      <>Sin coincidencias</>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                Mostrando{' '}
                <span className="font-semibold text-gray-700">
                  {total} mascota{total === 1 ? '' : 's'}
                </span>{' '}
                totales
              </>
            )}
          </span>
          {activeTab === 'chip' && (
            <span className="absolute top-0 right-0 inline-flex items-center gap-1 rounded-md bg-gray-50 px-2 py-0.5 font-mono text-[10px] text-gray-400 ring-1 ring-gray-200">
              ej: 9560 0000 1234 5678
            </span>
          )}
        </div>
      </div>

      {/* ===== Listado de mascotas ===== */}
      <div className="relative">
        {/* Stripe de carga mientras pensamos (debounce + server). */}
        {isSearching && (
          <div className="pointer-events-none z-10 mb-2 flex w-full items-center justify-end gap-2">
            <Loader className="animate-loadspin size-3.5 text-blue-500" />
            <span className="text-[11px] font-semibold tracking-wide text-blue-600 uppercase">
              Buscando coincidencias…
            </span>
          </div>
        )}
        <div
          className={`grid gap-3 transition-opacity duration-200 ${isSearching ? 'pointer-events-none opacity-60 select-none' : ''}`}
        >
          {pets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-12 text-center">
              <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-white ring-1 ring-gray-100">
                <SearchX className="size-6 text-gray-400" />
              </div>
              <p className="text-sm font-semibold text-gray-700">
                No encontramos mascotas con esos datos
              </p>
              <p className="mt-1 text-xs text-gray-500">
                {activeTab === 'owner'
                  ? 'Prueba con el nombre completo del dueño o su RUT (ej: 12.345.678-9).'
                  : 'Verifica que el número de microchip esté escrito correctamente (15 dígitos).'}
              </p>
              <button
                type="button"
                onClick={() => resetQueryAndSetTab('owner')}
                className="mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-700 ring-1 ring-gray-200 transition-all hover:bg-gray-50 hover:ring-gray-300"
              >
                <RotateCcw className="size-3.5" />
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            pets.map((mascota) => {
              const Icon = especieIcon[mascota.especie] ?? PawPrint;
              const ownerName = mascota.nombre_propietario || 'Sin propietario';
              const hasChip = Boolean(mascota.microchip?.trim());
              const isSelected = selectedPetId === mascota.id;

              return (
                <div
                  key={mascota.id}
                  onClick={() => setSelectedPetId(mascota.id)}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedPetId(mascota.id);
                    }
                  }}
                  className={`group flex cursor-pointer items-start justify-between gap-4 rounded-2xl border px-5 py-4 transition-all hover:shadow-md ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                      : 'border-gray-200 bg-white hover:border-emerald-500/50'
                  }`}
                >
                  <div className="flex w-full items-start gap-4">
                    {/* Avatar de la mascota */}
                    <div
                      className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ring-1 transition-all ${
                        isSelected
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                          : 'bg-gray-50 text-gray-600 ring-gray-100 group-hover:bg-emerald-50 group-hover:text-emerald-700 group-hover:ring-emerald-100'
                      }`}
                    >
                      <Icon className="size-6" />
                    </div>

                    {/* Info Principal */}
                    <div className="min-w-0 flex-1">
                      <div className="-mt-0.5 flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {capitalize(mascota.nombre_mascota)}
                        </h3>
                        <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-gray-500 uppercase ring-1 ring-gray-200">
                          {capitalize(mascota.especie)}
                        </span>
                        {mascota.esterilizado && (
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                        )}
                      </div>

                      {/* Info propietario */}
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
                        <span
                          className={`inline-flex items-center gap-1.5 ${
                            searchBy === 'owner' && search
                              ? 'font-semibold text-gray-700'
                              : ''
                          }`}
                        >
                          <User2 className="size-3.5 shrink-0 text-gray-400" />
                          <span className="truncate">
                            {capitalizeAll(ownerName)}
                          </span>
                        </span>
                        |{/* RUT del propietario */}
                        {mascota.rut ? (
                          <span
                            className={`inline-flex items-center gap-1.5 font-mono tabular-nums ${
                              activeTab === 'owner' && searchValue.trim()
                                ? 'font-semibold text-gray-700'
                                : ''
                            }`}
                          >
                            <span className="text-[10px] font-bold tracking-wide text-gray-400 uppercase">
                              RUT
                            </span>
                            <span>{formatRUT(mascota.rut)}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-gray-400 italic tabular-nums">
                            Sin RUT
                          </span>
                        )}
                        |{/* Microchip de la mascota */}
                        <span
                          className={`inline-flex items-center gap-1.5 tabular-nums ${
                            searchBy === 'chip' && search
                              ? 'font-semibold text-gray-700'
                              : ''
                          }`}
                        >
                          <Microchip
                            className={`size-3.5 shrink-0 ${
                              hasChip ? 'text-emerald-500' : 'text-gray-300'
                            }`}
                          />
                          {hasChip ? (
                            <span className="font-mono">
                              {mascota.microchip}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic">
                              Sin microchip
                            </span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Radio seleccion custom */}
                    <div
                      className={`mt-1.5 flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-300/80 bg-white text-white'
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
                </div>
              );
            })
          )}
        </div>

        {/* Botones */}
        <div className="mt-8 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            {selectedPetId ? (
              <>
                Paciente seleccionado:{' '}
                <span className="font-semibold text-gray-700">
                  {capitalize(
                    pets.find((pet) => pet.id === selectedPetId)
                      ?.nombre_mascota || ''
                  )}
                </span>
              </>
            ) : (
              <>Selecciona una mascota para continuar</>
            )}
          </div>
          <Button
            disabled={!selectedPetId}
            onClick={onNext}
            className="h-11 rounded-full px-8 disabled:opacity-50"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
