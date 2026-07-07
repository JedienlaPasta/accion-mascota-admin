import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { sql } from '../db';

export async function getDailyAttentionCountByYear(year: string) {
  try {
    dayjs.extend(utc);

    const startDate = `${year}-01-01`;
    const endDate = `${year}-12-31`;

    const result = await sql`
      SELECT
        DATE(fecha_atencion) AS fecha,
        COUNT(*) AS cantidad_atenciones
      FROM consultas
      WHERE fecha_atencion BETWEEN ${startDate} AND ${endDate}
      GROUP BY DATE(fecha_atencion)
      ORDER BY fecha;
    `;

    const attentionsPerDay: Record<string, number> = {};

    for (const row of result) {
      const dateStr = dayjs.utc(row.fecha).format('YYYY-MM-DD');
      attentionsPerDay[dateStr] = Number(row.cantidad_atenciones);
    }

    return attentionsPerDay;
  } catch (error) {
    console.error('Error al obtener el conteo diario de entregas:', error);
    return {} as Record<string, number>;
  }
}
