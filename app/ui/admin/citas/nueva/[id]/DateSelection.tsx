import { useState, useMemo } from 'react';
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Info,
  Lock,
} from 'lucide-react';
import { DAYS_OF_WEEK, MONTHS, TIME_SLOTS } from './AppointmentForm';
import { Button } from '@/app/ui/components/Button';

export default function DateSelection({
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  onBack,
  onNext,
  isWeekend,
  occupiedSlots,
  minDateIso,
  maxDateIso,
}: {
  selectedDate: Date;
  selectedTime: string | null;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: string | null) => void;
  onBack: () => void;
  onNext: () => void;
  isWeekend: (date: Date) => boolean;
  occupiedSlots: Set<string>;
  minDateIso: string;
  maxDateIso: string;
}) {
  // Mostrar fines de semana? Default: no
  const [showWeekends, setShowWeekends] = useState(false);

  // Calendar Logic
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  // ========= Limites Date =========
  const minDate = useMemo(
    () => new Date(minDateIso + 'T00:00:00'),
    [minDateIso]
  );
  const maxDate = useMemo(
    () => new Date(maxDateIso + 'T23:59:59'),
    [maxDateIso]
  );
  // Inicio del dia de HOY (sin horas/minutos) para chequeo "pasado"
  const todayStart = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);
  // Ahora en minutos (HH:MM * 60) para chequeo de "hora pasada de hoy"
  const nowMinutesOfDay = useMemo(() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  }, []);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptySlots = Array.from({ length: firstDay }, (_, i) => i);

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    const currentDay = newDate.getDate();

    // Primer dia del mes para evitar saltar meses (ej. Ene 31 -> Feb)
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + offset);

    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const daysInTargetMonth = getDaysInMonth(year, month);

    // Ajustar dia al maximo del mes objetivo (ej. Ene 31 -> Feb 28)
    newDate.setDate(Math.min(currentDay, daysInTargetMonth));

    // Clamp dentro de [minDate, maxDate]
    if (newDate < minDate) newDate.setTime(minDate.getTime());
    if (newDate > maxDate) newDate.setTime(maxDate.getTime());

    setSelectedDate(newDate);
    // Al cambiar de mes, resetear la hora seleccionada porque no corresponde a este nuevo dia.
    setSelectedTime(null);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const isSelectedDay = (day: number) => {
    return day === selectedDate.getDate();
  };

  // Fecha bloqueada? (antes de hoy / despues de maxDate / fin de semana y showWeekends=false)
  const isDayDisabled = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day, 0, 0, 0, 0);
    if (date < todayStart) return true; // Pasado
    if (date > maxDate) return true; // > límite (2 meses)
    if (isWeekend(date) && !showWeekends) return true; // Fin de semana sin habilitar
    return false;
  };

  // HELPER: "YYYY-MM-DD" del day actual en este month view
  const dayToKey = (day: number) => {
    const yyyy = currentYear;
    const mm = String(currentMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // Hora bloqueada?
  const isTimeDisabled = (time: string): boolean => {
    // formato hora: HH:MM
    const [h, m] = time.split(':').map(Number);
    const slotMinutes = h * 60 + m;

    const dateKey = dayToKey(selectedDate.getDate());
    const slotKey = `${dateKey} ${time}`;

    // 1) Slot ocupado en db?
    if (occupiedSlots.has(slotKey)) return true;
    // 2) Hoy + la hora ya paso?
    const isCurrentDaySelected =
      selectedDate.getFullYear() === todayStart.getFullYear() &&
      selectedDate.getMonth() === todayStart.getMonth() &&
      selectedDate.getDate() === todayStart.getDate();
    if (isCurrentDaySelected && slotMinutes <= nowMinutesOfDay + 20) {
      // +20 min de gracia (no agendar 16:30 si ahora son 16:20)
      return true;
    }
    return false;
  };

  // Info: cuantos slots libres hay hoy?
  const freeSlotsToday = useMemo(() => {
    return TIME_SLOTS.filter((t) => !isTimeDisabled(t)).length;
  }, [
    selectedDate,
    todayStart,
    occupiedSlots,
    currentMonth,
    currentYear,
    nowMinutesOfDay,
  ]);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Selecciona Fecha y Hora
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Rango disponible entre{' '}
          <span className="font-semibold text-gray-700">
            {minDate.toLocaleDateString('es-CL', {
              day: '2-digit',
              month: 'short',
            })}
          </span>{' '}
          y{' '}
          <span className="font-semibold text-gray-700">
            {maxDate.toLocaleDateString('es-CL', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Calendar */}
        <div>
          <div className="mb-4 flex items-center justify-between px-2">
            <button
              onClick={() => changeMonth(-1)}
              disabled={
                currentYear <= minDate.getFullYear() &&
                currentMonth <= minDate.getMonth()
              }
              className="cursor-pointer rounded-full p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              title="Mes anterior"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-emerald-600" />
              <h3 className="text-lg font-bold text-gray-900">
                {MONTHS[currentMonth]} {currentYear}
              </h3>
            </div>
            <button
              onClick={() => changeMonth(1)}
              disabled={
                currentYear >= maxDate.getFullYear() &&
                currentMonth >= maxDate.getMonth()
              }
              className="cursor-pointer rounded-full p-1 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
              title="Mes siguiente"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* <div className="mb-3 flex items-center justify-between px-2">
            <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-gray-500 select-none">
              <input
                type="checkbox"
                checked={showWeekends}
                onChange={(e) => {
                  setShowWeekends(e.target.checked);
                }}
                className="h-3.5 w-3.5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              Mostrar sábados y domingos
            </label>
          </div> */}

          <div className="grid grid-cols-7 text-center text-xs font-medium tracking-wide text-gray-400 uppercase">
            {DAYS_OF_WEEK.map((d, i) => {
              return (
                <div
                  key={i}
                  className={`py-2 ${
                    (i === 0 || i === 6) && !showWeekends ? 'text-gray-200' : ''
                  }`}
                >
                  {d}
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-sm">
            {emptySlots.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const isSelected = isSelectedDay(day);
              const today = isToday(day);
              const disabled = isDayDisabled(day);
              const newDate = new Date(selectedDate);
              newDate.setFullYear(currentYear, currentMonth, day);

              return (
                <div
                  key={day}
                  onClick={() => {
                    if (disabled) return;
                    // Deseleccionar hora al cambiar de fecha (horas no aplican de un dia a otro)
                    setSelectedDate(newDate);
                    setSelectedTime(null);
                  }}
                  className={`flex items-center justify-center py-1 ${
                    disabled ? 'cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-sm ${
                      // Transicion solo en dias habilitados (nunca en disabled).
                      !disabled ? 'transition-all duration-150 ease-out' : ''
                    } ${
                      // (Considera: dias pasados, fin de semana, fuera rango)
                      disabled
                        ? 'text-gray-200 line-through opacity-60'
                        : isSelected
                          ? // Dia seleccionado
                            'bg-emerald-600 font-semibold text-white shadow-md ring-2 ring-emerald-300'
                          : today
                            ? // Hoy
                              'bg-emerald-50 font-semibold text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100'
                            : // Dia habilitado normal (Lunes-Viernes / fin de semana si showWeekends=true)
                              'text-gray-700 hover:bg-gray-100'
                    }`}
                    title={
                      disabled
                        ? 'Día no disponible para agendar'
                        : today
                          ? 'Día de hoy'
                          : undefined
                    }
                  >
                    {day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div>
          <div className="mb-4 flex items-end justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <Clock className="h-4 w-4 text-emerald-600" />
                Horarios Disponibles
              </h3>
              <p className="mt-0.5 flex items-center gap-2 text-xs text-gray-500">
                {freeSlotsToday} cupos libres en el día seleccionado.
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 text-[11px] text-gray-400"
              title="Hora agendada, no disponible"
            >
              <Lock className="size-3" />
              Hora tomada
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((time) => {
              const disabled = isTimeDisabled(time);
              const dateKey = dayToKey(selectedDate.getDate());
              const isOccupiedInDB = occupiedSlots.has(`${dateKey} ${time}`);
              return (
                <button
                  key={time}
                  disabled={disabled}
                  onClick={() => setSelectedTime(time)}
                  title={
                    isOccupiedInDB
                      ? 'Horario ya tomado por otra cita'
                      : disabled
                        ? 'Hora no disponible (pasada o fuera de rango)'
                        : 'Hora disponible'
                  }
                  className={`relative rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                    disabled
                      ? isOccupiedInDB
                        ? 'cursor-not-allowed border-red-100 bg-red-50/60 text-red-300 line-through'
                        : 'cursor-not-allowed border-gray-200 bg-gray-50 text-gray-300'
                      : selectedTime === time
                        ? 'cursor-pointer border-emerald-600 bg-emerald-600 text-white shadow-md ring-2 ring-emerald-200'
                        : 'cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50/30 hover:text-emerald-800'
                  }`}
                >
                  {time}
                  {isOccupiedInDB && (
                    <Lock className="pointer-events-none absolute top-1 right-1 size-2.5 text-red-300" />
                  )}
                </button>
              );
            })}
          </div>

          {freeSlotsToday === 0 && (
            <div
              role="alert"
              className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800"
            >
              <Info className="mt-0.5 size-4 shrink-0" />
              <div>
                <p className="font-semibold">
                  No quedan horarios disponibles para esta fecha.
                </p>
                <p className="mt-0.5">
                  Prueba seleccionando otro día de la semana.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <button
          onClick={onBack}
          className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Volver
        </button>
        <Button
          disabled={!selectedTime || isWeekend(selectedDate)}
          onClick={onNext}
          className="h-11 gap-2 rounded-full bg-emerald-600 px-8 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
