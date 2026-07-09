import HeatInfo from './HeatmapHeatInfo';
import HeatMapTable, { HeatmapTableSkeleton } from './HeatmapTable';
import HeatMapFilter from './HeatmapFilter';
import { Suspense } from 'react';
import { SecondaryButton } from '@/app/ui/components/Button';
import { ListFilter } from 'lucide-react';
import { FilterSelect } from '../FilterSelect';
import { getYearsBetween } from '@/app/_lib/utils/get-values';

type HeatmapProps = {
  year: string;
};

export default async function HeatMap({ year }: HeatmapProps) {
  const currentYear = new Date().getFullYear().toString();
  const start = '2019';
  const end = currentYear;
  const years = getYearsBetween(start, end);

  return (
    <div className="flex flex-col space-y-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Atenciones Realizadas
        </h2>
        <div className="flex gap-2">
          <FilterSelect options={years} className="rounded-lg border" />
          <SecondaryButton className="gap-2 px-3! text-sm">
            <ListFilter className="h-4 w-4" />
            Filtros
          </SecondaryButton>
        </div>
      </div>

      <div className="flex min-w-fit shrink-0 flex-nowrap gap-6">
        <div className="flex-1">
          <div className="flex flex-col gap-3">
            <Suspense fallback={<HeatmapTableSkeleton />}>
              <HeatMapTable year={year} />
            </Suspense>
            <HeatInfo />
          </div>
        </div>
      </div>
    </div>
  );
}
