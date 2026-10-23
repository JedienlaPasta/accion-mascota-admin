import { getReportStatsByYear } from '@/app/_lib/data/estadisticas';
import { getReportMetrics } from '@/app/_lib/static-data/reportes';
import MonthlyStatsTable from '@/app/ui/admin/reportes/MonthlyStatsTable';
import ReportTypeSelector from '@/app/ui/admin/reportes/ReportTypeSelector';
import YearlyStatsTable from '@/app/ui/admin/reportes/YearlyStatsTable';
import { Button } from '@/app/ui/components/Button';
import { Printer } from 'lucide-react';

type ReportsPageProps = {
  searchParams?: Promise<{ tipo?: string; year?: string }>;
};

export default async function ReportsPage(props: ReportsPageProps) {
  const searchParams = await props.searchParams;
  const tipo = searchParams?.tipo || 'OPERATIVO_SANITARIO';
  const columns = getReportMetrics(tipo);

  const yearlyStats = await getReportStatsByYear(tipo);
  const latestYear =
    yearlyStats.length > 0
      ? String(yearlyStats[0].anio)
      : new Date().getFullYear().toString();
  const year = searchParams?.year || latestYear;
  const years = yearlyStats.map((row) => row.anio.toString());

  return (
    <div className="flex min-h-full flex-col space-y-4 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">
            Reportes y Estadísticas
          </h2>
          <p className="text-muted-foreground text-sm">
            Estadísticas de atención a mascotas generadas a partir de los
            registros del sistema.
          </p>
        </div>
        {/* Top Content Buttons */}
        <Button className="h-11 gap-2 text-sm shadow-md transition-all hover:shadow-lg">
          <Printer className="h-4 w-4" />
          Generar PDF
        </Button>
      </div>

      <ReportTypeSelector activeType={tipo} />

      <section className="flex flex-col gap-6">
        <YearlyStatsTable rows={yearlyStats} columns={columns} />
        <MonthlyStatsTable
          tipo={tipo}
          year={year}
          years={years}
          defaultYear={latestYear}
          columns={columns}
        />
      </section>
    </div>
  );
}
