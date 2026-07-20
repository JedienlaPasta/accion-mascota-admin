import PaginationSkeleton from '../PaginationSkeleton';

export default function OwnersTableSkeleton() {
  return (
    <div className="borders overflow-hidden border-zinc-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1024px]">
          <thead className="border-b border-zinc-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 py-3 text-left text-zinc-500">
              <th className="col-span-5 text-xs font-normal">Propietario</th>
              <th className="col-span-5 text-xs font-normal">Contacto</th>
              <th className="col-span-7 text-xs font-normal">Dirección</th>
              <th className="col-span-3 text-center text-xs font-normal">
                Mascotas
              </th>
              <th className="col-span-2 text-center text-xs font-normal">
                Registro
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
      {/* Propietario */}
      <td className="col-span-5 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-20 grow animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-3 max-w-28 grow animate-pulse rounded bg-gray-200"></div>
      </td>
      {/* Contacto */}
      <td className="col-span-5 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-28 grow animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Dirección */}
      <td className="col-span-7 flex flex-col gap-1 py-4">
        <div className="h-5 max-w-56 grow animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Mascotas */}
      <td className="relative col-span-3 py-5">
        <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Registro */}
      <td className="col-span-2 flex gap-1 py-5">
        <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200"></div>
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
