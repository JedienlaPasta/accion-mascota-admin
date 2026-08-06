import PaginationSkeleton from '../PaginationSkeleton';

export default function OwnersTableSkeleton() {
  return (
    <div className="borders overflow-hidden border-gray-200/80">
      <div className="overflow-x-auto">
        <table className="w-full min-w-5xl">
          <thead className="border-b border-gray-200/80">
            <tr className="grid grid-cols-24 items-center gap-4 px-8 py-3 text-left text-gray-500">
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
    <tr className="grid h-18 cursor-pointer grid-cols-24 items-center gap-4 px-8 text-sm text-gray-600 transition-colors last:mb-2 hover:bg-gray-50/80">
      {/* Propietario */}
      <td className="col-span-5 flex items-center justify-start gap-2.5">
        <div className="size-10 animate-pulse rounded-xl bg-gray-200"></div>
        <span className="flex flex-col gap-1">
          <div className="h-4 w-32 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-3 w-20 animate-pulse rounded bg-gray-200"></div>
        </span>
      </td>
      {/* Contacto */}
      <td className="col-span-5 flex items-center justify-start gap-1">
        <span className="flex flex-col items-end gap-1">
          <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-4 w-4 animate-pulse rounded-md bg-gray-200"></div>
        </span>
        <span className="flex flex-col gap-1">
          <div className="h-5 w-32 animate-pulse rounded-md bg-gray-200"></div>
          <div className="h-4 w-20 animate-pulse rounded-md bg-gray-200"></div>
        </span>
      </td>
      {/* Dirección */}
      <td className="col-span-7 flex items-center gap-1">
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-5 max-w-56 grow animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Mascotas */}
      <td className="col-span-3 flex items-center justify-center gap-1">
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Registro */}
      <td className="col-span-2 flex items-center gap-1">
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200"></div>
      </td>
      {/* Acciones */}
      <td className="col-span-2 flex justify-center gap-1 py-5 text-right">
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
        <div className="h-5 w-5 animate-pulse rounded-md bg-gray-200"></div>
      </td>
    </tr>
  );
}
