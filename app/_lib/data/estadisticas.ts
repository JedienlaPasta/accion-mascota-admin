import sql from '../db';
import { StatMetricKey } from '../static-data/reportes';

export type ReportStatsYearRow = Record<StatMetricKey, number> & {
  anio: number;
};

export type ReportStatsMonthRow = Record<StatMetricKey, number> & {
  mes: number;
};

const METRIC_KEYS: StatMetricKey[] = [
  'octuple',
  'antirrabica',
  'triple',
  'de',
  'di',
  'implantacion',
  'verificacion',
  'total_atenciones',
  'perros',
  'perros_macho',
  'perros_hembra',
  'gatos',
  'gatos_macho',
  'gatos_hembra',
  'aprobadas',
  'finalizada_sin_exito',
  'ya_intervenidos',
  'inscrito_plataforma',
  'con_dueno',
  'sin_dueno',
  'derivados',
  'tratamiento_casa',
];

const toNumber = (value: unknown) => Number(value ?? 0) || 0;

function normalizeRow(
  row: Record<string, unknown>
): Record<StatMetricKey, number> {
  const result = {} as Record<StatMetricKey, number>;
  for (const key of METRIC_KEYS) result[key] = toNumber(row[key]);
  return result;
}

export async function getReportStatsByYear(
  tipo: string
): Promise<ReportStatsYearRow[]> {
  try {
    if (tipo === 'OPERATIVO_ESTERILIZACION') {
      const rows = await sql`
        SELECT
          EXTRACT(YEAR FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS anio,
          COUNT(DISTINCT a.id) AS total_atenciones,
          COUNT(DISTINCT a.id) FILTER (WHERE oe.resultado = 'APROBADO') AS aprobadas,
          COUNT(DISTINCT a.id) FILTER (WHERE oe.resultado = 'SUSPENDIDO') AS finalizada_sin_exito,
          COUNT(DISTINCT a.id) FILTER (WHERE oe.resultado = 'SUSPENDIDA') AS ya_intervenidos,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'VERIFICACION') AS verificacion,
          COUNT(DISTINCT a.id) FILTER (WHERE m.inscrito_registro_nacional = true) AS inscrito_plataforma,
          COUNT(DISTINCT a.id) FILTER (WHERE m.tipo_tenencia = 'CON DUEÑO') AS con_dueno,
          COUNT(DISTINCT a.id) FILTER (WHERE m.tipo_tenencia = 'SIN DUEÑO') AS sin_dueno
        FROM atenciones a
        JOIN mascotas m ON m.id = a.mascota_id
        LEFT JOIN operativos_esterilizacion oe ON oe.atencion_id = a.id
        LEFT JOIN atencion_procedimientos ap ON ap.atencion_id = a.id
        LEFT JOIN procedimientos pr ON pr.id = ap.procedimiento_id
        WHERE a.tipo_atencion = 'OPERATIVO_ESTERILIZACION'
        GROUP BY 1
        ORDER BY 1 DESC
      `;
      return rows.map((row) => ({
        anio: Number(row.anio),
        ...normalizeRow(row as Record<string, unknown>),
      }));
    }

    if (tipo === 'CONSULTA_MEDICA') {
      const rows = await sql`
        SELECT
          EXTRACT(YEAR FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS anio,
          COUNT(DISTINCT a.id) AS total_atenciones,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO') AS perros,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO' AND m.sexo = 'MACHO') AS perros_macho,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO' AND m.sexo = 'HEMBRA') AS perros_hembra,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO') AS gatos,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO' AND m.sexo = 'MACHO') AS gatos_macho,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO' AND m.sexo = 'HEMBRA') AS gatos_hembra,
          COUNT(DISTINCT a.id) FILTER (WHERE cm.derivacion_clinica_privada = true) AS derivados,
          COUNT(DISTINCT a.id) FILTER (WHERE cm.derivacion_clinica_privada = true) AS tratamiento_casa,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'VERIFICACION') AS verificacion
        FROM atenciones a
        JOIN mascotas m ON m.id = a.mascota_id
        LEFT JOIN consultas_medicas cm ON cm.atencion_id = a.id
        LEFT JOIN atencion_procedimientos ap ON ap.atencion_id = a.id
        LEFT JOIN procedimientos pr ON pr.id = ap.procedimiento_id
        WHERE a.tipo_atencion = 'CONSULTA_MEDICA'
        GROUP BY 1
        ORDER BY 1 DESC
      `;
      return rows.map((row) => ({
        anio: Number(row.anio),
        ...normalizeRow(row as Record<string, unknown>),
      }));
    }

    const rows = await sql`
      SELECT
        EXTRACT(YEAR FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS anio,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'OCTUPLE') AS octuple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'ANTIRRABICA') AS antirrabica,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'TRIPLE_FELINA') AS triple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DE') AS de,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DI') AS di,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'VERIFICACION') AS verificacion,
        COUNT(DISTINCT a.id) AS total_atenciones,
        COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO') AS perros,
        COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO') AS gatos
      FROM atenciones a
      JOIN mascotas m ON m.id = a.mascota_id
      LEFT JOIN atencion_procedimientos ap ON ap.atencion_id = a.id
      LEFT JOIN procedimientos pr ON pr.id = ap.procedimiento_id
      WHERE a.tipo_atencion = 'OPERATIVO_SANITARIO'
      GROUP BY 1
      ORDER BY 1 DESC
    `;

    return rows.map((row) => ({
      anio: Number(row.anio),
      ...normalizeRow(row as Record<string, unknown>),
    }));
  } catch (error) {
    console.error('Error al obtener estadísticas anuales:', error);
    return [];
  }
}

