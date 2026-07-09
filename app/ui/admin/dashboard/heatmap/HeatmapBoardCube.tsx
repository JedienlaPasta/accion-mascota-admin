import dayjs from 'dayjs';

type BoardCubeProps = {
  count: number;
  dateStr?: string;
  thresholds?: number[];
  disabled?: boolean;
};

export default function BoardCube({
  count,
  dateStr,
  thresholds = [],
  disabled = false,
}: BoardCubeProps) {
  const today = dayjs().format('YYYY-MM-DD');
  const isToday = dateStr === today;

  const stateColor = [
    'bg-slate-200/60 border-slate-300/50',
    'bg-teal-100/90 border-teal-200/50',
    'bg-teal-200/90 border-teal-300/50',
    'bg-teal-300/90 border-teal-400/50',
    'bg-teal-400/90 border-teal-500/50',
    'bg-teal-500/90 border-teal-600/50',
  ];

  // Select the color based on count thresholds—or highlight if today.
  function getStateFromCount(count: number, thresholds: number[]): number {
    if (count === 0) return 0;
    if (count <= thresholds[0]) return 1;
    if (count <= thresholds[1]) return 2;
    if (count <= thresholds[2]) return 3;
    if (count <= thresholds[3]) return 4;
    return 5;
  }

  const cubeClass = disabled
    ? 'bg-slate-50 border-slate-200/90'
    : stateColor[getStateFromCount(count, thresholds)];

  const year = dateStr?.slice(0, 4);
  const day = dateStr?.slice(8);
  const month = dateStr?.slice(5, 7);
  const date = `${day}-${month}-${year}`;

  return (
    <div
      className={`group relative flex items-center justify-center border ${cubeClass} ${
        isToday
          ? 'z-10 mx-auto size-3.5 self-center rounded-full'
          : 'size-4 rounded'
      }`}
    >
      {!disabled && (
        <div className="invisible absolute bottom-5 z-10 flex-col rounded-md bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white transition-opacity group-hover:visible group-hover:opacity-100">
          <p>{date}</p>
          <p>Atenciones: {count}</p>
        </div>
      )}
    </div>
  );
}
