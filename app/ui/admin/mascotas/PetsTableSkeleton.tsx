import PaginationSkeleton from '../PaginationSkeleton';

export default function PetsTableSkeleton() {
  return (
    <div className="borders overflow-hidden border-zinc-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1024px]">
          <thead className="border-b border-zinc-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 py-3 text-left text-zinc-500">
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
          <tbody className="divide-y divide-zinc-200/70 bg-white">
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
            <TableRowSkeleton />
          </tbody>
        </table>
        <PaginationSkeleton />
      </div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 text-sm text-zinc-600 transition-colors hover:bg-zinc-50/80">
      {/* Nombre Mascota */}
      <td className="col-span-4 flex flex-col gap-1 py-4 lg:col-span-5">
        <div className="h-5 max-w-20 grow animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-3 max-w-28 grow animate-pulse rounded bg-gray-200"></div>
      </td>
      {/* Especie/Raza */}
      <td className="col-span-4 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-18 grow animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-3 max-w-28 grow animate-pulse rounded bg-gray-200"></div>
      </td>
      {/* Nombre Propietario */}
      <td className="col-span-7 flex flex-col gap-1 py-4 lg:col-span-6">
        <div className="h-5 max-w-56 grow animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-3 max-w-28 grow animate-pulse rounded bg-gray-200"></div>
      </td>
      {/* Microchip */}
      <td className="relative col-span-5 py-5">
        <div className="absolute -left-6 h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-5 w-42 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Esterilizado */}
      <td className="col-span-2 flex py-5">
        <div className="h-5 w-28 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Acciones */}
      <td className="col-span-2 flex justify-center gap-1 py-5 text-right">
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
      </td>
    </tr>
  );
}
