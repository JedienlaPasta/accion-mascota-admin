'use client';

import { capitalize } from '@/app/_lib/utils/format';
import { CalendarRange, ChevronLeft, ChevronRight, List } from 'lucide-react';
import { useMemo, useState } from 'react';
import Dropdown from '../../components/Dropdown';
import { adminAppointments, type AdminAppointment } from '@/app/_lib/mock-data';
import { useRouter, useSearchParams } from 'next/navigation';
import AppointmentsTable from './AppointmentsTable';
import { AppointmentListItem } from '@/app/_lib/data-types/citas';

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const SLOT_MIN = 30;
const DAY_START = '08:30';
const DAY_END = '17:30';
const SLOT_HEIGHT = 120;

type Status = AdminAppointment['status'];

function toMin(t: string) {
  const [hour, minute] = t.split(':').map(Number);
  return hour * 60 + minute;
}

function startOfWeek(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = (day + 6) % 7;
  d.setDate(d.getDate() - diff);
  return d;
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDateParts(date: Date, options: Intl.DateTimeFormatOptions) {
  const parts = new Intl.DateTimeFormat('es-CL', options).formatToParts(date);
  console.log(parts);
  return parts
    .filter((p) => p.type !== 'literal')
    .map((p) => (p.type === 'month' ? capitalize(p.value) : p.value))
    .join(' ');
}

function formatDayShort(date: Date) {
  return formatDateParts(date, { day: '2-digit', month: 'short' });
}

function formatWeekRange(weekStart: Date) {
  const inicio = formatDateParts(weekStart, { day: '2-digit', month: 'short' });
  const fin = formatDateParts(addDays(weekStart, 4), {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  return `${inicio} – ${fin}`;
}

export default function AppointmentsCalendarTable(props: {
  appointments: AppointmentListItem[];
  page: number;
  totalPages: number;
  totalCount: number;
}) {
  const [tableMode, setTableMode] = useState('calendar');
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date()));
  const [statusFilter, setStatusFilter] = useState<'Todos' | Status>('Todos');

  const weekLabel = useMemo(() => formatWeekRange(weekStart), [weekStart]);
  const dayDates = useMemo(
    () => DAYS.map((_, idx) => addDays(weekStart, idx)),
    [weekStart]
  );

  const events = useMemo(() => {
    if (statusFilter === 'Todos') return adminAppointments;
    return adminAppointments.filter((e) => e.status === statusFilter);
  }, [statusFilter]);

  const startMin = toMin(DAY_START);
  const endMin = toMin(DAY_END);
  const totalMin = endMin - startMin;
  const slotCount = Math.ceil(totalMin / SLOT_MIN);
  const dayHeight = slotCount * SLOT_HEIGHT;

  const timeMarks = useMemo(() => {
    const marks: string[] = [];
    for (let minute = startMin; minute <= endMin; minute += SLOT_MIN) {
      const hh = String(Math.floor(minute / 60)).padStart(2, '0');
      const mm = String(minute % 60).padStart(2, '0');
      marks.push(`${hh}:${mm}`);
    }
    return marks;
  }, [startMin, endMin]);

  const slotStarts = timeMarks.slice(0, -1);
  const gridLines = timeMarks.slice(1, -1);

  const isFullHour = (time: string) => time.endsWith(':00');

  function topFor(time: string) {
    const delta = toMin(time) - startMin;
    return Math.max(0, (delta / SLOT_MIN) * SLOT_HEIGHT);
  }
  function heightFor(startTime: string, endTime: string) {
    return ((toMin(endTime) - toMin(startTime)) / SLOT_MIN) * SLOT_HEIGHT;
  }

  function badgeByStatus(s: Status) {
    if (s === 'Completado')
      return 'border-emerald-200 bg-emerald-50 text-emerald-600';
    if (s === 'Cancelado') return 'border-red-200 bg-red-50 text-red-600';
    if (s === 'Pendiente')
      return 'border-yellow-200 bg-yellow-50 text-yellow-600';
    return 'border-sky-200 bg-sky-50 text-sky-600';
  }

  function lineByStatus(s: Status) {
    if (s === 'Completado') return 'bg-emerald-500/35';
    if (s === 'Cancelado') return 'bg-red-500/35';
    if (s === 'Pendiente') return 'bg-yellow-500/35';
    return 'bg-sky-500/35';
  }

  const router = useRouter();
  const searchParams = useSearchParams();

  const openAppointmentModal = (id: string) => {
    if (!id) return;
    const params = new URLSearchParams(searchParams);
    params.set('appointmentId', id);
    const qs = params.toString();
    router.replace(qs ? `?${qs}` : '', { scroll: false });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-gray-200 bg-white px-3 py-3">
        <div className="flex items-center gap-2 px-1">
          <button
            type="button"
            onClick={() => setWeekStart((prev) => addDays(prev, -7))}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            aria-label="Semana anterior"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(startOfWeek(new Date()))}
            className="inline-flex h-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={() => setWeekStart((prev) => addDays(prev, 7))}
            className="inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
            aria-label="Semana siguiente"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <p className="truncate text-sm font-semibold text-gray-800">
          Semana {weekLabel}
        </p>

        {/* Table mode & Status filter */}
        <div className="flex items-center gap-2">
          {/* Table mode */}
          <div className="flex items-center gap-2 px-1">
            <button
              type="button"
              onClick={() => setTableMode('calendar')}
              className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-colors ${tableMode === 'calendar' ? 'border-blue-200 bg-blue-50 text-blue-500' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              aria-label="Semana anterior"
            >
              <CalendarRange className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setTableMode('list')}
              className={`inline-flex size-9 cursor-pointer items-center justify-center rounded-lg border shadow-sm transition-colors ${tableMode === 'list' ? 'border-blue-200 bg-blue-50 text-blue-500' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              aria-label="Semana siguiente"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
          {/* Status filter */}
          <Dropdown
            value={statusFilter}
            readOnly={true}
            onChange={(e) => setStatusFilter(e as 'Todos' | Status)}
            options={[
              { value: 'Todos', label: 'Todos' },
              { value: 'Agendado', label: 'Agendado' },
              { value: 'Completado', label: 'Completado' },
              { value: 'Pendiente', label: 'Pendiente' },
              { value: 'Cancelado', label: 'Cancelado' },
            ]}
          />
        </div>
      </div>

      {tableMode === 'calendar' && (
        <>
          <div className="grid grid-cols-[80px_repeat(5,1fr)] items-stretch border-b border-gray-200">
            <div className="flex items-center justify-center bg-gray-50 py-2 text-center text-sm font-medium text-gray-700">
              Hora
            </div>
            {DAYS.map((day, idx) => (
              <div key={day} className="bg-gray-50 py-2 text-center">
                <p className="text-sm font-semibold text-gray-700">{day}</p>
                <p className="text-xs font-medium text-gray-500">
                  {formatDayShort(dayDates[idx])}
                </p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-[80px_repeat(5,1fr)] divide-x divide-gray-200/60">
            <div className="relative" style={{ height: dayHeight }}>
              {slotStarts.map((time, idx) => (
                <div
                  key={time}
                  style={{ height: SLOT_HEIGHT }}
                  className="relative"
                >
                  {idx > 0 && (
                    <span
                      className={`absolute right-3 -translate-y-1/2 text-xs ${
                        isFullHour(time) ? 'text-gray-500' : 'text-gray-400/65'
                      }`}
                    >
                      {time}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {DAYS.map((_, dayIdx) => (
              <div
                key={dayIdx}
                className="bg-gray-100s relative"
                style={{ height: dayHeight }}
              >
                {gridLines.map((time) => (
                  <div
                    key={time}
                    className={`absolute right-0 left-0 border-t ${
                      isFullHour(time)
                        ? 'border-gray-200/80'
                        : 'border-gray-100'
                    }`}
                    style={{ top: topFor(time) }}
                  />
                ))}

                {events
                  .filter((e) => e.day === dayIdx)
                  .map((e) => (
                    <div
                      key={e.id}
                      onClick={() => openAppointmentModal(e.id)}
                      role="button"
                      className="absolute right-2 left-2 flex cursor-pointer gap-2 rounded-2xl border border-gray-200 bg-white p-3 text-xs shadow-sm"
                      style={{
                        top: topFor(e.start) + 8,
                        height: heightFor(e.start, e.end) - 16,
                      }}
                    >
                      <div
                        className={`h-full w-2 rounded-full ${lineByStatus(e.status)}`}
                      ></div>
                      <div className="relative flex h-full w-full flex-col justify-start gap-1">
                        <div>
                          <div className="mb-1 text-[11px] font-semibold text-gray-700">
                            {e.start} – {e.end}
                          </div>
                          <div className="text-sm font-semibold text-gray-900">
                            {e.petName}
                          </div>
                          <div className="text-[11px] text-gray-600 capitalize">
                            {e.type}
                          </div>
                        </div>
                        <div
                          className={`rounded-md border px-1.5 py-0.5 text-[10px] font-medium ${badgeByStatus(e.status)}`}
                        >
                          {e.status}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </>
      )}

      {tableMode === 'list' && (
        <AppointmentsTable
          appointments={props.appointments}
          page={props.page}
          totalPages={props.totalPages}
          totalCount={props.totalCount}
        />
      )}
    </div>
  );
}
