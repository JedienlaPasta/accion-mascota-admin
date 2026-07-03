'use client';
import { calcularEdad } from '@/app/(portal)/portal/mascotas/page';
import { especieIcon, mascotas } from '@/app/_lib/mock-data';
import { capitalize } from '@/app/_lib/utils/format';
import { Button } from '@/app/ui/components/Button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useState } from 'react';

const SERVICES = [
  {
    id: '1',
    name: 'Consulta General',
    description: 'Examen de rutina para evaluar el estado general de salud.',
    price: '$5.000',
  },
  {
    id: '2',
    name: 'Vacunación',
    description:
      'Administración de vacunas esenciales para prevenir enfermedades.',
    price: '$8.000',
  },
  {
    id: '3',
    name: 'Limpieza Dental',
    description: 'Limpieza profunda para eliminar placa y sarro.',
    price: '$12.000',
  },
  {
    id: '4',
    name: 'Desparasitación',
    description: 'Tratamiento interno y externo contra parásitos.',
    price: 'Gratis',
  },
];

const TIME_SLOTS = [
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  // '02:00 PM',
  // '02:30 PM',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

const DAYS_OF_WEEK = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

type StepId = 'pet' | 'service' | 'datetime' | 'confirm';

export default function AppointmentForm({ petId }: { petId: string }) {
  const hasFixedPet = Boolean(petId);
  const steps: StepId[] = hasFixedPet
    ? ['service', 'datetime', 'confirm']
    : ['pet', 'service', 'datetime', 'confirm'];

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    petId || null
  );

  const activeStep = steps[stepIndex];
  const progressTitle: Record<StepId, string> = {
    pet: 'Selecciona tu mascota',
    service: 'Selecciona un Servicio',
    datetime: 'Fecha y Hora',
    confirm: 'Confirmar Cita',
  };

  const selectedServiceDetails = SERVICES.find((s) => s.id === selectedService);
  const selectedPet = mascotas.find((m) => m.id === selectedPetId) || null;

  const goNext = () => {
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => {
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const currentStepNumber = stepIndex + 1;
  const totalSteps = steps.length;
  const progressPercent = `${Math.round((currentStepNumber / totalSteps) * 100)}%`;

  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {progressTitle[activeStep]}
          </h2>
          <span className="text-sm font-medium text-emerald-600">
            Paso {currentStepNumber} de {totalSteps}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: progressPercent }}
          />
        </div>
      </div>

      {activeStep === 'pet' ? (
        <PetSelection
          selectedPetId={selectedPetId}
          setSelectedPetId={setSelectedPetId}
          onNext={goNext}
        />
      ) : activeStep === 'service' ? (
        <ServiceSelection
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onBack={hasFixedPet ? undefined : goBack}
          onNext={goNext}
        />
      ) : activeStep === 'datetime' ? (
        <DateSelection
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          setSelectedDate={setSelectedDate}
          setSelectedTime={setSelectedTime}
          onBack={goBack}
          onNext={goNext}
        />
      ) : (
        <Confirmation
          selectedServiceDetails={selectedServiceDetails}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          petName={selectedPet?.nombre || 'Mascota'}
          onBack={goBack}
        />
      )}
    </div>
  );
}

function PetSelection({
  selectedPetId,
  setSelectedPetId,
  onNext,
}: {
  selectedPetId: string | null;
  setSelectedPetId: (petId: string | null) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Selecciona tu Mascota
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {mascotas.map((mascota) => {
          const Icon = especieIcon[mascota.especie];
          return (
            <div
              key={mascota.id}
              onClick={() => setSelectedPetId(mascota.id)}
              className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-all hover:shadow-md ${
                selectedPetId === mascota.id
                  ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                  : 'border-gray-200 bg-white hover:border-emerald-200'
              }`}
            >
              <div className="flex w-full items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-50 ring-1 ring-gray-100">
                    <Icon className="h-8 w-8 text-gray-600" />
                  </div>

                  {/* Info Principal */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {mascota.nombre}
                    </h3>
                    <p className="text-sm font-medium text-gray-500">
                      {mascota.raza}
                    </p>
                    <p className="text-xs text-gray-400">
                      {calcularEdad(mascota.fechaNacimiento)}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                    selectedPetId === mascota.id
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-gray-300/80 bg-white text-white'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 flex justify-end">
        <Button
          disabled={!selectedPetId}
          onClick={onNext}
          className="h-11 rounded-full px-8 disabled:opacity-50"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

function ServiceSelection({
  selectedService,
  setSelectedService,
  onBack,
  onNext,
}: {
  selectedService: string | null;
  setSelectedService: (serviceId: string) => void;
  onBack?: () => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Selecciona un Servicio
        </h1>
      </div>
      <div className="grid gap-4">
        {SERVICES.map((service) => (
          <div
            key={service.id}
            onClick={() => setSelectedService(service.id)}
            className={`group flex cursor-pointer items-center justify-between gap-4 rounded-xl border px-5 py-4 transition-all hover:shadow-md ${
              selectedService === service.id
                ? 'border-emerald-500 bg-emerald-50/30 ring-1 ring-emerald-500'
                : 'border-gray-200 bg-white hover:border-emerald-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex size-6 items-center justify-center rounded-full border-2 transition-colors ${
                  selectedService === service.id
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-gray-300/80 bg-white text-white'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3
                  className={`font-semibold ${
                    selectedService === service.id
                      ? 'text-emerald-900'
                      : 'text-gray-900'
                  }`}
                >
                  {service.name}
                </h3>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-emerald-600">
              {service.price}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex items-center justify-between">
        {onBack ? (
          <button
            onClick={onBack}
            className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            Volver
          </button>
        ) : (
          <span />
        )}
        <Button
          disabled={!selectedService}
          onClick={onNext}
          className="h-11 rounded-full px-8 disabled:opacity-50"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}

function DateSelection({
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

function Confirmation({
  selectedServiceDetails,
  selectedDate,
  selectedTime,
  petName,
  onBack,
}: {
  selectedServiceDetails:
    | {
        id: string;
        name: string;
        description: string;
        price: string;
      }
    | undefined;
  selectedDate: Date;
  selectedTime: string | null;
  petName: string;
  onBack: () => void;
}) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Está todo correcto?
        </h1>
        <p className="mt-2 text-gray-500">
          Por favor revisa los detalles antes de confirmar.
        </p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Servicio</p>
              <p className="font-semibold text-gray-900">
                {selectedServiceDetails?.name}
              </p>
              <p className="text-sm text-gray-500">
                {selectedServiceDetails?.price}
              </p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Fecha</p>
              <p className="font-semibold text-gray-900">
                {capitalize(
                  selectedDate.toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                )}
              </p>
              <p className="text-sm text-gray-500">{selectedTime}</p>
            </div>
          </div>

          <div className="h-px w-full bg-gray-200" />

          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-rose-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className=""
              >
                <circle cx="11" cy="4" r="2" />
                <circle cx="18" cy="8" r="2" />
                <circle cx="20" cy="16" r="2" />
                <path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Mascota</p>
              <p className="font-semibold text-gray-900 uppercase">{petName}</p>
            </div>
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
        <Button className="h-11 gap-2 rounded-full bg-emerald-600 px-8 hover:bg-emerald-700">
          <Check className="h-4 w-4" />
          Agendar Cita
        </Button>
      </div>
    </div>
  );
}
