import SearchBar from '@/app/ui/admin/dashboard/SearchBar';
import SummaryCard from '@/app/ui/admin/SummaryCard';
import OwnersTable from '@/app/ui/admin/propietarios/OwnersTable';
import OwnersTableSkeleton from '@/app/ui/admin/propietarios/OwnersTableSkeleton';
import { SecondaryButton } from '@/app/ui/components/Button';
import { ListFilter, Plus } from 'lucide-react';
import { Suspense } from 'react';
import OwnersSummary from '@/app/ui/admin/propietarios/OwnersSummary';
import OwnersSummarySkeleton from '@/app/ui/admin/propietarios/OwnersSummarySkeleton';

type OwnersTableProps = {
  searchParams?: Promise<{ query?: string }>;
};

export default async function PropietariosPageAdmin(props: OwnersTableProps) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query ?? '';

  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Registro de Propietarios
          </h2>
          <p className="text-muted-foreground text-sm">
            Administra los datos de los propietarios registrados.
          </p>
        </div>
        {/* Top Content Buttons */}
        <div className="flex flex-wrap gap-2">
          <SecondaryButton className="gap-2 bg-white px-4 text-sm">
            <Plus className="h-4 w-4" />
            Nuevo Propietario
          </SecondaryButton>
        </div>
      </div>
      <section className="flex flex-col gap-4 xl:col-span-5">
        <Suspense fallback={<OwnersSummarySkeleton />}>
          <OwnersSummary />
        </Suspense>

        {/* Owners Table */}
        <div className="flex flex-col space-y-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Propietarios</h2>
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
          <Suspense fallback={<OwnersTableSkeleton />}>
            <OwnersTable query={query} />
          </Suspense>
        </div>
      </section>
    </div>
  );
}
