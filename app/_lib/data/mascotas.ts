import type { MascotasTableData } from '../data-types/mascotas';
import sql from '../db';

export async function getAllPetsWithQuery(
  query: string
): Promise<MascotasTableData[]> {
  try {
    const searchTerm = `%${query}%`;
    const pets = await sql`
      SELECT
        m.id as index,
        m.public_id as id,
        m.nombre AS nombre_mascota,
        m.especie,
        m.fecha_nacimiento,
        m.raza,
        m.microchip,
        m.esterilizado,
        p.nombre AS nombre_propietario,
        p.telefono
      FROM mascotas m
      JOIN propietarios p ON m.propietario_id = p.id
      WHERE m.especie ILIKE ${searchTerm}
        OR m.raza ILIKE ${searchTerm}
        OR m.nombre ILIKE ${searchTerm}
        OR m.microchip ILIKE ${searchTerm}
        OR p.nombre ILIKE ${searchTerm}
      ORDER BY m.id
      LIMIT 10
    `;

    return pets.map((pet) => pet as MascotasTableData);
  } catch (error) {
    console.error('Error al obtener listado de mascotas:', error);
    return [];
  }
}

export async function getSummaryData() {
  try {
    const totalPets = await sql`
      SELECT 
        COUNT(*) as total_mascotas,
        COUNT(*) FILTER (WHERE especie = 'CANINO') as total_perros,
        COUNT(*) FILTER (WHERE especie = 'FELINO') as total_gatos
      FROM mascotas
    `;

    return totalPets[0];
  } catch (error) {
    console.error('Error al obtener resumen de mascotas:', error);
    return {};
  }
}
