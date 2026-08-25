import PaginationSkeleton from '../PaginationSkeleton';

export default function VisitsTableSkeleton() {
  return (
    <div className="borders overflow-hidden border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-b border-gray-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500">
              <th className="col-span-3 text-xs font-normal">Fecha</th>
              <th className="col-span-4 text-xs font-normal">Mascota</th>
              <th className="col-span-4 text-xs font-normal">Tipo</th>
              <th className="col-span-6 text-xs font-normal">
                Propietario / Motivo
              </th>
              <th className="col-span-3 text-xs font-normal">Veterinario</th>
              <th className="col-span-2 text-center text-xs font-normal">
                Peso
              </th>
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
    <tr className="grid h-17 grid-cols-24 items-center gap-4 px-8 text-sm text-gray-600 transition-colors hover:bg-gray-50/80">
      {/* Fecha */}
      <td className="col-span-3 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-20 grow animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-3 max-w-28 grow animate-pulse rounded bg-gray-200"></div>
      </td>
      {/* Mascota */}
      {/* <td className="col-span-4 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-28 grow animate-pulse rounded-md bg-gray-200"></div>
      </td> */}
      <td className="col-span-4 flex items-center justify-start gap-2.5">
        <div className="size-8 animate-pulse rounded-lg bg-gray-200"></div>
        <span className="flex flex-col gap-1">
          <div className="h-4 w-16 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
        </span>
      </td>
      {/* Tipo */}
      <td className="col-span-4 flex flex-col gap-1 py-4">
        <div className="h-6 max-w-34 grow animate-pulse rounded-lg bg-gray-200"></div>
      </td>
      {/* Propietario / Motivo */}
      <td className="col-span-6 flex flex-col gap-1">
        <div className="h-4 w-56 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-3 w-32 animate-pulse rounded bg-gray-200"></div>
      </td>
      {/* Veterinario */}
      <td className="col-span-3 flex gap-1 py-5">
        <div className="h-5 w-28 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      <td className="col-span-2 flex justify-center gap-1 py-5">
        <div className="h-5 w-16 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Acciones */}
      <td className="col-span-2 flex justify-center gap-1 py-5 text-right">
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
      </td>
    </tr>
  );
}
