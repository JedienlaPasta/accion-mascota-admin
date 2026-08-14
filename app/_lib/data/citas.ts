import { AppointmentPet } from '../data-types/citas';
import sql from '../db';

export async function getOccupiedSlotsForDateRange(
  fromIso: string,
  toIso: string
): Promise<Set<string>> {
  try {
    const fromTs = `${fromIso} 00:00:00`;
    const toTs = `${toIso}   23:59:59`;

    const rows = await sql`
      SELECT
        to_char(hora_agendada, 'YYYY-MM-DD HH24:MI') AS slot_key
      FROM citas
      WHERE
        hora_agendada >= (${fromTs})::text::timestamp
        AND hora_agendada <= (${toTs})::text::timestamp
        AND COALESCE(estado, 'pendiente') <> 'cancelada'
      GROUP BY slot_key
      ORDER BY slot_key
    `;

    const occupied = new Set<string>();
    for (const row of rows as unknown as Array<{ slot_key: string }>) {
      occupied.add(row.slot_key);
    }
    return occupied;
  } catch (error) {
    console.error('[getOccupiedSlotsForDateRange] error:', error);
    return new Set<string>();
  }
}

export const getPetsForAppointmentByQuery = async (
  query: string,
  searchBy: 'owner' | 'chip' | '' = 'owner' // searchBy vacío → modo OWNER
): Promise<AppointmentPet[]> => {
  try {
    const mode: 'owner' | 'chip' = searchBy === 'chip' ? 'chip' : 'owner';
    const q = (query || '').trim().slice(0, 100);

    // Sin query
    if (!q) {
      const pets = await sql`
        SELECT
          m.public_id as id,
          m.microchip,
          m.inscrito_registro_nacional,
          m.codigo_registro_nacional,
          m.nombre AS nombre_mascota,
          m.fecha_nacimiento,
          m.raza,
          m.especie,
          m.esterilizado,
          p.nombre AS nombre_propietario,
          p.id AS id_propietario,
          p.rut
        FROM mascotas m
        JOIN propietarios p ON m.propietario_id = p.id
        ORDER BY m.id DESC
        LIMIT 10
      `;
      return pets.map((pet) => pet as unknown as AppointmentPet);
    }

    // Con query
    const searchTerm = `%${q}%`;
    const prefixTerm = `${q}%`;

    const pets = await (mode === 'chip'
      ? sql`
          SELECT
            m.public_id as id,
            m.microchip,
            m.inscrito_registro_nacional,
            m.codigo_registro_nacional,
            m.nombre AS nombre_mascota,
            m.fecha_nacimiento,
            m.raza,
            m.especie,
            m.esterilizado,
            p.nombre AS nombre_propietario,
            p.id AS id_propietario,
            p.rut
          FROM mascotas m
          JOIN propietarios p ON m.propietario_id = p.id
          WHERE m.microchip ILIKE ${searchTerm}
          ORDER BY
            CASE WHEN m.microchip = ${q} THEN 0 ELSE 1 END,
            CASE WHEN m.nombre ILIKE ${prefixTerm} THEN 0 ELSE 1 END,
            m.id DESC
          LIMIT 10
        `
      : sql`
          SELECT
            m.public_id as id,
            m.microchip,
            m.inscrito_registro_nacional,
            m.codigo_registro_nacional,
            m.nombre AS nombre_mascota,
            m.fecha_nacimiento,
            m.raza,
            m.especie,
            m.esterilizado,
            p.nombre AS nombre_propietario,
            p.id AS id_propietario,
            p.rut
          FROM mascotas m
          JOIN propietarios p ON m.propietario_id = p.id
          WHERE p.nombre ILIKE ${searchTerm}
            OR REPLACE(REPLACE(p.rut, '.', ''), '-', '')
                ILIKE REPLACE(REPLACE(${searchTerm}, '.', ''), '-', '')
          ORDER BY
            CASE WHEN p.nombre ILIKE ${prefixTerm} THEN 0 ELSE 1 END,
            m.id DESC
          LIMIT 10
        `);

    return pets.map((pet) => pet as unknown as AppointmentPet);
  } catch (error) {
    console.error('Error al obtener listado de mascotas:', error);
    return [] as AppointmentPet[];
  }
};