export async function getReportStatsByMonth(
  tipo: string,
  year: string
): Promise<ReportStatsMonthRow[]> {
  try {
    const safeYear = Math.trunc(Number(year)) || new Date().getFullYear();
    const yearFilter = sql`AND EXTRACT(YEAR FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int = ${safeYear}`;

    if (tipo === 'OPERATIVO_ESTERILIZACION') {
      const rows = await sql`
        SELECT
          EXTRACT(MONTH FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS mes,
          COUNT(DISTINCT a.id) AS total_atenciones,
          COUNT(DISTINCT a.id) FILTER (WHERE oe.resultado = 'APROBADO') AS aprobadas,
          COUNT(DISTINCT a.id) FILTER (WHERE oe.resultado = 'SUSPENDIDO') AS finalizada_sin_exito,
          COUNT(DISTINCT a.id) FILTER (WHERE oe.resultado = 'SUSPENDIDA') AS ya_intervenidos,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'VERIFICACION') AS verificacion,
          COUNT(DISTINCT a.id) FILTER (WHERE m.inscrito_registro_nacional = true) AS inscrito_plataforma,
          COUNT(DISTINCT a.id) FILTER (WHERE m.tipo_tenencia = 'CON DUEÑO') AS con_dueno,
          COUNT(DISTINCT a.id) FILTER (WHERE m.tipo_tenencia = 'SIN DUEÑO') AS sin_dueno
        FROM atenciones a
        JOIN mascotas m ON m.id = a.mascota_id
        LEFT JOIN operativos_esterilizacion oe ON oe.atencion_id = a.id
        LEFT JOIN atencion_procedimientos ap ON ap.atencion_id = a.id
        LEFT JOIN procedimientos pr ON pr.id = ap.procedimiento_id
        WHERE a.tipo_atencion = 'OPERATIVO_ESTERILIZACION' ${yearFilter}
        GROUP BY 1
        ORDER BY 1
      `;
      return rows.map((row) => ({
        mes: Number(row.mes),
        ...normalizeRow(row as Record<string, unknown>),
      }));
    }

    if (tipo === 'CONSULTA_MEDICA') {
      const rows = await sql`
        SELECT
          EXTRACT(MONTH FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS mes,
          COUNT(DISTINCT a.id) AS total_atenciones,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO') AS perros,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO' AND m.sexo = 'MACHO') AS perros_macho,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO' AND m.sexo = 'HEMBRA') AS perros_hembra,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO') AS gatos,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO' AND m.sexo = 'MACHO') AS gatos_macho,
          COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO' AND m.sexo = 'HEMBRA') AS gatos_hembra,
          COUNT(DISTINCT a.id) FILTER (WHERE cm.derivacion_clinica_privada = true) AS derivados,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
          COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'VERIFICACION') AS verificacion
        FROM atenciones a
        JOIN mascotas m ON m.id = a.mascota_id
        LEFT JOIN consultas_medicas cm ON cm.atencion_id = a.id
        LEFT JOIN atencion_procedimientos ap ON ap.atencion_id = a.id
        LEFT JOIN procedimientos pr ON pr.id = ap.procedimiento_id
        WHERE a.tipo_atencion = 'CONSULTA_MEDICA' ${yearFilter}
        GROUP BY 1
        ORDER BY 1
      `;
      return rows.map((row) => ({
        mes: Number(row.mes),
        ...normalizeRow(row as Record<string, unknown>),
      }));
    }

    const rows = await sql`
      SELECT
        EXTRACT(MONTH FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS mes,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'OCTUPLE') AS octuple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'ANTIRRABICA') AS antirrabica,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'TRIPLE_FELINA') AS triple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DE') AS de,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DI') AS di,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'VERIFICACION') AS verificacion,
        COUNT(DISTINCT a.id) AS total_atenciones,
        COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO') AS perros,
        COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO') AS gatos
      FROM atenciones a
      JOIN mascotas m ON m.id = a.mascota_id
      LEFT JOIN atencion_procedimientos ap ON ap.atencion_id = a.id
      LEFT JOIN procedimientos pr ON pr.id = ap.procedimiento_id
      WHERE a.tipo_atencion = 'OPERATIVO_SANITARIO' ${yearFilter}
      GROUP BY 1
      ORDER BY 1
    `;

    return rows.map((row) => ({
      mes: Number(row.mes),
      ...normalizeRow(row as Record<string, unknown>),
    }));
  } catch (error) {
    console.error('Error al obtener estadísticas mensuales:', error);
    return [];
  }
}
