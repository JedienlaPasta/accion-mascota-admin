'use client';
import { useState } from 'react';
import PetSelection from './PetSelection';
import { AppointmentPet } from '@/app/_lib/data-types/citas';
import ServiceSelection from './ServiceSelection';
import DateSelection from './DateSelection';
import AppointmentConfirmation from './AppointmentConfirmation';

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
  // '02:00 PM',
  // '02:30 PM',
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
}: {
  pets: AppointmentPet[];
  searchBy: 'owner' | 'chip' | '';
}) {
  const steps: StepId[] = ['pet', 'service', 'datetime', 'confirm'];

  const [stepIndex, setStepIndex] = useState(0);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  const activeStep = steps[stepIndex];
  const progressTitle: Record<StepId, string> = {
    pet: 'Busca una Mascota',
    service: 'Selecciona un Servicio',
    datetime: 'Fecha y Hora',
    confirm: 'Confirmar Cita',
  };

  const selectedServiceDetails = SERVICES.find((s) => s.id === selectedService);
  const selectedPet = pets.find((m) => m.id === selectedPetId) || null;

  const handleConfirmAppointment = () => {
    // TODO: conectar con server action / createAppointment.
    // Por ahora placeholder: en el futuro aquí ejecutar la inserción en DB.
    // eslint-disable-next-line no-console
    console.log('Agendar cita:', {
      petId: selectedPetId,
      serviceId: selectedService,
      fecha: selectedDate.toISOString().slice(0, 10),
      hora: selectedTime,
    });
  };

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
        />
      ) : (
        <AppointmentConfirmation
          selectedServiceDetails={selectedServiceDetails}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          petName={selectedPet?.nombre_mascota || 'Mascota'}
          ownerName={selectedPet?.nombre_propietario}
          onBack={goBack}
          onConfirm={handleConfirmAppointment}
        />
      )}
    </div>
  );
}
