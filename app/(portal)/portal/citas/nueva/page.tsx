import { BaseMutedLink } from '@/app/ui/components/Link';
import AppointmentForm from '@/app/ui/portal/citas/nueva/[id]/AppointmentForm';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function NuevaCitaPage({ params }: PageProps) {
  const { id } = await params;
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
          <BaseMutedLink href="/portal/citas">
            <X className="h-4 w-4" />
            Cancelar
          </BaseMutedLink>
        </div>
      </div>

      <div className="mx-auto max-w-4xl">
        <AppointmentForm petId={id} />
      </div>
    </div>
  );
}
