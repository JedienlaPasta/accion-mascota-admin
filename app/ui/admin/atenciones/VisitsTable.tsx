import {
  getAllVisitsWithFilters,
  VisitsQueryFilters,
} from '@/app/_lib/data/consultas';
import VisitTableRow from './VisitsTableRow';
import { ClipboardList } from 'lucide-react';

type VisitsTableProps = {
  searchParams?: Partial<{
    query?: string;
    tipo?: string;
    desde?: string;
    hasta?: string;
  }>;
};

export default async function VisitsTable({
  searchParams,
}: VisitsTableProps = {}) {
  const filters: VisitsQueryFilters = {
    query: searchParams?.query,
    tipo: searchParams?.tipo,
    desde: searchParams?.desde,
    hasta: searchParams?.hasta,
    limit: 10,
    offset: 0,
  };

  const items = await getAllVisitsWithFilters(filters);

  return (
    <div className="borders overflow-hidden border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-b border-gray-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500">
              <th className="col-span-3 text-xs font-normal">Fecha</th>
              <th className="col-span-4 text-xs font-normal">Mascota</th>
              <th className="col-span-3 text-xs font-normal">Tipo</th>
              <th className="col-span-5 text-xs font-normal">
                Propietario / Motivo
              </th>
              <th className="col-span-3 text-xs font-normal">Veterinario</th>
              <th className="col-span-2 text-center text-xs font-normal">
                Peso
              </th>
              <th className="col-span-4 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/70 bg-white">
            {items.length > 0 ? (
              items.map((item) => <VisitTableRow key={item.id} {...item} />)
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-8 py-16 text-center text-sm text-gray-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <ClipboardList className="h-10 w-10 text-gray-300" />
                    <p className="font-medium text-gray-600">
                      Sin atenciones para mostrar
                    </p>
                    <p className="text-xs text-gray-400">
                      Prueba cambiando los filtros o crea una nueva atención.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
