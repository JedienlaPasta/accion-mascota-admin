import postgres from 'postgres';
import sql from '../db';

export type VisitsTableRealData = {
  id: string;
  public_id_registro: string;
  fecha_atencion: string;
  nombre_mascota: string;
  especie: string;
  public_id_mascota: string;
  nombre_propietario: string;
  rut_propietario: string;
  public_id_propietario: string;
  tipo_atencion: string;
  motivo_atencion: string | null;
  pre_dx: string | null;
  veterinario: string;
  microchip: string | null;
  peso_actual: number | null;
  proxima_visita: string | null;
  tratamiento: string | null;
};

export type VisitsSummary = {
  total_atenciones: number;
  total_consultas: number;
  total_vacunaciones: number;
  total_cirugias: number;
  total_controles: number;
  total_emergencias: number;
};

/** Tipos de atención oficialmente soportados en la BD (whitelist) */
export const VALID_TIPOS_ATENCION = [
  'Primera Consulta',
  'Control',
  'Urgencia',
  'Operativo',
  'Revisión',
] as const;
export type TipoAtencion = (typeof VALID_TIPOS_ATENCION)[number];

export type VisitsQueryFilters = {
  /** Búsqueda libre: mascota, propietario, diagnóstico, motivo, veterinario, microchip */
  query?: string;
  /** Filtrar por tipo_atencion (exact match con whitelist) */
  tipo?: TipoAtencion | (string & {});
  /** Fecha desde formato YYYY-MM-DD (inclusivo) */
  desde?: string;
  /** Fecha hasta formato YYYY-MM-DD (inclusivo) */
  hasta?: string;
  /** Cantidad de filas (clamped 1–100 en la función) */
  limit?: number;
  /** Paginación (≥ 0, entero) */
  offset?: number;
};

// ============ LISTADO DE ATENCIONES ============
export const getAllVisitsWithFilters = async (
  filters: VisitsQueryFilters = {}
): Promise<VisitsTableRealData[]> => {
  try {
    // ===== VALIDACIONES DE SEGURIDAD DE ENTRADA =====
    const query = filters.query?.trim() || '';
    const tipo = filters.tipo?.trim() || ''; // "Primera Consulta", "Control", "Operativo", "Revisión", "Urgencia". (Aun falta definir cuales seran los tipos validos)
    const desde = filters.desde?.trim() || '';
    const hasta = filters.hasta?.trim() || '';
    // Clamp: min 1 / max 100 para evitar DoS (paginación excesiva)
    const limitRaw =
      typeof filters.limit === 'number'
        ? filters.limit
        : Number(filters.limit) || 10;
    const limit = Math.max(1, Math.min(100, Math.trunc(limitRaw)));
    // Offset >= 0 y entero
    const offsetRaw =
      typeof filters.offset === 'number'
        ? filters.offset
        : Number(filters.offset) || 0;
    const offset = Math.max(0, Math.trunc(offsetRaw));

    // ===== Construcción SEGURA de cláusulas WHERE =====
    type PendingQueryLike = { readonly strings: readonly string[]; readonly values: readonly unknown[] };

    // Helper joinAnd: une pending queries con separador " AND ".
    // NUNCA interpolar arrays directamente en sql`` (postgres los convierte a lista IN).
    const joinAnd = (parts: readonly PendingQueryLike[]): PendingQueryLike => {
      const strings: string[] = [''];
      const values: unknown[] = [];
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        for (let j = 0; j < p.strings.length; j++) {
          strings[strings.length - 1] += p.strings[j];
          if (j < p.values.length) {
            values.push(p.values[j]);
            strings.push('');
          }
        }
        if (i < parts.length - 1) strings[strings.length - 1] += ' AND ';
      }
      type SqlCtor = (literals: readonly string[], ...vals: unknown[]) => PendingQueryLike;
      return (sql as unknown as SqlCtor)(strings, ...values);
    };

    const conditions: PendingQueryLike[] = [];

    if (query) {
      // searchTerm con % alrededor → ILIKE partial match (no exacto)
      const searchTerm = `%${query}%`;
      conditions.push(sql`
        (
          m.nombre ILIKE ${searchTerm} OR
          p.nombre ILIKE ${searchTerm} OR
          c.pre_dx ILIKE ${searchTerm} OR
          c.motivo_atencion ILIKE ${searchTerm} OR
          u.nombre ILIKE ${searchTerm} OR
          m.microchip ILIKE ${searchTerm}
        )
      ` as unknown as PendingQueryLike);
    }

    if (tipo && (VALID_TIPOS_ATENCION as readonly string[]).includes(tipo)) {
      conditions.push(sql`c.tipo_atencion = ${tipo}` as unknown as PendingQueryLike);
    }

    function isValidDate(date: string) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
      return !Number.isNaN(Date.parse(date));
    }

    if (desde && isValidDate(desde)) {
      conditions.push(sql`c.fecha_atencion >= ${desde}::date` as unknown as PendingQueryLike);
    }

    if (hasta && isValidDate(hasta)) {
      conditions.push(
        sql`c.fecha_atencion < (${hasta}::date + interval '1 day')` as unknown as PendingQueryLike
      );
    }

    // ============================================================
    // QUERY COMPLETA: unimos TODO (SELECT static + WHERE dinámico + ORDER + LIMIT/OFFSET)
    // en UNA SOLA ESTRUCTURA allStrings + allValues. Ejecutamos luego como SqlExecFn.
    // Esto evita INTERPOLAR PendingQueryLike dentro de sql`` (typing Sql<{}> lo rechaza).
    // En runtime es 100% equivalente al tagged template: parametriza TODO.
    // ============================================================

    // 1) Parte ESTÁTICA: SELECT / FROM / JOINs
    const STATIC_SELECT = `
      SELECT
        c.public_id AS id,
        c.public_id AS public_id_registro,
        c.fecha_atencion,
        m.nombre AS nombre_mascota,
        m.especie,
        m.public_id AS public_id_mascota,
        p.nombre AS nombre_propietario,
        p.rut AS rut_propietario,
        p.public_id AS public_id_propietario,
        c.tipo_atencion,
        c.motivo_atencion,
        c.pre_dx,
        u.nombre AS veterinario,
        m.microchip,
        c.peso_actual,
        NULL::text AS proxima_visita,
        c.tratamiento
      FROM consultas c
      JOIN mascotas m ON m.id = c.mascota_id
      JOIN propietarios p ON p.id = m.propietario_id
      JOIN usuarios u ON u.id = c.usuario_id
    `;

    // Cola unificada de literals + values
    const allStrings: string[] = [STATIC_SELECT];
    const allValues: unknown[] = [];

    // 2) WHERE DINÁMICO si hay condiciones
    if (conditions.length > 0) {
      const merged = joinAnd(conditions);
      // Append 'WHERE ' + todos los strings + values de merged.
      allStrings[allStrings.length - 1] += `\nWHERE `;
      for (let j = 0; j < merged.strings.length; j++) {
        allStrings[allStrings.length - 1] += merged.strings[j];
        if (j < merged.values.length) {
          allValues.push(merged.values[j]);
          allStrings.push('');
        }
      }
    }

    // 3) ORDER BY (static) + LIMIT ${limit} y OFFSET ${offset} (parametrizados)
    allStrings[allStrings.length - 1] += `\nORDER BY c.fecha_atencion DESC\nLIMIT `;
    allValues.push(limit);
    allStrings.push('::int\nOFFSET ');
    allValues.push(offset);
    allStrings.push('::int');

    // 4) EJECUCIÓN con SqlExecFn (doble cast, no any)
    type Row = Record<string, unknown>;
    type SqlExecFn = (literals: readonly string[], ...vals: unknown[]) => Promise<Row[]>;

    const rows = await (sql as unknown as SqlExecFn)(allStrings, ...allValues);

    // 5) Return: casting puente (rows → unknown → VisitsTableRealData[])
    return rows.map((row) => row as unknown as VisitsTableRealData);
  } catch (error) {
    // console.error('Error al obtener atenciones:', error);
    return [] as VisitsTableRealData[];
  }
};

