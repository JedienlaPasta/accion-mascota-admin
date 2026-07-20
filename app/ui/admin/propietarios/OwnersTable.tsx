import { getAllOwnersWithQuery } from '@/app/_lib/data/propietarios';
import OwnerTableRow from './OwnersTableRow';

export default async function OwnersTable({ query }: { query: string }) {
  const owners = await getAllOwnersWithQuery(query);

  return (
    <div className="overflow-hidden border-zinc-200/80">
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
            {owners.map((item) => (
              <OwnerTableRow
                key={`${item.id}`}
                id={item.id}
                nombre_propietario={item.nombre_propietario}
                rut={item.rut}
                correo={item.correo}
                direccion={item.direccion}
                comuna={item.comuna}
                region={item.region}
                telefono={item.telefono}
                total_mascotas={item.total_mascotas}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
