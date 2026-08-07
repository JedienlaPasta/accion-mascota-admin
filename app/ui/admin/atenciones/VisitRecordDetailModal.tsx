'use client';

import { getVisitDetailById } from '@/app/_lib/data/consultas';
import { Calendar, ChevronRight, Clock, UserIcon, XIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type VisitRecordDetailModalProps = {
  id: string;
};

export default function VisitRecordDetailModal({
  id,
}: VisitRecordDetailModalProps) {
  const [data, setData] = useState<Awaited<
    ReturnType<typeof getVisitDetailById>
  > | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // NOTA: idealmente haces un Server Component o un Route Handler; aquí un fetch rápido:
    // Como alternativa simple, puedes mover la lógica del modal a su propia ruta con 'use client' + route handler.
    // Por ahora, usaremos window.fetch a una ruta: /api/atenciones/[id] (si la creas).
    // Si no tienes API, mejor pasa el detalle desde page.tsx vía props server → componentes hijos.
    fetch(`/api/atenciones/${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((json) => setData(json.data || null))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll');
    if (!mainContainer) return;
    const scrollbarWidth =
      mainContainer.offsetWidth - mainContainer.clientWidth;
    mainContainer.style.overflow = 'hidden';
    if (scrollbarWidth > 0)
      mainContainer.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      mainContainer.style.overflow = '';
      mainContainer.style.paddingRight = '';
    };
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleModalClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('visitId');
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 z-70 flex items-center justify-center bg-gray-800/70"
      >
        <div className="size-12 animate-spin rounded-full border-4 border-white/80 border-t-emerald-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="fixed inset-0 z-70" onClick={handleModalClose}>
        <div className="absolute top-1/2 left-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 text-center shadow-2xl">
          <p className="text-sm font-semibold text-gray-800">
            Registro no encontrado
          </p>
          <button
            onClick={handleModalClose}
            className="mt-3 text-xs text-indigo-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    );
  }

  // ... aquí tu UI actual del modal, pero usando `data` real del schema:
  // data.peso_actual, data.motivo_atencion, data.anamnesis, data.examen_fisico, data.examenes_solicitados, data.procedimientos_aplicados, data.tratamiento
  return (
    <div className="fixed inset-0 z-70" onClick={handleModalClose}>
      <div className="absolute inset-0 bg-gray-800/70" />
      <div className="absolute top-1/2 left-1/2 max-h-[90vh] w-[90%] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              Detalle atención
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {data.nombre_mascota} ·{' '}
              {new Date(data.fecha_atencion).toLocaleString('es-CL')}
            </p>
          </div>
          <button
            onClick={handleModalClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
          >
            <XIcon className="size-5" />
          </button>
        </div>
        {/* TODO: arma aquí el detalle completo usando los campos del schema */}
        <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
              Motivo
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {data.motivo_atencion || '—'}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
              Peso actual
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {data.peso_actual ? `${data.peso_actual} kg` : '—'}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
            <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
              Pre-DX
            </p>
            <p className="mt-1 font-medium text-gray-800">
              {data.pre_dx || '—'}
            </p>
          </div>
          <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
            <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
              Tratamiento
            </p>
            <p className="mt-1 font-medium whitespace-pre-wrap text-gray-800">
              {data.tratamiento || '—'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
