'use server';
import sql from '../db';

// ============================================================
// TODO AUTH / PERMISOS:
// Reemplazar DEV_USER_ID por el id del usuario autenticado via auth()
// y validar que tenga rol funcionario o admin para agendar.
// ============================================================
const DEV_USER_ID = 1;

export type CreateAppointmentInput = {
  petPublicId: string;
  serviceName: string;
  dateIso: string; // Fecha ISO YYYY-MM-DD
  time24: string; // Hora HH:MM formato 24h
};

export type CreateAppointmentResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR';
    };

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<CreateAppointmentResult> {
  try {
    // Validación estricta de entrada
    const petPublicId = input.petPublicId?.trim();
    const serviceName = input.serviceName?.trim();
    const dateIso = input.dateIso?.trim();
    const time24 = input.time24?.trim();

    if (!petPublicId)
      return fail('VALIDATION', 'No se seleccionó ninguna mascota');
    if (!serviceName)
      return fail('VALIDATION', 'No se seleccionó ningún servicio');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateIso))
      return fail('VALIDATION', 'Fecha inválida (formato YYYY-MM-DD)');
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time24))
      return fail('VALIDATION', 'Hora inválida (formato HH:MM en 24h)');

    const isWeekend = (date: Date) => {
      const weekday = date.getDay();
      return weekday === 0 || weekday === 6;
    };

    if (isWeekend(new Date(dateIso))) {
      return fail('VALIDATION', 'No se puede agendar en fines de semana');
    }

    const horaAgendadaSql = `${dateIso} ${time24}:00`; // sin letra T

    // Verificar que la fecha no sea en el pasado
    const parts = new Intl.DateTimeFormat('sv-SE', {
      timeZone: 'America/Santiago',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).formatToParts(new Date(Date.now() - 2 * 60_000)); // 2min de gracia
    const objNow = Object.fromEntries(parts.map((p) => [p.type, p.value]));
    const nowSantiago = `${objNow.year}-${objNow.month}-${objNow.day} ${objNow.hour}:${objNow.minute}:${objNow.second}`;

    if (horaAgendadaSql < nowSantiago) {
      return fail(
        'VALIDATION',
        'Esta hora ya no se encuentra disponible para agendar.'
      );
    }

    // Obtener id mascota via public_id
    const petRow = await sql`
      SELECT id FROM mascotas WHERE public_id = ${petPublicId} LIMIT 1
    `;
    if ((petRow as unknown as unknown[]).length === 0)
      return fail('NOT_FOUND', 'Mascota no encontrada');
    const mascotaId = (petRow[0] as { id: number }).id;

    const overlap = await sql`
      SELECT 1
      FROM citas
      WHERE hora_agendada = (${horaAgendadaSql})::text::timestamp
      AND COALESCE(estado, 'pendiente') <> 'cancelada'
      LIMIT 1
    `;
    if ((overlap as unknown as unknown[]).length > 0)
      return fail(
        'CONFLICT',
        `Ya existe una cita agendada para el ${dateIso} a las ${time24} hrs.`
      );

    const publicId = crypto.randomUUID();

    await sql`
      INSERT INTO citas
        (public_id, usuario_id, mascota_id, hora_agendada, motivo, estado)
      VALUES
        (
          ${publicId},
          ${DEV_USER_ID},
          ${mascotaId},
          (${horaAgendadaSql})::text::timestamp,
          ${serviceName},
          'pendiente'
        )
    `;

    return { success: true, message: 'Cita agendada con exito' };
  } catch (error) {
    console.error('[createAppointment] DB error:', error);
    return fail('DB_ERROR', 'Problema interno. Intenta nuevamente.');
  }
}

// helper privado
function fail(
  code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR',
  error: string
): CreateAppointmentResult {
  return { success: false, code, error };
}
