import { AppointmentPet } from '../data-types/citas';
import sql from '../db';

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
