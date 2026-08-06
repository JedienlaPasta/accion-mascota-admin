import { SecondaryButton } from '@/app/ui/components/Button';
import { Printer } from 'lucide-react';

export default async function ReportsPage() {
  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Reportes Administrativos
          </h2>
          <p className="text-muted-foreground text-sm">
            Genera reportes administrativos sobre estadisticas de atencion a
            mascotas.
          </p>
        </div>
        {/* Top Content Buttons */}
        <div className="flex flex-wrap gap-2">
          <SecondaryButton className="gap-2 bg-white px-4 text-sm">
            <Printer className="size-4" />
            Generar PDF
          </SecondaryButton>
        </div>
      </div>

      <section className="flex flex-col gap-4 xl:col-span-5"></section>
    </div>
  );
}
