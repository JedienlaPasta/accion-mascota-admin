import { todasLasMascotas } from '@/app/_lib/mock-data';
import SummaryCard from '@/app/ui/admin/dashboard/SummaryCard';
import PetRecord from '@/app/ui/admin/mascotas/PetRecord';
import PetsTable from '@/app/ui/admin/mascotas/PetsTable';
import TableWrapper from '@/app/ui/admin/TableWrapper';
import { SecondaryButton } from '@/app/ui/components/Button';
import { Plus } from 'lucide-react';

type MascotasPageProps = {
  searchParams?: Promise<{ id?: string }>;
};

export default async function MascotasPageAdmin(props: MascotasPageProps) {
  const searchParams = await props.searchParams;
  const id = searchParams?.id ?? '';

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
        {/* <SummaryCards /> */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard title="Total Mascotas" value={100} icon="paw" />
          <SummaryCard title="Total Perros" value={53} icon="dog" />
          <SummaryCard title="Total Gatos" value={47} icon="cat" />
        </div>

        {/* Pets Table */}
        <TableWrapper title="Mascotas">
          <PetsTable data={todasLasMascotas} />
        </TableWrapper>
      </section>
    </div>
  );
}
