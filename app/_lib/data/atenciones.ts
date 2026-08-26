import sql from '../db';
import type { Visits, VisitsSummary } from '../data-types/atenciones';
import { queryFilterChecker } from '../utils/check-values';

export type PaginatedVisitsResult = {
  visits: Visits[];
  totalCount: number;
  totalPages: number;
};

export const getAllVisitsWithFilters = async (
  query: string,
  page: number,
  pageSize: number
): Promise<PaginatedVisitsResult> => {
  try {
    // Validaciones de entrada
    const safePage = Math.max(1, Math.trunc(page));
    const offset = (safePage - 1) * pageSize;
    const { hasFilter, term } = queryFilterChecker(query);

    const whereClause = hasFilter
      ? sql`
        WHERE a.tipo_atencion ILIKE ${term}
            OR m.microchip ILIKE ${term}
            OR m.nombre ILIKE ${term}
            OR p.nombre ILIKE ${term}
            OR p.rut ILIKE ${term}
        `
      : sql``;

    const countRows = await sql`
        SELECT COUNT (*)::int AS total
        FROM atenciones a
        INNER JOIN mascotas m ON m.id = a.mascota_id
        LEFT JOIN propietarios p ON p.id = m.propietario_id
        ${whereClause}
      `;

    const totalCount = Number(countRows[0]?.total ?? 0);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    const visits = await sql`
          SELECT
            a.public_id AS id,
            a.public_id AS public_id_registro,
            a.fecha_atencion,
            m.nombre AS nombre_mascota,
            m.especie,
            m.public_id AS public_id_mascota,
            COALESCE(p.nombre, 'Sin propietario') AS nombre_propietario,
            COALESCE(p.rut, '—') AS rut_propietario,
            p.public_id AS public_id_propietario,
            a.tipo_atencion,
            cm.motivo AS motivo_atencion,
            COALESCE(cm.anamnesis, cm.diagnostico_predx) AS pre_dx,
            u.nombre AS veterinario,
            m.microchip,
            a.peso_actual,
            NULL::text AS proxima_visita,
            cm.tratamiento
          FROM atenciones a
          JOIN mascotas m ON m.id = a.mascota_id
          LEFT JOIN propietarios p ON p.id = m.propietario_id
          JOIN usuarios u ON u.id = a.usuario_id
          LEFT JOIN consultas_medicas cm ON cm.atencion_id = a.id
          ${whereClause}
          ORDER BY a.fecha_atencion DESC
          LIMIT ${pageSize}
          OFFSET ${offset}
        `;

    return {
      visits: visits.map((row) => row as Visits),
      totalCount,
      totalPages,
    };
  } catch (error) {
    console.error('Error al obtener atenciones:', error);
    return {
      visits: [],
      totalCount: 0,
      totalPages: 0,
    };
  }
};

// ============ SUMMARY STATS ============
export const getVisitsSummary = async (): Promise<VisitsSummary> => {
  try {
    const rows = await sql`
      SELECT
        COUNT(*)::int AS total_atenciones,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) = 'operativo_sanitario')::int AS total_operativos_sanitarios,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) = 'operativo_esterilizacion')::int AS total_operativos_esterilizacion,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) = 'consulta_medica')::int AS total_consultas_medicas
      FROM atenciones
    `;
    return rows[0] as unknown as VisitsSummary;
  } catch (error) {
    console.error('Error al obtener summary atenciones:', error);
    return {
      total_atenciones: 0,
      total_operativos_sanitarios: 0,
      total_operativos_esterilizacion: 0,
      total_consultas_medicas: 0,
    };
  }
};

// Detalle Atencion (para modal)
export type ProcedimientoItem = {
  codigo: string;
  nombre: string;
};

export type VisitDetails = {
  id: string;
  fecha_atencion: string;
  tipo_atencion: string;
  peso_actual: number | null;
  veterinario: string;
  created_at: string | null;

  // Mascota
  public_id_mascota: string;
  nombre_mascota: string;
  especie: string | null;
  sexo: string | null;
  fecha_nacimiento: string | null;
  microchip: string | null;

  // Propietario
  public_id_propietario: string | null;
  nombre_propietario: string;
  rut_propietario: string;

  // Tabla consultas_medicas
  motivo_atencion: string | null;
  anamnesis: string | null;
  examen_fisico: string | null;
  diagnostico_predx: string | null;
  examenes_solicitados: string | null;
  tratamiento: string | null;

  // Tabla operativos_esterilizacion
  resultado_esterilizacion: string | null;
  observaciones_esterilizacion: string | null;

  // Tabla procedimientos
  procedimientos_aplicados: ProcedimientoItem[] | null;
};

export const getVisitDetailById = async (
  id: string
): Promise<VisitDetails | null> => {
  if (!id || !id.trim()) return null;
  try {
    const rows = await sql`
      SELECT
        -- Atención base
        a.public_id AS id,
        a.fecha_atencion,
        a.tipo_atencion,
        a.peso_actual,
        a.created_at,
        u.nombre AS veterinario,

        -- Mascota
        m.public_id AS public_id_mascota,
        m.nombre AS nombre_mascota,
        m.especie,
        m.sexo,
        m.fecha_nacimiento,
        m.microchip,

        -- Propietario
        p.public_id AS public_id_propietario,
        COALESCE(p.nombre, 'Sin propietario') AS nombre_propietario,
        COALESCE(p.rut, '—') AS rut_propietario,

        -- Consulta médica (solo si tipo = CONSULTA_MEDICA)
        cm.motivo                 AS motivo_atencion,
        cm.anamnesis,
        cm.examen_fisico,
        cm.diagnostico_predx,
        cm.examenes_solicitados,
        cm.tratamiento,

        -- Esterilización (solo si tipo = OPERATIVO_ESTERILIZACION)
        oe.resultado              AS resultado_esterilizacion,

        -- Procedimientos (solo si tipo = OPERATIVO_SANITARIO)
        proc.procedimientos_jsonb AS procedimientos_aplicados

      FROM atenciones a
      INNER JOIN mascotas m           ON m.id = a.mascota_id
      LEFT  JOIN propietarios p       ON p.id = m.propietario_id
      INNER JOIN usuarios u           ON u.id = a.usuario_id
      LEFT  JOIN consultas_medicas cm ON cm.atencion_id = a.id
      LEFT  JOIN operativos_esterilizacion oe ON oe.atencion_id = a.id

      -- todos los procedimientos en 1 ARRAY JSON
      LEFT  JOIN LATERAL (
        SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
          'codigo', pr.codigo,
          'nombre', pr.nombre
        ) ORDER BY pr.codigo) AS procedimientos_jsonb
        FROM atencion_procedimientos ap
        JOIN procedimientos pr ON pr.id = ap.procedimiento_id
        WHERE ap.atencion_id = a.id
      ) proc ON TRUE

      WHERE a.public_id = ${id}
      LIMIT 1
    `;

    if (!rows.length) return null;
    return rows[0] as unknown as VisitDetails;
  } catch (error) {
    console.error('Error al obtener detalle atención:', error);
    return null;
  }
};
