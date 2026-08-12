import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DAYS_OF_WEEK, MONTHS, TIME_SLOTS } from './AppointmentForm';
import { Button } from '@/app/ui/components/Button';

export default function DateSelection({
  selectedDate,
  selectedTime,
  setSelectedDate,
  setSelectedTime,
  onBack,
  onNext,
}: {
  selectedDate: Date;
  selectedTime: string | null;
  setSelectedDate: (date: Date) => void;
  setSelectedTime: (time: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  // Calendar Logic
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

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

    // Primer dia del mes para evitar saltar meses (e.g. Ene 31 -> Feb)
    newDate.setDate(1);
    newDate.setMonth(newDate.getMonth() + offset);

    const year = newDate.getFullYear();
    const month = newDate.getMonth();
    const daysInTargetMonth = getDaysInMonth(year, month);

    // Ajustar dia al maximo del mes objetivo (e.g. Ene 31 -> Feb 28)
    newDate.setDate(Math.min(currentDay, daysInTargetMonth));

    setSelectedDate(newDate);
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Selecciona Fecha y Hora
        </h1>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Calendar */}
        <div>
          <div className="mb-4 flex items-center justify-between px-2">
            <button
              onClick={() => changeMonth(-1)}
              className="cursor-pointer rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-bold text-gray-900">
              {MONTHS[currentMonth]} {currentYear}
            </h3>
            <button
              onClick={() => changeMonth(1)}
              className="cursor-pointer rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-7 text-center text-xs font-medium tracking-wide text-gray-400 uppercase">
            {DAYS_OF_WEEK.map((d, i) => (
              <div key={i} className="py-2">
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-2 text-sm">
            {emptySlots.map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {days.map((day) => {
              const isSelected = isSelectedDay(day);
              const today = isToday(day);
              return (
                <div
                  key={day}
                  onClick={() => {
                    const newDate = new Date(selectedDate);
                    newDate.setDate(day);
                    setSelectedDate(newDate);
                  }}
                  className="flex cursor-pointer items-center justify-center py-1"
                >
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                      isSelected
                        ? 'bg-emerald-600 font-semibold text-white shadow-md'
                        : today
                          ? 'bg-emerald-50 font-semibold text-emerald-600'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
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
          <h3 className="mb-4 text-lg font-bold text-gray-900">
            Horarios Disponibles
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {TIME_SLOTS.map((time) => (
              <button
                key={time}
                disabled={!time.includes('1')}
                onClick={() => setSelectedTime(time)}
                className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition-all ${
                  !time.includes('1')
                    ? 'cursor-not-allowed border-gray-200 bg-white text-gray-300'
                    : selectedTime === time
                      ? 'cursor-pointer border-emerald-600 bg-emerald-600 text-white shadow-md'
                      : 'cursor-pointer border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
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
          disabled={!selectedTime}
          onClick={onNext}
          className="h-11 gap-2 rounded-full bg-emerald-600 px-8 hover:bg-emerald-700 disabled:opacity-50"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
