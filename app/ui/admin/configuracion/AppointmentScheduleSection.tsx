'use client';

import { SettingsCard } from './SettingsCard';
import {
  SCHEDULE_DAYS,
  SLOT_OPTIONS,
  TIME_OPTIONS,
  APPOINTMENT_SCHEDULE_MOCK,
} from '@/app/_lib/static-data/configuracion';
import { CalendarClock } from 'lucide-react';
import { useState } from 'react';

export default function AppointmentScheduleSection() {
  const [days, setDays] = useState<number[]>(APPOINTMENT_SCHEDULE_MOCK.days);
  const [startTime, setStartTime] = useState(
    APPOINTMENT_SCHEDULE_MOCK.startTime
  );
  const [endTime, setEndTime] = useState(APPOINTMENT_SCHEDULE_MOCK.endTime);
  const [slotMinutes, setSlotMinutes] = useState(
    APPOINTMENT_SCHEDULE_MOCK.slotMinutes
  );
  const [maxPerSlot, setMaxPerSlot] = useState(
    APPOINTMENT_SCHEDULE_MOCK.maxPerSlot
  );

  const toggleDay = (value: number) =>
    setDays((prev) =>
      prev.includes(value)
        ? prev.filter((d) => d !== value)
        : [...prev, value].sort()
    );

  return (
    <SettingsCard
      title="Horario de Citas"
      description="Días y rango horario disponibles para agendar atenciones."
      icon={CalendarClock}
      className="xl:col-span-2"
    >
      <div className="flex flex-col gap-6">
        <div>
          <p className="mb-2 text-[11px] font-bold tracking-wide text-slate-500 uppercase">
            Días permitidos
          </p>
          <div className="flex flex-wrap gap-2">
            {SCHEDULE_DAYS.map((day) => {
              const active = days.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggleDay(day.value)}
                  className={`min-w-14 cursor-pointer rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60'
                      : 'border-gray-200 bg-white text-slate-500 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {day.short}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TimeSelect
            label="Hora de apertura"
            value={startTime}
            onChange={setStartTime}
          />
          <TimeSelect
            label="Hora de cierre"
            value={endTime}
            onChange={setEndTime}
          />
          <div className="flex flex-col gap-1">
            <label className="ml-1 text-[10px] font-bold text-slate-500 uppercase">
              Duración del bloque
            </label>
            <select
              value={slotMinutes}
              onChange={(e) => setSlotMinutes(Number(e.target.value))}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            >
              {SLOT_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} min
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="ml-1 text-[10px] font-bold text-slate-500 uppercase">
              Cupos por bloque
            </label>
            <select
              value={maxPerSlot}
              onChange={(e) => setMaxPerSlot(Number(e.target.value))}
              className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
            >
              {[1, 2, 3, 4, 5].map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}

function TimeSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="ml-1 text-[10px] font-bold text-slate-500 uppercase">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
      >
        {TIME_OPTIONS.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
    </div>
  );
}
