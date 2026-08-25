import { getVisitsSummary } from '@/app/_lib/data/atenciones';
import VisitRecordDetail from '@/app/ui/admin/atenciones/VisitRecordDetail';
import VisitsTable from '@/app/ui/admin/atenciones/VisitsTable';
import VisitsTableSkeleton from '@/app/ui/admin/atenciones/VisitsTableSkeleton';
import SummaryCard from '@/app/ui/admin/SummaryCard';
import TableWrapper from '@/app/ui/admin/TableWrapper';
import { BaseLink } from '@/app/ui/components/Link';
import { Plus } from 'lucide-react';
import { Suspense } from 'react';

type VisitsRecordsPageAdmin = {
  searchParams?: Promise<{
    visitId?: string;
    query?: string;
    page?: number;
  }>;
};

export default async function AtencionesPageAdmin(
  props: VisitsRecordsPageAdmin
) {
  const searchParams = await props.searchParams;
  const id = searchParams?.visitId || '';

  const summary = await getVisitsSummary();

  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Modal detalle atención */}
      {id && <VisitRecordDetail id={id} />}

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Registro de Atenciones
          </h2>
          <p className="text-muted-foreground text-sm">
            Administra los datos de las atenciones clínicas.
          </p>
        </div>
        <BaseLink
          href="/admin/atenciones/nueva"
          className="h-11 gap-2 text-sm shadow-md transition-all hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Nueva Atención
        </BaseLink>
      </div>

      {/* Summary Cards */}
      <section className="flex flex-col gap-4 xl:col-span-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            title="Total Atenciones"
            value={summary.total_atenciones}
            icon="report"
          />
          <SummaryCard
            title="Consultas Médicas"
            value={summary.total_consultas_medicas}
            icon="user"
          />
          <SummaryCard
            title="Operativos Sanitarios"
            value={summary.total_operativos_sanitarios}
            icon="calendar"
          />
          <SummaryCard
            title="Operativos Esterilización"
            value={summary.total_operativos_esterilizacion}
            icon="paw"
          />
        </div>

        {/* Tabla atenciones (ahora con searchParams para filtros reales) */}
        <TableWrapper title="Atenciones">
          <Suspense fallback={<VisitsTableSkeleton />}>
            <VisitsTable searchParams={searchParams} />
          </Suspense>
        </TableWrapper>
      </section>
    </div>
  );
}
