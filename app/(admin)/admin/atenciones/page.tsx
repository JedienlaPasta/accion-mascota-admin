import { getVisitsSummary } from '@/app/_lib/data/consultas';
import VisitRecordDetailModal from '@/app/ui/admin/atenciones/VisitRecordDetailModal';
import VisitsTable from '@/app/ui/admin/atenciones/VisitsTable';
import VisitsTableSkeleton from '@/app/ui/admin/atenciones/VisitsTableSkeleton';
import SummaryCard from '@/app/ui/admin/SummaryCard';
import TableWrapper from '@/app/ui/admin/TableWrapper';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import {
  ClipboardList,
  Plus,
  Stethoscope,
  Syringe,
  Scissors,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

type VisitsRecordsPageAdmin = {
  searchParams?: Promise<{
    visitId?: string;
    q?: string;
    tipo?: string;
    desde?: string;
    hasta?: string;
  }>;
};

export default async function AtencionesPageAdmin(
  props: VisitsRecordsPageAdmin
) {
  const searchParams = await props.searchParams;
  const id = searchParams?.visitId || '';

  // Stats reales desde la BD (no hardcodeados)
  const summary = await getVisitsSummary();

  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Modal detalle (ahora el modal consulta la BD internamente, no usa mock) */}
      {/* {id && <VisitRecordDetailModal id={id} />} */}

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
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/atenciones/nueva">
            <Button className="h-11 gap-2 px-5 text-sm shadow-md transition-all hover:shadow-lg">
              <Plus className="h-4 w-4" />
              Nueva Atención
            </Button>
          </Link>
        </div>
      </div>

      {/* ===== Summary Cards con datos REALES + íconos correctos ===== */}
      <section className="flex flex-col gap-4 xl:col-span-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <SummaryCard
            title="Total Atenciones"
            value={summary.total_atenciones}
            icon="report"
          />
          <SummaryCard
            title="Consultas"
            value={summary.total_consultas}
            icon="user"
          />
          <SummaryCard
            title="Vacunaciones"
            value={summary.total_vacunaciones}
            icon="calendar"
          />
          <SummaryCard
            title="Cirugías / Operativos"
            value={summary.total_cirugias}
            icon="paw"
          />
          <SummaryCard
            title="Controles / Seguimientos"
            value={summary.total_controles + summary.total_emergencias}
            icon="month"
          />
        </div>

        {/* ===== Leyenda íconos rápida ===== */}
        <div className="hidden flex-wrap items-center gap-3 rounded-2xl border border-gray-100 bg-white/60 px-4 py-3 text-xs text-gray-500 sm:flex">
          <span className="font-semibold text-gray-600">Tipos:</span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-sky-50 px-2 py-1 text-sky-700 ring-1 ring-sky-200/60">
            <Stethoscope className="size-3.5" /> Consulta
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-emerald-700 ring-1 ring-emerald-200/60">
            <Syringe className="size-3.5" /> Vacunación
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-rose-50 px-2 py-1 text-rose-700 ring-1 ring-rose-200/60">
            <Scissors className="size-3.5" /> Cirugía
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-violet-50 px-2 py-1 text-violet-700 ring-1 ring-violet-200/60">
            <ClipboardList className="size-3.5" /> Control
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-orange-50 px-2 py-1 text-orange-700 ring-1 ring-orange-200/60">
            <Activity className="size-3.5" /> Emergencia
          </span>
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
