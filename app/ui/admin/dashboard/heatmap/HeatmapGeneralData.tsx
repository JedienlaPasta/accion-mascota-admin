import { getTotalAttentionCountByYearAndPetType } from '@/app/_lib/data/inicio';
import { Dog, Cat, FileChartColumn } from 'lucide-react';

export default async function HeatmapGeneralData({ year }: { year: string }) {
  const data = await getTotalAttentionCountByYearAndPetType(year);
  const total = Number(data.cantidad_atenciones) || 0;
  const dogs = Number(data.cantidad_perros) || 0;
  const cats = Number(data.cantidad_gatos) || 0;

  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
        <h3 className="text-xs font-bold tracking-wide text-slate-500 uppercase">
          Resumen del Año
        </h3>

        <div className="space-y-3">
          {/* Total Atenciones */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100/70 text-blue-600">
                <FileChartColumn className="size-4" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Total Atenciones
              </span>
            </div>
            <span className="text-xl font-bold text-slate-800">
              {total.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="h-px bg-slate-200" />

          <div className="grid grid-cols-2 gap-3">
            {/* Perros */}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-gray-50 text-gray-600">
                  <Dog className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Perros
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800">
                {dogs.toLocaleString('es-CL')}
              </span>
            </div>

            {/* Gatos */}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-gray-50 text-gray-600">
                  <Cat className="size-3.5" />
                </div>
                <span className="text-xs font-medium text-slate-600">
                  Gatos
                </span>
              </div>
              <span className="text-sm font-bold text-slate-800">
                {cats.toLocaleString('es-CL')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HeatmapGeneralDataSkeleton() {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-5">
        {/* Título */}
        <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />

        <div className="space-y-3">
          {/* Total Atenciones */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-4 w-28 rounded bg-slate-200 animate-pulse" />
            </div>
            <div className="h-7 w-16 rounded bg-slate-200 animate-pulse" />
          </div>

          <div className="h-px bg-slate-200" />

          <div className="grid grid-cols-2 gap-3">
            {/* Perros Skeleton */}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-slate-200 animate-pulse" />
                <div className="h-3 w-10 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="h-5 w-10 rounded bg-slate-200 animate-pulse" />
            </div>

            {/* Gatos Skeleton */}
            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-md bg-slate-200 animate-pulse" />
                <div className="h-3 w-10 rounded bg-slate-200 animate-pulse" />
              </div>
              <div className="h-5 w-10 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
