import PaginationSkeleton from '../PaginationSkeleton';

export default function VisitsTableSkeleton() {
  return (
    <div className="borders overflow-hidden border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-b border-gray-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500">
              <th className="col-span-3 text-xs font-normal">Fecha</th>
              <th className="col-span-3 text-xs font-normal">Mascota</th>
              <th className="col-span-3 text-xs font-normal">Tipo</th>
              <th className="col-span-10 text-xs font-normal">Diagnóstico</th>
              <th className="col-span-3 text-xs font-normal">Veterinario</th>
              <th className="col-span-2 text-center text-xs font-normal">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/70 bg-white">
            <TableRowSkeleton />
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
    <tr className="grid cursor-pointer grid-cols-24 items-center gap-4 px-8 text-sm text-gray-600 transition-colors last:mb-2 hover:bg-gray-50/80">
      {/* Fecha */}
      <td className="col-span-3 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-20 grow animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-3 max-w-28 grow animate-pulse rounded bg-gray-200"></div>
      </td>
      {/* Mascota */}
      <td className="col-span-3 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-28 grow animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Tipo */}
      <td className="col-span-3 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-28 grow animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Diagnóstico */}
      <td className="col-span-10 py-5">
        <div className="h-5 w-96 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Veterinario */}
      <td className="col-span-3 flex gap-1 py-5">
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
