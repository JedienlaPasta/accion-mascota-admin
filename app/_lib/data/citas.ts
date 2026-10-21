import {
  AppointmentPet,
  AppointmentListItem,
  Appointment,
} from '../data-types/citas';
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

export async function getAppointmentById(
  id: string
): Promise<Appointment | null> {
  try {
    const row = await sql`
      SELECT
        c.public_id AS public_id_cita,
        --c.funcionario_id,
        c.mascota_id,
        c.hora_agendada,
        c.motivo,
        c.estado,
        c.tipo_atencion,
        c.created_at,
        m.public_id AS public_id_mascota,
        m.nombre AS nombre_mascota,
        m.especie,
        m.microchip,
        m.fecha_nacimiento,
        m.sexo,
        p.nombre AS nombre_propietario,
        p.rut AS rut_propietario,
        p.public_id AS public_id_propietario,
        COALESCE(fp.nombre, 'No asignado') AS nombre_funcionario
      FROM citas c
      INNER JOIN mascotas m ON m.id = c.mascota_id
      LEFT JOIN personas p ON p.id = m.responsable_id
      LEFT JOIN funcionarios f ON f.id = c.funcionario_id
      LEFT JOIN personas fp ON fp.id = f.persona_id
      WHERE
        c.public_id = (${id})::text
    `;
    return row[0] as unknown as Appointment | null;
  } catch (error) {
    console.error('[getAppointmentById] error:', error);
    return null;
  }
}

export async function getAllAppointmentsWithFilters(
  query: string,
  page: number,
  pageSize = 10
): Promise<{
  appointments: AppointmentListItem[];
  totalPages: number;
  totalCount: number;
}> {
  try {
    const q = (query || '').trim().slice(0, 100);
    const currentPage =
      Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const offset = (currentPage - 1) * pageSize;
    const term = `%${q}%`;

    const rows = await sql`
      SELECT
        c.public_id AS id,
        to_char(c.hora_agendada, 'YYYY-MM-DD HH24:MI') AS hora_agendada,
        c.tipo_atencion,
        c.estado,
        m.nombre AS nombre_mascota,
        m.especie,
        m.microchip,
        m.public_id AS public_id_mascota,
        p.nombre AS nombre_propietario,
        p.rut AS rut_propietario,
        p.public_id AS public_id_propietario
      FROM citas c
      INNER JOIN mascotas m ON m.id = c.mascota_id
      LEFT JOIN personas p ON p.id = m.responsable_id
      WHERE (
        ${q} = ''
        OR m.nombre ILIKE ${term}
        OR p.nombre ILIKE ${term}
        OR m.microchip ILIKE ${term}
      )
      ORDER BY c.hora_agendada DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    const countRows = await sql`
      SELECT COUNT(*)::int AS total
      FROM citas c
      INNER JOIN mascotas m ON m.id = c.mascota_id
      LEFT JOIN personas p ON p.id = m.responsable_id
      WHERE (
        ${q} = ''
        OR m.nombre ILIKE ${term}
        OR p.nombre ILIKE ${term}
        OR m.microchip ILIKE ${term}
      )
    `;

    const totalCount = (countRows[0] as { total: number })?.total ?? 0;
    return {
      appointments: rows as unknown as AppointmentListItem[],
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / pageSize)),
    };
  } catch (error) {
    console.error('[getAllAppointmentsWithFilters] error:', error);
    return { appointments: [], totalPages: 1, totalCount: 0 };
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
          m.nombre AS nombre_mascota,
          m.fecha_nacimiento,
          m.raza,
          m.especie,
          m.esterilizado,
          p.nombre AS nombre_propietario,
          p.id AS id_propietario,
          p.rut
        FROM mascotas m
        JOIN personas p ON m.responsable_id = p.id
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
            m.nombre AS nombre_mascota,
            m.fecha_nacimiento,
            m.raza,
            m.especie,
            m.esterilizado,
            p.nombre AS nombre_propietario,
            p.id AS id_propietario,
            p.rut
          FROM mascotas m
          JOIN personas p ON m.responsable_id = p.id
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
            m.nombre AS nombre_mascota,
            m.fecha_nacimiento,
            m.raza,
            m.especie,
            m.esterilizado,
            p.nombre AS nombre_propietario,
            p.id AS id_propietario,
            p.rut
          FROM mascotas m
          JOIN personas p ON m.responsable_id = p.id
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

export async function getTodayAppointmentsByQuery(
  query = ''
): Promise<AppointmentListItem[]> {
  try {
    const q = (query || '').trim().slice(0, 100);
    const term = `%${q}%`;

    const rows = await sql`
      SELECT
        c.public_id AS id,
        to_char(c.hora_agendada, 'YYYY-MM-DD HH24:MI') AS hora_agendada,
        c.tipo_atencion,
        c.estado,
        m.nombre AS nombre_mascota,
        m.especie,
        m.microchip,
        m.public_id AS public_id_mascota,
        p.nombre AS nombre_propietario,
        p.rut AS rut_propietario,
        p.public_id AS public_id_propietario
      FROM citas c
      INNER JOIN mascotas m ON m.id = c.mascota_id
      LEFT JOIN personas p ON p.id = m.responsable_id
      WHERE c.hora_agendada::date = (now() AT TIME ZONE 'America/Santiago')::date
        AND COALESCE(c.estado, 'pendiente') <> 'cancelada'
        AND (
          ${q} = ''
          OR m.nombre ILIKE ${term}
          OR p.nombre ILIKE ${term}
          OR m.microchip ILIKE ${term}
        )
      ORDER BY c.hora_agendada
    `;
    return rows as unknown as AppointmentListItem[];
  } catch (error) {
    console.error('[getTodayAppointmentsByQuery] error:', error);
    return [];
  }
}

export const getAppointmentStatistics = async () => {
  try {
    const rows = await sql`
      SELECT
        COUNT(*)::int AS total,
        COUNT(CASE WHEN estado = 'agendado' THEN 1 ELSE NULL END) AS scheduled,
        COUNT(CASE WHEN estado = 'completado' THEN 1 ELSE NULL END) AS finished
      FROM citas
    `;
    return rows[0] as unknown as {
      total: number;
      scheduled: number;
      finished: number;
    };
  } catch (error) {
    console.error('Error al obtener estadísticas de citas:', error);
    return { total: 0, scheduled: 0, finished: 0 };
  }
};
