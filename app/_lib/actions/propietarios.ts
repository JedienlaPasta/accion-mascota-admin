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
    // 1. Normalización
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

    // 2. Campos obligatorios (NOT NULL en la tabla: rut + nombre)
    if (!rutRaw)
      return fail('VALIDATION', 'No se ingresó el RUT del propietario');
    if (!nombre)
      return fail(
        'VALIDATION',
        'No se ingresó el nombre completo del propietario'
      );

    // 3. RUT — normalizar y validar unicidad (mismo criterio que createPet)
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
        'Ya existe un propietario registrado con este RUT. Usa el buscador para abrir su ficha existente.'
      );

    // 4. Fecha de nacimiento (opcional). Si viene: validar rango y formato
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
      maxDob.setFullYear(today.getFullYear() - 120);
      if (fnDate > today)
        return fail(
          'VALIDATION',
          'Fecha de nacimiento no puede estar en el futuro'
        );
      if (fnDate < maxDob)
        return fail(
          'VALIDATION',
          'Fecha de nacimiento no puede ser mayor a 120 años atrás'
        );
      fechaNacimiento = fechaNacimientoRaw;
    }

    // 5. Emails (regex básico si vienen)
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

    // 6. Teléfono: al menos 9 dígitos después de limpiar caracteres
    if (telefono) {
      const digits = telefono.replace(/\D/g, '');
      if (digits.length < 9)
        return fail(
          'VALIDATION',
          'El teléfono debe tener al menos 9 dígitos (cód. área + número)'
        );
    }

    // 7. RSH: entero positivo o null (Registro Social de Hogares)
    let rsh: number | null = null;
    if (
      rshRaw !== undefined &&
      rshRaw !== null &&
      String(rshRaw).trim() !== ''
    ) {
      const rshNum =
        typeof rshRaw === 'number'
          ? rshRaw
          : Number(String(rshRaw).replace(',', '.'));
      if (!Number.isFinite(rshNum) || !Number.isInteger(rshNum) || rshNum < 0)
        return fail(
          'VALIDATION',
          'RSH debe ser un número entero positivo o dejarse vacío'
        );
      rsh = rshNum;
    }

    // 8. Insert
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
