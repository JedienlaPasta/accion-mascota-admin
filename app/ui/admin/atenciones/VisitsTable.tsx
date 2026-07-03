import { adminVisitRegistry } from '@/app/_lib/mock-data';
import VisitTableRow from '../citas/CalendarTableRow';

export default function VisitsTable() {
  return (
    <div className="borders overflow-hidden border-zinc-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="border-b border-zinc-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 py-3 text-left text-zinc-500">
              <th className="col-span-4 text-xs font-normal">Fecha</th>
              <th className="col-span-3 text-xs font-normal">Mascota</th>
              <th className="col-span-3 text-xs font-normal">Tipo</th>
              <th className="col-span-9 text-xs font-normal">Diagnóstico</th>
              <th className="col-span-3 text-xs font-normal">Veterinario</th>
              <th className="col-span-2 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200/70 bg-white">
            {adminVisitRegistry.map((item) => (
              <VisitTableRow
                key={`${item.microchip + item.registro + item.tipoAtencion}`}
                id={item.id}
                registro={item.registro}
                nombreMascota={item.nombreMascota}
                especie={item.especie}
                tipoAtencion={item.tipoAtencion}
                diagnostico={item.diagnostico}
                veterinario={item.veterinario}
                microchip={item.microchip}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
