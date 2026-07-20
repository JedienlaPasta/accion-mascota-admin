import SummaryCard from '../SummaryCard';
import { getOwnersSummaryData } from '@/app/_lib/data/propietarios';

export default async function OwnersSummary() {
  const { total_propietarios, total_propietarios_verificados } =
    await getOwnersSummaryData();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SummaryCard
        title="Total Propietarios"
        value={total_propietarios || 0}
        icon="user"
      />
      <SummaryCard
        title="Propietarios Verificados"
        value={total_propietarios_verificados || 0}
        icon="userCheck"
      />
    </div>
  );
}
