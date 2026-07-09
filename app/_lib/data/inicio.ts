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
        DATE(c.fecha_atencion) AS fecha,
        COUNT(*) AS cantidad_atenciones,
        COUNT(*) FILTER (WHERE m.especie = 'FELINO') AS gatos,
        COUNT(*) FILTER (WHERE m.especie = 'CANINO') AS perros
      FROM consultas c
      JOIN mascotas m ON c.mascota_id = m.id
      WHERE c.fecha_atencion BETWEEN ${startDate} AND ${endDate}
      GROUP BY fecha
      ORDER BY fecha;
    `;
    // Agregada la cantidad de mascotas atendidas por especie/dia.
    // console.log(result);

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
