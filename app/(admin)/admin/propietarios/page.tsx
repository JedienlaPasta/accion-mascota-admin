import SummaryCard from '@/app/ui/admin/dashboard/SummaryCard';
import OwnersTable from '@/app/ui/admin/propietarios/OwnersTable';
import TableWrapper from '@/app/ui/admin/TableWrapper';
import { SecondaryButton } from '@/app/ui/components/Button';
import { Plus } from 'lucide-react';

export default function ProietariosPageAdmin() {
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
        {/* <SummaryCards /> */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SummaryCard title="Total Propietarios" value={78} icon="user" />
          <SummaryCard title="Total Mascotas" value={100} icon="paw" />
        </div>

        {/* Pets Table */}
        <TableWrapper title="Propietarios">
          <OwnersTable />
        </TableWrapper>
      </section>
    </div>
  );
}
