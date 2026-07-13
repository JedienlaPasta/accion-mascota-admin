import HeatInfo from './HeatmapHeatInfo';
import HeatMapTable from './HeatmapTable';
import { Suspense } from 'react';
import { SecondaryButton } from '@/app/ui/components/Button';
import { ListFilter } from 'lucide-react';
import YearFilter from '../YearFilter';
import HeatmapTableSkeleton from './HeatmapTableSkeleton';
import HeatmapGeneralData, {
  HeatmapGeneralDataSkeleton,
} from './HeatmapGeneralData';

type HeatmapProps = {
  year: string;
};

export default async function HeatMap({ year }: HeatmapProps) {
  return (
    <div className="relative z-10 flex flex-col space-y-4 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">
          Atenciones Realizadas
        </h2>
        <div className="flex gap-2">
          <YearFilter />
          <SecondaryButton className="gap-2 px-3! text-sm">
            <ListFilter className="h-4 w-4" />
            Filtros
          </SecondaryButton>
        </div>
      </div>

      <div className="flex min-w-fit shrink-0 flex-nowrap gap-6">
        <div className="flex flex-1 gap-4">
          <div className="flex flex-col gap-3">
            <Suspense
              key={`heatmap-table-${year}`}
              fallback={<HeatmapTableSkeleton />}
            >
              <HeatMapTable year={year} />
            </Suspense>
            <HeatInfo />
          </div>
          <Suspense
            key={`heatmap-general-data-${year}`}
            fallback={<HeatmapGeneralDataSkeleton />}
          >
            <HeatmapGeneralData year={year} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
