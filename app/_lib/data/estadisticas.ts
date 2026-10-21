import sql from '../db';
import { StatMetricKey } from '../static-data/reportes';

export type SanitaryOperatorYearRow = Record<StatMetricKey, number> & {
  anio: number;
};

export type SanitaryOperatorMonthRow = Record<StatMetricKey, number> & {
  mes: number;
};

const toNumber = (value: unknown) => Number(value ?? 0) || 0;

const mapRow = (row: Record<string, unknown>) => ({
  octuple: toNumber(row.octuple),
  antirrabica: toNumber(row.antirrabica),
  triple: toNumber(row.triple),
  de: toNumber(row.de),
  di: toNumber(row.di),
  implantacion: toNumber(row.implantacion),
  total_atenciones: toNumber(row.total_atenciones),
  perros: toNumber(row.perros),
  gatos: toNumber(row.gatos),
});

export async function getSanitaryOperatorStatsByYear(): Promise<
  SanitaryOperatorYearRow[]
> {
  try {
    const rows = await sql`
      SELECT
        EXTRACT(YEAR FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS anio,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'OCTUPLE') AS octuple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'ANTIRRABICA') AS antirrabica,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'TRIPLE_FELINA') AS triple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DE') AS de,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DI') AS di,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
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
      ...mapRow(row as Record<string, unknown>),
    }));
  } catch (error) {
    console.error(
      'Error al obtener estadísticas anuales de operativos:',
      error
    );
    return [];
  }
}

export async function getSanitaryOperatorStatsByMonth(
  year: string
): Promise<SanitaryOperatorMonthRow[]> {
  try {
    const safeYear = Math.trunc(Number(year)) || new Date().getFullYear();

    const rows = await sql`
      SELECT
        EXTRACT(MONTH FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int AS mes,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'OCTUPLE') AS octuple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'ANTIRRABICA') AS antirrabica,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'TRIPLE_FELINA') AS triple,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DE') AS de,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'DI') AS di,
        COUNT(DISTINCT a.id) FILTER (WHERE pr.codigo = 'MICROCHIP') AS implantacion,
        COUNT(DISTINCT a.id) AS total_atenciones,
        COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'CANINO') AS perros,
        COUNT(DISTINCT a.id) FILTER (WHERE m.especie = 'FELINO') AS gatos
      FROM atenciones a
      JOIN mascotas m ON m.id = a.mascota_id
      LEFT JOIN atencion_procedimientos ap ON ap.atencion_id = a.id
      LEFT JOIN procedimientos pr ON pr.id = ap.procedimiento_id
      WHERE a.tipo_atencion = 'OPERATIVO_SANITARIO'
        AND EXTRACT(YEAR FROM (a.fecha_atencion AT TIME ZONE 'America/Santiago'))::int = ${safeYear}
      GROUP BY 1
      ORDER BY 1
    `;

    return rows.map((row) => ({
      mes: Number(row.mes),
      ...mapRow(row as Record<string, unknown>),
    }));
  } catch (error) {
    console.error(
      'Error al obtener estadísticas mensuales de operativos:',
      error
    );
    return [];
  }
}
