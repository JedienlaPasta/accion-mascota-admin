import { JSX } from 'react';
import BoardCube from './HeatmapBoardCube';
import { months, weekDays } from '@/app/_lib/static-data';

export default function HeatmapTableSkeleton() {
  const skeletonCubes: JSX.Element[] = [];
  for (let i = 0; i < 265; i++) {
    skeletonCubes.push(<BoardCube key={`skeleton-${i}`} count={0} disabled />);
  }

  return (
    <div className="flex w-fit flex-col">
      <div className="ml-7 grid grid-cols-12 pb-1 text-xs text-gray-600">
        {months.map((month) => (
          <div key={month} className="text-center whitespace-nowrap">
            {month}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col gap-0.75 text-center text-xs text-gray-600">
          {weekDays.map((day) => (
            <p key={day}>{day}</p>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-5 gap-0.75">
          {skeletonCubes}
        </div>
      </div>
    </div>
  );
}
