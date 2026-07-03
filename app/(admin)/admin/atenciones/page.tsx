import { historialClinico } from '@/app/_lib/mock-data';
import VisitRecordDetailModal from '@/app/ui/admin/atenciones/VisitRecordDetailModal';
import VisitsTable from '@/app/ui/admin/atenciones/VisitsTable';
import SummaryCard from '@/app/ui/admin/dashboard/SummaryCard';
import TableWrapper from '@/app/ui/admin/TableWrapper';
import { SecondaryButton } from '@/app/ui/components/Button';
import { Plus } from 'lucide-react';

type VisitsRecordsPageAdmin = {
  searchParams?: Promise<{ visitId?: string }>;
};

export default async function AtencionesPageAdmin(
  props: VisitsRecordsPageAdmin
) {
  const searchParams = await props.searchParams;
  const id = searchParams?.visitId || '';

  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Visit Details Modal */}
      {id && <VisitRecordDetailModal id={id} visitRecords={historialClinico} />}
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Registro de Atenciones
          </h2>
          <p className="text-muted-foreground text-sm">
            Administra los datos de las atenciones.
          </p>
        </div>
        {/* Top Content Buttons */}
        <div className="flex flex-wrap gap-2">
          <SecondaryButton className="gap-2 bg-white px-4 text-sm">
            <Plus className="h-4 w-4" />
            Nueva Atencion
          </SecondaryButton>
        </div>
      </div>
      <section className="flex flex-col gap-4 xl:col-span-5">
        {/* <SummaryCards /> */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard title="Total Atenciones" value={55} icon="user" />
          <SummaryCard title="Consultas" value={34} icon="paw" />
          <SummaryCard title="Vacunaciones" value={16} icon="paw" />
          <SummaryCard title="Cirugias" value={3} icon="paw" />
        </div>

        {/* Atenciones Table */}
        <TableWrapper title="Atenciones">
          <VisitsTable />
        </TableWrapper>
      </section>
    </div>
  );
}
