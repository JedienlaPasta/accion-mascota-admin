import { JSX } from 'react';
import BoardCube from './HeatmapBoardCube';
import { getDaysBetween } from '@/app/_lib/utils/get-values';
import { getDailyAttentionCountByYear } from '@/app/_lib/data/inicio';

type HeatMapTableProps = {
  year: string;
};

const months = [
  'Ene',
  'Feb',
  'Mar',
  'Abr',
  'May',
  'Jun',
  'Jul',
  'Ago',
  'Sep',
  'Oct',
  'Nov',
  'Dic',
];

const weekDays = ['Lun', 'Mar', 'Mie', 'Jue', 'Vie'];
// const boardDays = weekDays.map((day) => <p key={day}>{day}</p>);

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

  // const days = getDaysBetween(`${year}-01-01`, `${year}-12-31`);

  // const filteredDays = days.filter((day) => day.year() === Number(year));

  // // Array de semanas (cada semana tiene 5 dias)
  // const weeks: Array<JSX.Element[]> = [];
  // let currentWeek: JSX.Element[] = [];

  // // Determinar el primer dia de trabajo (Lunes-Viernes)
  // const firstWorkdayIndex = filteredDays.findIndex((day) => {
  //   const dayOfWeek = day.day();
  //   return dayOfWeek >= 1 && dayOfWeek <= 5;
  // });
  // const firstWorkDay = filteredDays[firstWorkdayIndex];
  // const dayOfWeek = firstWorkDay.day();
  // const offset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // // Rellenar primera semana con cubos deshabilitados correspondientes a dias fuera del año (offset)
  // for (let i = 0; i < offset; i++) {
  //   currentWeek.push(<BoardCube key={`offset-${i}`} count={0} disabled />);
  // }

  // filteredDays.forEach((day) => {
  //   const dOW = day.day();
  //   if (dOW >= 1 && dOW <= 5) {
  //     const dateStr = day.format('YYYY-MM-DD');
  //     const count = attentions[dateStr] || 0;
  //     currentWeek.push(
  //       <BoardCube
  //         key={dateStr}
  //         count={count}
  //         dateStr={dateStr}
  //         thresholds={thresholds}
  //       />
  //     );

  //     if (currentWeek.length === 5) {
  //       weeks.push(currentWeek);
  //       currentWeek = [];
  //     }
  //   }
  // });

  // // Rellenar ultima semana, en caso de ser necesario, con cubos deshabilitados a los dias fuera del año (offset)
  // if (currentWeek.length > 0) {
  //   const pad = 5 - currentWeek.length;
  //   for (let i = 0; i < pad; i++) {
  //     currentWeek.push(<BoardCube key={`final-pad-${i}`} count={0} disabled />);
  //   }
  //   weeks.push(currentWeek);
  // }

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

export function HeatmapTableSkeleton() {
  // const weeks: Array<JSX.Element> = [];
  // for (let i = 0; i < 265; i++) {
  //   weeks.push(<BoardCube key={`final-pad-${i}`} count={0} disabled />);
  // }
  const skeletonCubes: JSX.Element[] = [];
  for (let i = 0; i < 265; i++) {
    skeletonCubes.push(<BoardCube key={`skeleton-${i}`} count={0} disabled />);
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
        <div className="grid grid-flow-col grid-rows-5 gap-1">
          {skeletonCubes}
        </div>
      </div>
    </div>
  );
}
