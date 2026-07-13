import { JSX } from 'react';
import BoardCube from './HeatmapBoardCube';
import { getDaysBetween } from '@/app/_lib/utils/get-values';
import { getDailyAttentionCountByYear } from '@/app/_lib/data/inicio';
import { months, weekDays } from '@/app/_lib/static-data';

type HeatMapTableProps = {
  year: string;
};

export default async function HeatMapTable({ year }: HeatMapTableProps) {
  const attentions = await getDailyAttentionCountByYear(year);

  const counts = Object.values(attentions).filter(
    (value) => typeof value === 'number'
  ) as number[];

  let thresholds: number[];
  if (counts.length === 0) {
    thresholds = [2, 4, 6, 8, 10];
  } else {
    const max = Math.max(...counts);
    const topScale = Math.max(max, 10);

    const step = topScale / 5;
    thresholds = [
      Math.ceil(step),
      Math.ceil(step * 2),
      Math.ceil(step * 3),
      Math.ceil(step * 4),
      Math.ceil(step * 5),
    ];
  }

  const allDays = getDaysBetween(`${year}-01-01`, `${year}-12-31`);
  const workDays = allDays.filter((day) => day.day() >= 1 && day.day() <= 5);
  const cubes: JSX.Element[] = [];

  if (workDays.length > 0) {
    const firstDay = workDays[0].day();
    const initialOffset = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < initialOffset; i++) {
      cubes.push(<BoardCube key={`offset-${i}`} count={0} disabled />);
    }
  }

  workDays.forEach((day) => {
    const dateStr = day.format('YYYY-MM-DD');
    cubes.push(
      <BoardCube
        key={dateStr}
        count={attentions[dateStr] || 0}
        dateStr={dateStr}
        thresholds={thresholds}
      />
    );
  });

  const totalCubes = cubes.length;
  const remainder = totalCubes % 5;
  if (remainder !== 0) {
    const finalPad = 5 - remainder;
    for (let i = 0; i < finalPad; i++) {
      cubes.push(<BoardCube key={`final-pad-${i}`} count={0} disabled />);
    }
  }

  return (
    <div className="flex w-fit flex-col rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="ml-7 grid grid-cols-12 pb-1 text-xs text-gray-600">
        {months.map((month) => (
          <div key={month} className="text-center whitespace-nowrap">
            {month}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="flex flex-col gap-1 text-center text-xs text-gray-600">
          {weekDays.map((day) => (
            <p key={day}>{day}</p>
          ))}
        </div>
        <div className="grid grid-flow-col grid-rows-5 gap-1">{cubes}</div>
      </div>
    </div>
  );
}
