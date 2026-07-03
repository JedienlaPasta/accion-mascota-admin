'use client';

import {
  especieIcon,
  HistorialClinico,
  tipoColors,
  tipoIcon,
  todasLasMascotas,
} from '@/app/_lib/mock-data';
import { parseLocalDate } from '@/app/_lib/utils/parse';
import { Calendar, ChevronRight, Clock, UserIcon, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type VisitRecordDetailModalProps = {
  id: string;
  visitRecords: HistorialClinico[];
};

export default function VisitRecordDetailModal({
  id,
  visitRecords,
}: VisitRecordDetailModalProps) {
  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll');
    if (!mainContainer) return;

    const scrollbarWidth =
      mainContainer.offsetWidth - mainContainer.clientWidth;

    mainContainer.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      mainContainer.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      mainContainer.style.overflow = '';
      mainContainer.style.paddingRight = '';
    };
  }, []);

  const data = visitRecords.find((item) => item.id === id);

  const petRecord = todasLasMascotas.find(
    (item) => item.id === data?.mascotaId
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleModalClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('visitId');
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (!data) return <div>Registro no encontrado</div>;

  const IconoConsulta = tipoIcon[data.tipo];
  const IconoEspecie = especieIcon[petRecord?.especie || 'otro'];
  const colors = tipoColors[data.tipo];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-60 h-full bg-gray-800/70 transition-all"
        onClick={handleModalClose}
      />
      <div
        key={data.id}
        className="fixed top-1/2 left-1/2 z-70 w-full max-w-5xl -translate-x-1/2 -translate-y-[80%] overflow-hidden rounded-3xl border border-gray-100 bg-white px-4 py-6 shadow-sm transition-all hover:shadow-md sm:w-[80%] sm:px-4 sm:py-6 lg:px-8 lg:py-10"
      >
        <div className="relative flex items-start justify-between gap-3 bg-white">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}
            >
              <IconoConsulta className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">{data.descripcion}</p>

              <div className="flex gap-3">
                <span className="flex items-center rounded-full border border-gray-200 px-2 text-xs font-medium text-gray-700 capitalize">
                  {data.tipo}
                </span>
                <span className="text-sm text-gray-500 capitalize">|</span>
                <span className="text-sm text-gray-500 capitalize">
                  <div className="flex items-center gap-1">
                    <IconoEspecie className="size-3" />
                    {petRecord?.nombre || 'Mascota'}
                  </div>
                </span>
                <span className="text-sm text-gray-500 capitalize">|</span>
                <span className="text-sm text-gray-500 capitalize">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {new Intl.DateTimeFormat('es-CL', {
                      day: 'numeric',
                      month: 'short',
                    }).format(parseLocalDate(data.fecha))}
                  </div>
                </span>
              </div>
            </div>
          </div>
          {/* Right */}
          <XIcon
            onClick={() => handleModalClose()}
            className="size-5 cursor-pointer text-gray-400 transition-transform duration-300"
          />
        </div>
        <div className="mt-4 duration-500 sm:ml-13">
          <div className="flex flex-col gap-4 rounded-xl bg-gray-50 px-5 py-4">
            {/* Diagnóstico */}
            <div className="flex items-center gap-3 text-gray-700">
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                  Diagnóstico
                </p>
                <p className="text-sm font-semibold">{data.diagnostico}</p>
              </div>
            </div>
            {/* Tratamiento */}
            <div className="flex items-center gap-3 text-gray-700">
              <div>
                <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                  Tratamiento Recomendado
                </p>
                <p className="text-sm font-semibold">
                  {data.tratamiento || 'Churu de pollito'}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Detalles footer */}
        <div className="mt-3 ml-1 flex flex-col gap-4 sm:ml-13">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4" />
              <p>{data.veterinario}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <p>
                {new Intl.DateTimeFormat('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(parseLocalDate(data.fecha))}
              </p>
            </div>
            {data.proximaVisita && (
              <div className="flex items-center gap-2 text-emerald-600">
                <Clock className="size-4" />
                <p className="font-medium">
                  Prox. control:{' '}
                  {new Intl.DateTimeFormat('es-CL', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }).format(parseLocalDate(data.proximaVisita))}
                </p>
              </div>
            )}
          </div>

          <button className="group flex cursor-pointer items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Ver perfil de {petRecord?.nombre || 'Mascota'}
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </>
  );
}
