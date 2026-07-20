import { getSummaryData } from '@/app/_lib/data/mascotas';
import SummaryCard from '../SummaryCard';

export default async function PetsSummary() {
  const { total_mascotas, total_perros, total_gatos } = await getSummaryData();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SummaryCard
        title="Total Mascotas"
        value={total_mascotas || 0}
        icon="paw"
      />
      <SummaryCard title="Total Perros" value={total_perros || 0} icon="dog" />
      <SummaryCard title="Total Gatos" value={total_gatos || 0} icon="cat" />
    </div>
  );
}
