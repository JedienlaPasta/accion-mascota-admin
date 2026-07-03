'use client';

import { type AdminAppointment } from '@/app/_lib/mock-data';
import { Calendar, Cat, ChevronRight, UserIcon, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type StatusStyle = { iconWrap: string; badge: string };

const STATUS_STYLES: Record<AdminAppointment['status'], StatusStyle> = {
  Completado: {
    iconWrap: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  Agendado: {
    iconWrap: 'bg-sky-50 text-sky-700 ring-sky-200',
    badge: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  Pendiente: {
    iconWrap: 'bg-amber-50 text-amber-800 ring-amber-200',
    badge: 'border-amber-200 bg-amber-50 text-amber-800',
  },
  Cancelado: {
    iconWrap: 'bg-rose-50 text-rose-700 ring-rose-200',
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
  },
};

function formatDateISO(dateISO: string) {
  const [y, m, d] = dateISO.split('-');
  return y && m && d ? `${d}/${m}/${y}` : dateISO;
}

function labelForType(type: AdminAppointment['type']) {
  if (type === 'consulta') return 'Consulta';
  if (type === 'vacuna') return 'Vacuna';
  if (type === 'esterilizacion') return 'Esterilización';
  if (type === 'control') return 'Control';
  return 'Emergencia';
}

type AppointmentDetailsModalProps = {
  id: string;
  appointmentData: AdminAppointment[];
};

export default function AppointmentDetailsModal({
  id,
  appointmentData,
}: AppointmentDetailsModalProps) {
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

  const data = appointmentData.find((item) => item.id === id);
  const statusStyle = data ? STATUS_STYLES[data.status] : null;
  const timeRange = data ? `${data.start} – ${data.end}` : '';
  const dateLabel = data ? formatDateISO(data.appointmentDate) : '';
  const typeLabel = data ? labelForType(data.type) : '';

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleModalClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('appointmentId');
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (!data)
    return (
      <div
        key={id}
        className="fixed top-1/2 left-1/2 z-70 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-gray-100 bg-white px-4 py-6 shadow-sm transition-all hover:shadow-md sm:w-[80%] sm:px-4 sm:py-6 lg:px-8 lg:py-10"
      >
        <p className="text-sm font-semibold">Registro no encontrado</p>
      </div>
    );

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-60 h-full bg-gray-800/70 transition-all"
        onClick={() => handleModalClose()}
      />
      <div
        key={id}
        className="fixed top-1/2 left-1/2 z-70 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-gray-100 bg-white px-4 py-6 shadow-sm transition-all hover:shadow-md sm:w-[80%] sm:px-4 sm:py-6 lg:px-8 lg:py-10"
      >
        <div className="relative flex items-start justify-between gap-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-gray-600 ring-2 ring-gray-200/70">
              <Cat className="size-5" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold">{data.petName}</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gray-200 px-2 text-xs font-medium text-gray-700">
                  {typeLabel}
                </span>
                <span className="text-sm text-gray-500">|</span>
                <span className="text-sm text-gray-500">{data.vetName}</span>
                <span className="text-sm text-gray-500">|</span>
                <span
                  className={`rounded-md border px-2 py-0.5 text-xs font-medium ${statusStyle?.badge ?? 'border-gray-200 bg-gray-50 text-gray-700'}`}
                >
                  {data.status}
                </span>
              </div>
            </div>
          </div>
          <XIcon
            onClick={handleModalClose}
            className="size-5 cursor-pointer text-gray-400 transition-transform duration-300"
          />
        </div>

        <div className="mt-4 duration-500 sm:ml-13">
          <div className="flex flex-col gap-4 rounded-xl bg-gray-50 px-5 py-4">
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Propietario
              </p>
              <p className="text-sm font-semibold">{data.ownerName}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Fecha
              </p>
              <p className="text-sm font-semibold">{dateLabel}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Horario
              </p>
              <p className="text-sm font-semibold">{timeRange}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-wider text-gray-400 uppercase">
                Notas
              </p>
              <p className="text-sm font-semibold">{data.notes}</p>
            </div>
          </div>
        </div>

        <div className="mt-3 ml-1 flex flex-col gap-4 sm:ml-13">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <UserIcon className="size-4" />
              <p>{data.ownerName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="size-4" />
              <p>
                {dateLabel} • {timeRange}
              </p>
            </div>
          </div>
          <button className="group flex cursor-pointer items-center gap-1 text-sm font-medium text-emerald-600 hover:text-emerald-700">
            Ver perfil de {data.petName}
            <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </div>
    </>
  );
}
