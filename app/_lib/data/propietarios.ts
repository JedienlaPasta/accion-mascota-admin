import { PetsTableData } from '../data-types/mascotas';
import { OwnersSummaryData, OwnersTableData } from '../data-types/propietarios';
import sql from '../db';

export const getAllOwnersWithQuery = async (
  query: string
): Promise<OwnersTableData[]> => {
  try {
    const searchTerm = `%${query}%`;
    const owners = await sql`
      SELECT
        p.public_id as id,
        p.nombre AS nombre_propietario,
        p.rut,
        p.correo_personal,
        p.correo_contacto,
        p.direccion,
        p.comuna,
        p.region,
        p.telefono,
        COUNT(m.id) AS total_mascotas
      FROM propietarios p
      LEFT JOIN mascotas m ON m.propietario_id = p.id
      WHERE p.nombre ILIKE ${searchTerm}
        OR p.rut ILIKE ${searchTerm}
        OR p.telefono ILIKE ${searchTerm}
        OR p.correo_personal ILIKE ${searchTerm}
        OR p.direccion ILIKE ${searchTerm}
        OR p.comuna ILIKE ${searchTerm}
      GROUP BY
        p.id,
        p.public_id,
        p.nombre,
        p.rut,
        p.correo_personal,
        p.correo_contacto,
        p.direccion,
        p.comuna,
        p.region,
        p.telefono
      ORDER BY p.id
      LIMIT 10
    `;

    return owners.map((owner) => owner as OwnersTableData);
  } catch (error) {
    console.error('Error al obtener propietarios:', error);
    return [] as OwnersTableData[];
  }
};

export const getOwnersSummaryData = async (): Promise<OwnersSummaryData> => {
  try {
    const totalOwners = await sql`
      SELECT 
        COUNT(*) AS total_propietarios,
        COUNT(*) FILTER (WHERE correo_personal IS NOT NULL) AS total_propietarios_verificados -- Cambiar a correo_personal eventualmente
      FROM propietarios
    `;

    return totalOwners[0] as OwnersSummaryData;
  } catch (error) {
    console.error('Error al obtener propietarios:', error);
    return {} as OwnersSummaryData;
  }
};

export type OwnerDetails = {
  id: string;
  nombre_propietario: string;
  rut: string;
  correo_personal: string | null;
  correo_contacto: string | null;
  direccion: string | null;
  comuna: string | null;
  region: string | null;
  telefono: string | null;
  fecha_nacimiento: string | null;
  profesion: string | null;
  rsh: number | null;
  total_mascotas: number;
  creado_en: string | null;
};

export const getOwnerDetailsById = async (id: string): Promise<OwnerDetails | null> => {
  try {
    const owners = await sql`
      SELECT
        p.public_id AS id,
        p.nombre AS nombre_propietario,
        p.rut,
        p.correo_personal,
        p.correo_contacto,
        p.direccion,
        p.comuna,
        p.region,
        p.telefono,
        p.fecha_nacimiento,
        p.rsh,
        (SELECT COUNT(*) FROM mascotas m WHERE m.propietario_id = p.id)::int AS total_mascotas
      FROM propietarios p
      WHERE p.public_id = ${id}
      LIMIT 1
    `;
    return (owners[0] as OwnerDetails) || null;
  } catch (error) {
    console.error('Error al obtener detalles de propietario:', error);
    return null;
  }
};

export const getPetsByOwnerId = async (ownerId: string): Promise<PetsTableData[]> => {
  try {
    const pets = await sql`
      SELECT
        m.public_id AS id,
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
      WHERE p.public_id = ${ownerId}
      ORDER BY m.id DESC
    `;
    return pets.map((pet) => pet as PetsTableData);
  } catch (error) {
    console.error('Error al obtener mascotas del propietario:', error);
    return [] as PetsTableData[];
  }
};