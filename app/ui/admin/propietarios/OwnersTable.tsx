import { getAllOwnersWithQuery } from '@/app/_lib/data/propietarios';
import OwnerTableRow from './OwnersTableRow';
import Pagination from '../../components/Pagination';

export default async function OwnersTable({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const { owners, totalCount, totalPages } = await getAllOwnersWithQuery(
    query,
    page,
    10
  );

  return (
    <div className="overflow-hidden border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-b border-gray-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500">
              <th className="col-span-7 text-xs font-normal">Propietario</th>
              <th className="col-span-5 text-xs font-normal">Contacto</th>
              <th className="col-span-6 text-xs font-normal">Dirección</th>
              <th className="col-span-2 text-center text-xs font-normal">
                Mascotas
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Es usuario
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/70 bg-white">
            {owners.map((item) => (
              <OwnerTableRow key={`${item.id}`} {...item} />
            ))}
          </tbody>
        </table>
        {/* Contador de resultados + Paginacion */}
        <footer className="flex flex-col-reverse items-center justify-between gap-3 border-t border-gray-200/70 bg-white px-4 py-2 sm:flex-row">
          <div className="flex items-center gap-2 text-sm">
            <p className="tabular-numss font-medium text-gray-700">
              Mostrando{' '}
              <span className="text-slate-900">
                {totalCount === 0 ? 0 : (page - 1) * 10 + 1}
                {'-'}
                {Math.min(page * 10, Math.max(0, totalCount))}
              </span>{' '}
              de <span className="text-slate-900">{totalCount}</span>
            </p>
          </div>
          <Pagination pages={totalPages} />
        </footer>
      </div>
    </div>
  );
}
