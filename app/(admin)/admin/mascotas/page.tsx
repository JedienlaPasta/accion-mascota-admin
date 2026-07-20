import { todasLasMascotas } from '@/app/_lib/mock-data';
import SearchBar from '@/app/ui/admin/dashboard/SearchBar';
import PetRecord from '@/app/ui/admin/mascotas/PetRecord';
import PetsTable from '@/app/ui/admin/mascotas/PetsTable';
import PetsTableSkeleton from '@/app/ui/admin/mascotas/PetsTableSkeleton';
import { SecondaryButton } from '@/app/ui/components/Button';
import { ListFilter, Plus } from 'lucide-react';
import { Suspense } from 'react';
import PetsSummary from '@/app/ui/admin/dashboard/PetsSummary';
import PetsSummarySkeleton from '@/app/ui/admin/dashboard/PetsSummarySkeleton';

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
          <SecondaryButton className="gap-2 bg-white px-4 text-sm">
            <Plus className="h-4 w-4" />
            Nueva Mascota
          </SecondaryButton>
        </div>
      </div>
      <section className="flex flex-col gap-4 xl:col-span-5">
        <Suspense fallback={<PetsSummarySkeleton />}>
          <PetsSummary />
        </Suspense>

        {/* Pets Table */}
        <div className="flex flex-col space-y-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Mascotas</h2>
            <div className="flex gap-4">
              <SecondaryButton className="gap-2 px-3! text-sm">
                <ListFilter className="h-4 w-4" />
                Filtros
              </SecondaryButton>
              <Suspense
                fallback={
                  <input
                    disabled
                    placeholder="Buscar"
                    className="flex h-10 min-w-52 flex-1 items-center rounded-lg border border-slate-200 bg-white px-4 shadow-sm"
                  />
                }
              >
                <SearchBar placeholder="Buscar" />
              </Suspense>
            </div>
          </div>
          <Suspense fallback={<PetsTableSkeleton />}>
            <PetsTable query={query} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
