// import { createTestUser } from '@/app/_lib/actions/usuarios';
import { Button } from '@/app/ui/components/Button';
import { Printer } from 'lucide-react';

export default async function ReportsPage() {
  // const { success, message } = await createTestUser();

  // if (!success) {
  //   return <div className="text-red-500">{message}</div>;
  // }

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
        <Button className="h-11 gap-2 text-sm shadow-md transition-all hover:shadow-lg">
          <Printer className="h-4 w-4" />
          Generar PDF
        </Button>
      </div>

      <section className="flex flex-col gap-4 xl:col-span-5"></section>
    </div>
  );
}
