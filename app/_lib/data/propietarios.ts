import { PetsTableData } from '../data-types/mascotas';
import { OwnersSummaryData, OwnersTableData } from '../data-types/propietarios';
import sql from '../db';
import { queryFilterChecker } from '../utils/check-values';

type PaginatedOwnersResult = {
  owners: OwnersTableData[];
  totalCount: number;
  totalPages: number;
};

export const getAllOwnersWithQuery = async (
  query: string,
  page: number,
  pageSize: number
): Promise<PaginatedOwnersResult> => {
  try {
    const safePage = Math.max(1, Number(page) || 1);
    const offset = (safePage - 1) * pageSize;
    const { hasFilter, term } = queryFilterChecker(query);

    const whereClause = hasFilter
      ? sql`
        WHERE nombre ILIKE ${term}
          OR rut ILIKE ${term}
          OR telefono ILIKE ${term}
          OR correo_personal ILIKE ${term}
          OR direccion ILIKE ${term}
          OR comuna ILIKE ${term}
      `
      : sql``;

    const countRows = await sql`
      SELECT COUNT(*)::int AS total
      FROM propietarios
      ${whereClause}
    `;

    const totalCount = countRows[0].total ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
          COALESCE(pet_count.total, 0)::int AS total_mascotas
        FROM propietarios p
        LEFT JOIN LATERAL (
          SELECT COUNT(*) AS total
          FROM mascotas m
          WHERE m.propietario_id = p.id
        ) pet_count ON true
        ${whereClause}
        ORDER BY p.id DESC
        LIMIT ${pageSize}
        OFFSET ${offset}
    `;

    return {
      owners: owners.map((owner) => owner as OwnersTableData),
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error('Error al obtener propietarios:', error);
    return {
      owners: [],
      totalCount: 0,
      totalPages: 1,
    };
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

export const getOwnerDetailsById = async (
  id: string
): Promise<OwnerDetails | null> => {
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

export const getPetsByOwnerId = async (
  ownerId: string
): Promise<PetsTableData[]> => {
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
