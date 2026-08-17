import { todasLasMascotas } from '@/app/_lib/mock-data';
import PetRecord from '@/app/ui/admin/mascotas/PetRecord';
import PetsTable from '@/app/ui/admin/mascotas/PetsTable';
import PetsTableSkeleton from '@/app/ui/admin/mascotas/PetsTableSkeleton';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';
import PetsSummary from '@/app/ui/admin/mascotas/PetsSummary';
import PetsSummarySkeleton from '@/app/ui/admin/mascotas/PetsSummarySkeleton';
import { SmallBaseMutedLink } from '@/app/ui/components/Link';
import TableWrapper from '@/app/ui/admin/TableWrapper';

type MascotasPageProps = {
  searchParams?: Promise<{ id?: string; query?: string }>;
};

export default async function MascotasPageAdmin(props: MascotasPageProps) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id ?? '';
  const query = searchParams?.query ?? '';

  return (
    <div className="flex min-h-full w-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Pet Record Modal */}
      {id && <PetRecord id={id} mockData={todasLasMascotas} />}
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Registro de Mascotas
          </h2>
          <p className="text-muted-foreground text-sm">
            Administra los datos de las mascotas registradas.
          </p>
        </div>
        {/* Top Content Buttons */}
        <div className="flex flex-wrap gap-2">
          <SmallBaseMutedLink
            href="/admin/mascotas/nueva"
            className="gap-2 bg-white px-4 text-sm"
          >
            <Plus className="h-4 w-4" />
            Nueva Mascota
          </SmallBaseMutedLink>
        </div>
      </div>
      <section className="flex flex-col gap-4 xl:col-span-5">
        <Suspense fallback={<PetsSummarySkeleton />}>
          <PetsSummary />
        </Suspense>

        {/* Pets Table */}
        <TableWrapper title="Mascotas">
          <Suspense fallback={<PetsTableSkeleton />}>
            <PetsTable query={query} />
          </Suspense>
        </TableWrapper>
      </section>
    </div>
  );
}
