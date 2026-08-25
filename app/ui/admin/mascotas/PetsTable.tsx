import Pagination from '../../components/Pagination';
import PetTableRow from './PetsTableRow';
import { getAllPetsWithQuery } from '@/app/_lib/data/mascotas';

export default async function PetsTable({
  query,
  page,
}: {
  query: string;
  page: number;
}) {
  const pageSize = 10;
  const { pets, totalPages, totalCount } = await getAllPetsWithQuery(
    query,
    page,
    pageSize
  );

  return (
    <div className="overflow-hidden border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-b border-gray-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500">
              <th className="col-span-4 text-xs font-normal lg:col-span-5">
                Mascota
              </th>
              <th className="col-span-4 text-xs font-normal">Especie/Raza</th>
              <th className="col-span-7 text-xs font-normal lg:col-span-6">
                Propietario
              </th>
              <th className="col-span-5 text-xs font-normal">Microchip</th>
              <th className="col-span-2 text-center text-xs font-normal">
                Esterilizado
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/70 bg-white">
            {pets.length > 0 ? (
              pets.map((item) => (
                <PetTableRow key={`${item.id + item.microchip}`} {...item} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-8 py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 rounded-full bg-gray-50 p-3 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      No se encontraron mascotas
                    </p>
                    <p className="mt-1 max-w-md text-xs text-gray-500">
                      {query
                        ? 'Revisa que el texto de búsqueda esté bien escrito o prueba con otras palabras.'
                        : 'Aún no hay mascotas registradas. Crea la primera con el botón "Nueva Mascota".'}
                    </p>
                  </div>
                </td>
              </tr>
            )}
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
