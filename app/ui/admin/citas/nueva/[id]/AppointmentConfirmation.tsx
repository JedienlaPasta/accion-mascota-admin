import { capitalize, capitalizeAll } from '@/app/_lib/utils/format';
import { Button } from '@/app/ui/components/Button';
import {
  Check,
  CalendarDays,
  PawPrint,
  CheckCircle2,
  Stethoscope,
  User2,
} from 'lucide-react';

type ServiceSummary = {
  id: string;
  name: string;
  description: string;
  price: string;
};

export default function AppointmentConfirmation({
  selectedServiceDetails,
  selectedDate,
  selectedTime,
  petName,
  ownerName,
  onBack,
  onConfirm,
}: {
  selectedServiceDetails?: ServiceSummary;
  selectedDate: Date;
  selectedTime: string | null;
  petName: string;
  ownerName?: string;
  onBack: () => void;
  /** Handler para confirmar la cita. Si no se pasa, el botón es solo UI. */
  onConfirm?: () => void;
}) {
  const isReady = Boolean(selectedServiceDetails && selectedTime && petName);
  return (
    <div className="space-y-8">
      {/* Header con badge igual que el estilo PetSelection */}
      <div className="flex flex-col items-center space-y-1.5 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          ¿Está todo correcto?
        </h1>
        <p className="text-sm text-gray-500">
          Revisa los detalles antes de agendar la cita.
        </p>
      </div>

      {/* Card de resumen */}
      <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 ring-1 ring-gray-50">
        <div className="divide-y divide-gray-100">
          {/* Row SERVICIO + precio alineado a la derecha */}
          <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                <Stethoscope className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  Servicio
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {selectedServiceDetails?.name ?? '—'}
                </p>
                {selectedServiceDetails?.description ? (
                  <p className="text-xs text-gray-500">
                    {selectedServiceDetails.description}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Valor
              </p>
              <p className="text-base font-medium tabular-nums">
                {selectedServiceDetails?.price ?? '—'}
              </p>
            </div>
          </div>

          {/* Row FECHA + HORA */}
          <div className="flex items-start justify-between gap-4 py-4 first:pt-0 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                <CalendarDays className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  Fecha
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {capitalize(
                    selectedDate.toLocaleDateString('es-CL', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })
                  )}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                Hora
              </p>
              <p className="text-base font-medium tabular-nums">
                {selectedTime ? selectedTime : '—'}
              </p>
            </div>
          </div>

          {/* Row MASCOTA + DUEÑO (NUEVO: info del dueño que faltaba en admin) */}
          <div className="flex items-start justify-between gap-4 py-4 text-gray-700 first:pt-0 last:pb-0">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-100">
                <PawPrint className="size-5" />
              </div>
              <div>
                <p className="text-xs font-semibold tracking-wide text-gray-400 uppercase">
                  Mascota
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {petName ? capitalize(petName) : '—'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="flex items-center justify-end gap-1.5 text-xs font-semibold tracking-wide text-gray-400 uppercase">
                <User2 className="size-3" />
                Dueño
              </p>
              <p className="text-base font-medium">
                {ownerName ? capitalizeAll(ownerName) : 'Sin propietario'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones (consistentes con PetSelection) */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-6">
        <button
          onClick={onBack}
          className="cursor-pointer text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          Volver
        </button>
        <Button
          type="button"
          disabled={!isReady}
          onClick={onConfirm}
          className="h-11 gap-2 rounded-full bg-emerald-600 px-8 hover:bg-emerald-700 disabled:opacity-50"
        >
          <Check className="h-4 w-4" />
          Agendar Cita
        </Button>
      </div>
    </div>
  );
}
