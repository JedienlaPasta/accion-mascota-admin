import PetTableRow from './PetsTableRow';
import { getAllPetsWithQuery } from '@/app/_lib/data/mascotas';

export default async function PetsTable({ query }: { query: string }) {
  const data = await getAllPetsWithQuery(query);

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
            {data.map((item) => (
              <PetTableRow
                key={`${item.id + item.microchip}`}
                id={item.id}
                nombre_mascota={item.nombre_mascota}
                especie={item.especie}
                raza={item.raza}
                fecha_nacimiento={item.fecha_nacimiento}
                microchip={item.microchip}
                esterilizado={item.esterilizado}
                nombre_propietario={item.nombre_propietario}
                rut={item.rut}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
