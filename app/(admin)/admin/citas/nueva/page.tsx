import { AppointmentPet } from '@/app/_lib/data-types/citas';
import {
  getPetsForAppointmentByQuery,
  getOccupiedSlotsForDateRange,
} from '@/app/_lib/data/citas';
import AppointmentForm from '@/app/ui/admin/citas/nueva/[id]/AppointmentForm';
import { BaseMutedLink } from '@/app/ui/components/Link';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  searchParams?: Promise<{ query?: string; searchBy?: 'owner' | 'chip' }>;
};

export default async function NuevaCitaPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';
  const searchBy = searchParams?.searchBy ?? '';

  let pets: AppointmentPet[] = [];
  if (query.length >= 3) {
    pets = await getPetsForAppointmentByQuery(query, searchBy);
  }

  // Rango de fechas disponible para agendar citas.
  const MAX_DAYS_AHEAD = 62;

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + MAX_DAYS_AHEAD);

  const toIso = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
      d.getDate()
    ).padStart(2, '0')}`;

  const occupiedSlotKeys = await getOccupiedSlotsForDateRange(
    toIso(startDate),
    toIso(endDate)
  );
  // Set no es serializable en Server Components props, pasado como Array
  const occupiedSlots = Array.from(occupiedSlotKeys);
  const minDateIso = toIso(startDate);
  const maxDateIso = toIso(endDate);

  return (
    <div className="min-h-full bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="mx-auto mb-8 flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              href="/portal/mascotas"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
          <h1 className="text-foreground text-3xl font-bold">Agendar Cita</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Rellena los siguientes campos para agendar una cita para tu mascota.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BaseMutedLink href="/admin/citas">
            <X className="h-4 w-4" />
            Cancelar
          </BaseMutedLink>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <AppointmentForm
          pets={pets}
          searchBy={searchBy}
          occupiedSlots={occupiedSlots}
          minDateIso={minDateIso}
          maxDateIso={maxDateIso}
        />
      </div>
    </div>
  );
}
