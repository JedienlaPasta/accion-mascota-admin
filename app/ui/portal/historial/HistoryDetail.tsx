'use client';

import { HistorialClinico } from '@/app/_lib/mock-data';
import { parseLocalDate } from '@/app/_lib/utils/parse';
import { Calendar, ChevronRight, Clock, UserIcon, XIcon } from 'lucide-react';
import { useEffect } from 'react';

type HistoryDetailProps = {
  registro: HistorialClinico;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  TipoIcon: React.ComponentType<{ className?: string }>;
  colors: {
    bg: string;
    text: string;
    ring: string;
  };
  petName: string;
  closeModal: () => void;
};

export default function HistoryDetail({
  registro,
  label,
  Icon,
  TipoIcon,
  colors,
  petName,
  closeModal,
}: HistoryDetailProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '15px';

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, []);

  return (
    <div
      key={registro.id}
      className="fixed top-1/2 left-1/2 z-70 w-full max-w-5xl -translate-x-1/2 -translate-y-[80%] overflow-hidden rounded-3xl border border-gray-100 bg-white px-4 py-6 shadow-sm transition-all hover:shadow-md sm:w-[80%] sm:px-4 sm:py-6 lg:px-8 lg:py-10"
    >
      <div className="relative flex items-start justify-between gap-3 bg-white">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ring-1 ${colors.bg} ${colors.text} ${colors.ring}`}
          >
            <TipoIcon className="size-5" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">{registro.descripcion}</p>

            <div className="flex gap-3">
              <span className="flex items-center rounded-full border border-gray-200 px-2 text-xs font-medium text-gray-700 capitalize">
                {label}
              </span>
              <span className="text-sm text-gray-500 capitalize">|</span>
              <span className="text-sm text-gray-500 capitalize">
                <div className="flex items-center gap-1">
                  <Icon className="size-3" />
                  {petName}
                </div>
              </span>
              <span className="text-sm text-gray-500 capitalize">|</span>
              <span className="text-sm text-gray-500 capitalize">
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Intl.DateTimeFormat('es-CL', {
                    day: 'numeric',
                    month: 'short',
                  }).format(parseLocalDate(registro.fecha))}
                </div>
              </span>
            </div>
          </div>
        </div>
        {/* Right */}
        <XIcon
          onClick={closeModal}
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
              <p className="text-sm font-semibold">{registro.diagnostico}</p>
            </div>
          </div>
          {/* Tratamiento */}
          <div className="flex items-center gap-3 text-gray-700">
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Tratamiento Recomendado
              </p>
              <p className="text-sm font-semibold">
                {registro.tratamiento || 'Churu de pollito'}
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
            <p>{registro.veterinario}</p>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="size-4" />
            <p>
              {new Intl.DateTimeFormat('es-CL', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }).format(parseLocalDate(registro.fecha))}
            </p>
          </div>
          {registro.proximaVisita && (
            <div className="flex items-center gap-2 text-emerald-600">
              <Clock className="size-4" />
              <p className="font-medium">
                Prox. control:{' '}
                {new Intl.DateTimeFormat('es-CL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                }).format(parseLocalDate(registro.proximaVisita))}
              </p>
            </div>
          )}
        </div>

        <button className="group flex cursor-pointer items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
          Ver perfil de {petName}
          <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
