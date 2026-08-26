import type {
  PetsTableData,
  PetDetails,
  PetsSummaryData,
  ClinicHistoryItem,
} from '../data-types/mascotas';
import sql from '../db';
import { queryFilterChecker } from '../utils/check-values';

export type PaginatedPetsResult = {
  pets: PetsTableData[];
  totalCount: number;
  totalPages: number;
};

export const getAllPetsWithQuery = async (
  query: string,
  page: number,
  pageSize: number
): Promise<PaginatedPetsResult> => {
  try {
    const safePage = Math.max(1, Number(page) || 1);
    const offset = (safePage - 1) * pageSize;
    const { hasFilter, term } = queryFilterChecker(query);

    const whereClause = hasFilter
      ? sql`
        WHERE m.especie ILIKE ${term}
             OR m.raza ILIKE ${term}
             OR m.nombre ILIKE ${term}
             OR m.microchip ILIKE ${term}
             OR p.nombre ILIKE ${term}
             OR p.rut ILIKE ${term}
        `
      : sql``;

    const countRows = await sql`
      SELECT COUNT(*)::int AS total
      FROM mascotas m
      LEFT JOIN propietarios p ON m.propietario_id = p.id
      ${whereClause}
    `;

    const totalCount = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
          LEFT JOIN propietarios p ON m.propietario_id = p.id
          ${whereClause}
          ORDER BY m.id DESC
          LIMIT ${pageSize}
          OFFSET ${offset}
        `;

    return {
      pets: pets.map((pet) => pet as PetsTableData),
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error('Error al obtener listado de mascotas:', error);
    return { pets: [], totalCount: 0, totalPages: 1 };
  }
};

export const getSummaryData = async (): Promise<PetsSummaryData> => {
  try {
    const totalPets = await sql`
      SELECT 
        COUNT(*) as total_mascotas,
        COUNT(*) FILTER (WHERE especie = 'CANINO') as total_perros,
        COUNT(*) FILTER (WHERE especie = 'FELINO') as total_gatos
      FROM mascotas
    `;

    return totalPets[0] as PetsSummaryData;
  } catch (error) {
    console.error('Error al obtener resumen de mascotas:', error);
    return {} as PetsSummaryData;
  }
};

export const getPetDetailsById = async (id: string): Promise<PetDetails> => {
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
      m.patron,
      last_w.peso_actual AS peso,
      last_w.fecha_atencion AS peso_fecha_ultima_atencion,
      m.microchip,
      m.esterilizado,
      p.public_id AS propietario_id,
      p.nombre AS nombre_propietario,
      p.telefono,
      p.correo_personal,
      p.correo_contacto
    FROM mascotas m
    LEFT JOIN propietarios p ON m.propietario_id = p.id
    LEFT JOIN LATERAL (
      SELECT a.peso_actual, a.fecha_atencion
      FROM atenciones a
      WHERE a.mascota_id = m.id
      ORDER BY a.fecha_atencion DESC
      LIMIT 1
    ) last_w ON TRUE
    WHERE m.public_id = ${id}
  `;

    return pet[0] as PetDetails;
  } catch (error) {
    console.error('Error al obtener detalles de mascota:', error);
    return {} as PetDetails;
  }
};

export const getPetClinicHistoryById = async (
  id: string
): Promise<ClinicHistoryItem[]> => {
  try {
    const history = await sql`
      SELECT
        a.public_id as id,
        m.public_id as mascota_id,
        a.fecha_atencion,
        a.tipo_atencion,
        a.peso_actual,
        u.nombre as veterinario,

        -- 1) Tipo: CONSULTA_MEDICA (tabla hija 1-1 consultas_medicas)
        cm.motivo,
        cm.anamnesis,
        cm.diagnostico_predx AS pre_dx,
        cm.examen_fisico,
        cm.examenes_solicitados,
        cm.tratamiento,
        cm.derivacion_clinica_privada,

        -- 2) Tipo: OPERATIVO_ESTERILIZACION (tabla hija 1-1)
        oe.resultado AS resultado_esterilizacion,

        -- 3) Tipo: OPERATIVO_SANITARIO (tabla pivote N-M)
        --    1 misma atención puede tener 3 vacunas distintas aplicadas → [{},{},{}]
        proc_list.procedimientos_aplicados

      FROM atenciones a
      JOIN mascotas m  ON a.mascota_id = m.id
      JOIN usuarios u  ON a.usuario_id = u.id

      -- Tabla hija 1: consultas medicas (1-1)
      LEFT JOIN consultas_medicas cm
             ON cm.atencion_id = a.id

      -- Tabla hija 2: operativos esterilizacion (1-1)
      LEFT JOIN operativos_esterilizacion oe
             ON oe.atencion_id = a.id

      -- Tabla hija 3: procedimientos aplicados (N-M) via LATERAL para array agrupado
      LEFT JOIN LATERAL (
        SELECT
          COALESCE(
            JSONB_AGG(
              JSONB_BUILD_OBJECT(
                'codigo', pr.codigo,
                'nombre', pr.nombre
              )
              ORDER BY pr.nombre
            ) FILTER (WHERE pr.id IS NOT NULL),
            '[]'::jsonb
          ) AS procedimientos_aplicados
        FROM atencion_procedimientos ap
        JOIN procedimientos pr ON pr.id = ap.procedimiento_id
        WHERE ap.atencion_id = a.id
      ) proc_list ON TRUE

      WHERE m.public_id = ${id}
      ORDER BY a.fecha_atencion DESC
    `;

    return history.map((item) => item as ClinicHistoryItem);
  } catch (error) {
    console.error('Error al obtener historial clínico:', error);
    return [] as ClinicHistoryItem[];
  }
};