// ============ SUMMARY STATS ============
export const getVisitsSummary = async (): Promise<VisitsSummary> => {
  try {
    const rows = await sql`
      SELECT
        COUNT(*)::int AS total_atenciones,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) LIKE '%consulta%')::int AS total_consultas,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) LIKE '%vacuna%' OR LOWER(tipo_atencion) LIKE '%vacunacion%' OR LOWER(tipo_atencion) LIKE '%vacunación%')::int AS total_vacunaciones,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) LIKE '%cirugia%' OR LOWER(tipo_atencion) LIKE '%cirugía%' OR LOWER(tipo_atencion) LIKE '%operativ%')::int AS total_cirugias,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) LIKE '%control%' OR LOWER(tipo_atencion) LIKE '%post-opera%')::int AS total_controles,
        COUNT(*) FILTER (WHERE LOWER(tipo_atencion) LIKE '%emergencia%' OR LOWER(tipo_atencion) LIKE '%urgencia%')::int AS total_emergencias
      FROM consultas
    `;
    return rows[0] as unknown as VisitsSummary;
  } catch (error) {
    console.error('Error al obtener summary atenciones:', error);
    return {
      total_atenciones: 0,
      total_consultas: 0,
      total_vacunaciones: 0,
      total_cirugias: 0,
      total_controles: 0,
      total_emergencias: 0,
    };
  }
};

// ============ DETALLE ATENCIÓN (para modal) ============
export type VisitDetails = VisitsTableRealData & {
  anamnesis: string | null;
  examen_fisico: string | null;
  examenes_solicitados: string | null;
  procedimientos_aplicados: unknown;
};

export const getVisitDetailById = async (
  id: string
): Promise<VisitDetails | null> => {
  try {
    const rows = await sql`
      SELECT
        c.public_id AS id,
        c.public_id AS public_id_registro,
        c.fecha_atencion,
        m.nombre AS nombre_mascota,
        m.especie,
        m.public_id AS public_id_mascota,
        p.nombre AS nombre_propietario,
        p.rut AS rut_propietario,
        p.public_id AS public_id_propietario,
        c.tipo_atencion,
        c.motivo_atencion,
        c.anamnesis,
        c.examen_fisico,
        c.pre_dx,
        c.examenes_solicitados,
        c.tratamiento,
        c.procedimientos_aplicados,
        c.peso_actual,
        u.nombre AS veterinario,
        m.microchip,
        NULL::text AS proxima_visita,
        c.created_at
      FROM consultas c
      JOIN mascotas m ON m.id = c.mascota_id
      JOIN propietarios p ON p.id = m.propietario_id
      JOIN usuarios u ON u.id = c.usuario_id
      WHERE c.public_id = ${id}
      LIMIT 1
    `;

    if (!rows.length) return null;
    return rows[0] as unknown as VisitDetails;
  } catch (error) {
    console.error('Error al obtener detalle atención:', error);
    return null;
  }
};
