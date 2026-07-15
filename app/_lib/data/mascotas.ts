import type {
  MascotasTableData,
  PetDetails,
  PetsSummaryData,
  ClinicHistoryItem,
} from '../data-types/mascotas';
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
        p.rut
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

export async function getSummaryData(): Promise<PetsSummaryData | null> {
  try {
    const totalPets = await sql`
      SELECT 
        COUNT(*) as total_mascotas,
        COUNT(*) FILTER (WHERE especie = 'CANINO') as total_perros,
        COUNT(*) FILTER (WHERE especie = 'FELINO') as total_gatos
      FROM mascotas
    `;

    return (totalPets[0] as PetsSummaryData) || null;
  } catch (error) {
    console.error('Error al obtener resumen de mascotas:', error);
    return null;
  }
}

export async function getPetDetailsById(
  id: string
): Promise<PetDetails | null> {
  try {
    const pet = await sql`
    SELECT
      m.public_id as id,
      m.nombre AS nombre_mascota,
      m.especie,
      m.fecha_nacimiento,
      m.raza,
      m.sexo,
      m.color,
      m.peso,
      m.microchip,
      m.esterilizado,
      p.public_id AS propietario_id,
      p.nombre AS nombre_propietario,
      p.telefono,
      p.correo
    FROM mascotas m
    JOIN propietarios p ON m.propietario_id = p.id
    WHERE m.public_id = ${id}
  `;

    return (pet[0] as PetDetails) || null;
  } catch (error) {
    console.error('Error al obtener detalles de mascota:', error);
    return null;
  }
}

export async function getPetClinicHistoryById(
  id: string
): Promise<ClinicHistoryItem[]> {
  try {
    const history = await sql`
      SELECT
        c.public_id as id,
        m.public_id as mascota_id,
        c.fecha_atencion,
        c.tipo_atencion,
        c.pre_dx,
        c.procedimientos_aplicados,
        c.tratamiento,
        u.nombre as veterinario        
      FROM consultas c
      JOIN mascotas m ON c.mascota_id = m.id
      JOIN usuarios u ON c.usuario_id = u.id
      WHERE m.public_id = ${id}
      ORDER BY c.fecha_atencion DESC
    `;

    return history.map((item) => item as ClinicHistoryItem);
  } catch (error) {
    console.error('Error al obtener historial clico:', error);
    return [];
  }
}
