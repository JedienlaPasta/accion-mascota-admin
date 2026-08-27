'use server';
import sql from '../db';

export type CreateOwnerInput = {
  rut: string;
  nombre: string;
  correoPersonal?: string | null;
  correoContacto?: string | null;
  fechaNacimiento?: string | null;
  direccion?: string | null;
  comuna?: string | null;
  region?: string | null;
  telefono?: string | null;
  rsh?: number | string | null;
  profesionOficio?: string | null;
};

export type CreateOwnerResult =
  | { success: true; message: string; publicId: string }
  | {
      success: false;
      error: string;
      code: 'VALIDATION' | 'CONFLICT' | 'DB_ERROR';
    };

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createOwner(
  input: CreateOwnerInput
): Promise<CreateOwnerResult> {
  try {
    const rutRaw = input.rut?.trim() ?? '';
    const nombre = input.nombre?.trim() ?? '';
    const correoPersonal = input.correoPersonal?.trim() || null;
    const correoContacto = input.correoContacto?.trim() || null;
    const fechaNacimientoRaw = input.fechaNacimiento?.trim() || null;
    const direccion = input.direccion?.trim() || null;
    const comuna = input.comuna?.trim() || null;
    const region = input.region?.trim() || null;
    const telefono = input.telefono?.trim() || null;
    const rshRaw = input.rsh;
    const profesionOficio = input.profesionOficio?.trim() || null;

    // Campos obligatorios
    if (!rutRaw)
      return fail('VALIDATION', 'No se ingresó el RUT del propietario');
    if (!nombre)
      return fail(
        'VALIDATION',
        'No se ingresó el nombre completo del propietario'
      );

    // RUT — normalizar y validar unicidad
    const rutNormalized = rutRaw.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutNormalized.length < 7)
      return fail(
        'VALIDATION',
        'El RUT ingresado es demasiado corto. Verifica.'
      );

    const existingByRut = await sql`
      SELECT id
      FROM propietarios
      WHERE REPLACE(REPLACE(UPPER(rut), '.', ''), '-', '') = ${rutNormalized}
      LIMIT 1
    `;
    if ((existingByRut as unknown as unknown[]).length > 0)
      return fail(
        'CONFLICT',
        'Ya existe un propietario registrado con este RUT. Usa el buscador para abrir su registro.'
      );

    // Fecha de nacimiento (opcional). Si viene: validar rango y formato
    let fechaNacimiento: string | null = null;
    if (fechaNacimientoRaw) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimientoRaw))
        return fail(
          'VALIDATION',
          'Fecha de nacimiento inválida (debe ser YYYY-MM-DD)'
        );
      const fnDate = new Date(fechaNacimientoRaw + 'T00:00:00');
      if (Number.isNaN(fnDate.getTime()))
        return fail('VALIDATION', 'Fecha de nacimiento no es una fecha válida');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDob = new Date(today);
      maxDob.setFullYear(today.getFullYear() - 30);
      if (fnDate > today)
        return fail(
          'VALIDATION',
          'Fecha de nacimiento no puede estar en el futuro'
        );
      if (fnDate < maxDob)
        return fail(
          'VALIDATION',
          'Fecha de nacimiento no puede ser mayor a 30 años atrás'
        );
      fechaNacimiento = fechaNacimientoRaw;
    }

    // Emails (regex básico si vienen)
    if (correoPersonal && !EMAIL_REGEX.test(correoPersonal))
      return fail(
        'VALIDATION',
        'El correo personal no tiene un formato de email válido'
      );
    if (correoContacto && !EMAIL_REGEX.test(correoContacto))
      return fail(
        'VALIDATION',
        'El correo de contacto no tiene un formato de email válido'
      );

    // Teléfono: debe tener 9 dígitos
    if (telefono) {
      const digits = telefono.replace(/\D/g, '');
      if (digits.length !== 9)
        return fail('VALIDATION', 'El teléfono debe tener 9 dígitos');
    }

    // RSH: entero positivo o null (Registro Social de Hogares) (rango: 40-100, multiplos de 10)
    let rsh: number | null = null;
    if (
      rshRaw !== undefined &&
      rshRaw !== null &&
      String(rshRaw).trim() !== ''
    ) {
      const rshNum =
        typeof rshRaw === 'number'
          ? rshRaw
          : Number(String(rshRaw).replace(/[,\.]/g, ''));
      if (!Number.isFinite(rshNum) || !Number.isInteger(rshNum)) {
        return fail(
          'VALIDATION',
          'RSH debe ser un número entero o dejarse vacío'
        );
      }
      if (rshNum < 40 || rshNum > 100) {
        return fail(
          'VALIDATION',
          'RSH fuera de rango: el valor debe estar entre 40 y 100 (tramos oficiales)'
        );
      }
      if (rshNum % 10 !== 0) {
        return fail(
          'VALIDATION',
          'RSH inválido: solo se aceptan tramos oficiales múltiplos de 10 (40, 50, 60, 70, 80, 90, 100)'
        );
      }
      rsh = rshNum;
    }

    // Insert
    const publicId = crypto.randomUUID();

    await sql`
      INSERT INTO propietarios
        (
          public_id,
          rut,
          nombre,
          correo_personal,
          correo_contacto,
          fecha_nacimiento,
          direccion,
          comuna,
          region,
          telefono,
          rsh,
          profesion_oficio
        )
      VALUES
        (
          ${publicId},
          ${rutRaw},
          ${nombre},
          ${correoPersonal},
          ${correoContacto},
          ${fechaNacimiento ? sql`(${fechaNacimiento})::text::date` : sql`NULL`},
          ${direccion},
          ${comuna},
          ${region},
          ${telefono},
          ${rsh},
          ${profesionOficio}
        )
    `;

    return {
      success: true,
      message: `Propietario "${nombre}" creado exitosamente`,
      publicId,
    };
  } catch (error) {
    console.error('[createOwner] DB error:', error);
    return fail(
      'DB_ERROR',
      'No fue posible registrar el propietario. Intenta nuevamente en unos segundos.'
    );
  }
}

function fail(
  code: 'VALIDATION' | 'CONFLICT' | 'DB_ERROR',
  error: string
): CreateOwnerResult {
  return { success: false, code, error };
}
