'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createAppointment } from '@/app/_lib/actions/citas';
import PetSelection from './PetSelection';
import { AppointmentPet } from '@/app/_lib/data-types/citas';
import ServiceSelection from './ServiceSelection';
import DateSelection from './DateSelection';
import AppointmentConfirmation from './AppointmentConfirmation';
import { toast } from 'sonner';

export const SERVICES = [
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

export const TIME_SLOTS = [
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
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
];

export const DAYS_OF_WEEK = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
export const MONTHS = [
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

export default function AppointmentForm({
  pets,
  searchBy,
  occupiedSlots = [],
  minDateIso,
  maxDateIso,
}: {
  pets: AppointmentPet[];
  searchBy: 'owner' | 'chip' | '';
  occupiedSlots?: string[];
  minDateIso: string;
  maxDateIso: string;
}) {
  const router = useRouter();
  const steps: StepId[] = ['pet', 'service', 'datetime', 'confirm'];

  // ======= OCCUPIED SLOTS en Set para chequeos =======
  const occupiedSet = new Set(occupiedSlots);

  // Helper: primer dia disponible entre lunes y viernes (no pasado, no bloqueado)
  const defaultSelectedDate = (() => {
    const min = new Date(minDateIso + 'T00:00:00');
    const max = new Date(maxDateIso + 'T00:00:00');
    const start = new Date(Math.max(min.getTime(), Date.now()));
    start.setHours(0, 0, 0, 0);
    for (let offset = 0; offset <= 31; offset++) {
      const d = new Date(start);
      d.setDate(start.getDate() + offset);
      if (d > max) break;
      const weekday = d.getDay(); // 0=Dom, 6=Sab
      if (weekday === 0 || weekday === 6) continue; // saltar fines de semana
      return d;
    }
    return new Date(minDateIso + 'T12:00:00');
  })();

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(defaultSelectedDate);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const activeStep = steps[stepIndex];
  const progressTitle: Record<StepId, string> = {
    pet: 'Busca una Mascota',
    service: 'Selecciona un Servicio',
    datetime: 'Fecha y Hora',
    confirm: 'Confirmar Cita',
  };

  const selectedServiceDetails = SERVICES.find((s) => s.id === selectedService);
  const selectedPet = pets.find((m) => m.id === selectedPetId) || null;

  const handleConfirmAppointment = async () => {
    if (isSubmitting) return;

    const pet = pets.find((m) => m.id === selectedPetId);
    const svc = SERVICES.find((s) => s.id === selectedService);
    if (!pet || !svc || !selectedTime) {
      setSubmitError('Faltan datos para agendar la cita');
      return;
    }

    if (isWeekend(selectedDate)) {
      setSubmitError('No se puede agendar en fines de semana');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Guardando consulta...');

    try {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      const dateIsoLocal = `${y}-${m}-${d}`;

      const response = await createAppointment({
        petPublicId: pet.id,
        serviceName: svc.name,
        dateIso: dateIsoLocal,
        time24: selectedTime,
      });

      if (!response.success) {
        // response.code como clasificador de error para el toast
        const ERROR_TITLE_BY_CODE: Record<
          NonNullable<typeof response.code>,
          string
        > = {
          VALIDATION: 'Revisa los datos de la cita',
          NOT_FOUND: 'No encontramos el registro',
          CONFLICT: 'Este horario ya está agendado',
          DB_ERROR: 'No se pudo guardar la cita',
        };
        const title = ERROR_TITLE_BY_CODE[response.code] ?? 'Error al agendar';
        toast.error(title, {
          id: toastId,
          description: response.error,
          duration: 5500,
        });
        setSubmitError(`${title}, ${response.error.toLowerCase()}`);
        return;
      }

      setTimeout(() => {
        toast.success(response.message, {
          id: toastId,
          description: `${svc.name} · ${pet.nombre_mascota} · ${selectedDate.toLocaleDateString('es-CL')} ${selectedTime}`,
          duration: 2800,
        });
      }, 500);

      setTimeout(() => {
        router.push('/admin/citas');
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al agendar la cita';
      toast.error(message, {
        id: toastId,
        description: 'Revisa los datos e intenta nuevamente.',
        duration: 5000,
      });
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const goNext = () => {
    // Antes de avanzar al siguiente paso, limpiar errores anteriores de submit
    setSubmitError(null);
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const goBack = () => {
    setSubmitError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const isWeekend = (date: Date) => {
    const weekday = date.getDay();
    return weekday === 0 || weekday === 6;
  };

  const currentStepNumber = stepIndex + 1;
  const totalSteps = steps.length;
  const progressPercent = `${Math.round((currentStepNumber / totalSteps) * 100)}%`;

  // Si confirmación tiene error, mostrar banner arriba del todo
  const showError = Boolean(submitError && activeStep === 'confirm');

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

      {showError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100"
        >
          <span className="font-semibold">No se pudo agendar:</span>
          <span>{submitError}</span>
        </div>
      )}

      {activeStep === 'pet' ? (
        <PetSelection
          pets={pets}
          searchBy={searchBy}
          selectedPetId={selectedPetId}
          setSelectedPetId={setSelectedPetId}
          onNext={goNext}
        />
      ) : activeStep === 'service' ? (
        <ServiceSelection
          selectedService={selectedService}
          setSelectedService={setSelectedService}
          onBack={goBack}
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
          isWeekend={isWeekend}
          occupiedSlots={occupiedSet}
          minDateIso={minDateIso}
          maxDateIso={maxDateIso}
        />
      ) : (
        <div className="space-y-6">
          <AppointmentConfirmation
            selectedServiceDetails={selectedServiceDetails}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            petName={selectedPet?.nombre_mascota || 'Mascota'}
            ownerName={selectedPet?.nombre_propietario}
            onBack={goBack}
            onConfirm={handleConfirmAppointment}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </div>
  );
}
