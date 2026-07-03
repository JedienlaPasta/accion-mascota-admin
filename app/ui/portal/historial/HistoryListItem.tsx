'use client';

import { HistorialClinico } from '@/app/_lib/mock-data';
import { parseLocalDate } from '@/app/_lib/utils/parse';
import { Calendar, ChevronDown } from 'lucide-react';

type HistoryListItemProps = {
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
  onClick: () => void;
};

export default function HistoryListItem({
  registro,
  label,
  Icon,
  TipoIcon,
  colors,
  petName,
  onClick,
}: HistoryListItemProps) {
  return (
    <div
      key={registro.id}
      className="relative cursor-pointer overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
      onClick={onClick}
    >
      <div className="flex items-center justify-between gap-3 bg-white">
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
        <ChevronDown className="size-5 text-gray-400" />
      </div>
    </div>
  );
}
