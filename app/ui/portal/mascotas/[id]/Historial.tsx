'use client';
import {
  HistorialClinico,
  tipoColors,
  tipoIcon,
  tipoLabels,
} from '@/app/_lib/mock-data';
import { formatShortDate } from '@/app/_lib/utils/format';
import { Button } from '@/app/ui/components/Button';
import { LargeMutedBorderLink } from '@/app/ui/components/Link';
import { Calendar, ChevronDown, Stethoscope } from 'lucide-react';
import { useState } from 'react';

export default function MascotaHistorial({
  historial,
  mascotaId,
}: {
  historial: HistorialClinico[];
  mascotaId: string;
}) {
  const [showAllHistory, setShowAllHistory] = useState(false);

  const displayedHistory = showAllHistory ? historial : historial.slice(0, 3);

  return (
    <div className="space-y-3">
      {historial.length === 0 ? (
        displayedHistory.map((registro) => {
          const TipoIcon = tipoIcon[registro.tipo] || Stethoscope;
          const colors = tipoColors[registro.tipo] || tipoColors.consulta;

          return (
            <div
              key={registro.id}
              className="group overflow-hidden rounded-xl border border-gray-100 bg-white transition-all hover:border-gray-200 hover:shadow-sm"
            >
              <div className="flex cursor-pointer items-center justify-between px-4 py-4">
                <div className="flex items-center gap-4">
                  <div
                    className={
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ' +
                      colors.bg
                    }
                  >
                    <TipoIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {registro.descripcion}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs">
                      <span className="font-medium text-gray-500">
                        {formatShortDate(registro.fecha)}
                      </span>
                      <span
                        className={
                          'rounded-full px-2 py-0.5 font-medium ' + colors.bg
                        }
                      >
                        {tipoLabels[registro.tipo] || registro.tipo}
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 transition-transform group-hover:text-gray-600" />
              </div>
            </div>
          );
        })
      ) : (
        <div className="py-8 text-center text-gray-500">
          <Stethoscope className="mx-auto mb-4 h-12 w-12 opacity-50" />
          <p>No hay registros clinicos todavia</p>
          <LargeMutedBorderLink
            href={'/portal/citas/nueva?mascota=' + mascotaId}
            className="mx-auto mt-4 w-fit"
          >
            <Calendar className="h-4 w-4" />
            Agendar primera cita
          </LargeMutedBorderLink>
        </div>
      )}

      {historial.length > 3 && !showAllHistory && (
        <Button
          className="mt-2 w-full text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
          onClick={() => setShowAllHistory(true)}
        >
          {'Ver ' + (historial.length - 3) + ' registros mas'}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
