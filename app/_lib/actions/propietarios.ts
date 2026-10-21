'use server';
import { revalidatePath } from 'next/cache';
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

export type OwnerForEdit = {
  id: string;
  rut: string;
  nombre: string;
  correoPersonal: string;
  correoContacto: string;
  fechaNacimiento: string;
  direccion: string;
  comuna: string;
  region: string;
  telefono: string;
  rsh: string;
  profesionOficio: string;
};

export async function getOwnerForEdit(
  id: string
): Promise<OwnerForEdit | null> {
  try {
    const rows = await sql`
      SELECT
        public_id, rut, nombre, correo_personal, correo_contacto,
        fecha_nacimiento, direccion, comuna, region, telefono, rsh,
        profesion_oficio
      FROM personas
      WHERE public_id = ${id}
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    const fecha =
      row.fecha_nacimiento instanceof Date
        ? row.fecha_nacimiento.toISOString().slice(0, 10)
        : row.fecha_nacimiento
          ? String(row.fecha_nacimiento).slice(0, 10)
          : '';
    return {
      id: String(row.public_id ?? ''),
      rut: String(row.rut ?? ''),
      nombre: String(row.nombre ?? ''),
      correoPersonal: String(row.correo_personal ?? ''),
      correoContacto: String(row.correo_contacto ?? ''),
      fechaNacimiento: fecha,
      direccion: String(row.direccion ?? ''),
      comuna: String(row.comuna ?? ''),
      region: String(row.region ?? ''),
      telefono: String(row.telefono ?? '').replace(/\D/g, ''),
      rsh: row.rsh != null ? String(row.rsh) : '',
      profesionOficio: String(row.profesion_oficio ?? ''),
    };
  } catch (error) {
    console.error('[getOwnerForEdit] DB error:', error);
    return null;
  }
}

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
      FROM personas
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
      INSERT INTO personas
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
      message: `Persona "${nombre}" creada exitosamente`,
      publicId,
    };
  } catch (error) {
    console.error('[createOwner] DB error:', error);
    return fail(
      'DB_ERROR',
      'No fue posible registrar la persona. Intenta nuevamente en unos segundos.'
    );
  }
}

export type UpdateOwnerResult =
  | { success: true; message: string; publicId: string }
  | {
      success: false;
      error: string;
      code: 'VALIDATION' | 'CONFLICT' | 'NOT_FOUND' | 'DB_ERROR';
    };

export async function updateOwner(
  input: CreateOwnerInput & { id: string }
): Promise<UpdateOwnerResult> {
  try {
    const id = input.id?.trim();
    if (!id)
      return failUpdate('VALIDATION', 'No se identificó al propietario');

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

    if (!rutRaw)
      return failUpdate('VALIDATION', 'No se ingresó el RUT del propietario');
    if (!nombre)
      return failUpdate(
        'VALIDATION',
        'No se ingresó el nombre completo del propietario'
      );

    const exists = await sql`
      SELECT id FROM personas WHERE public_id = ${id} LIMIT 1
    `;
    if ((exists as unknown as unknown[]).length === 0)
      return failUpdate(
        'NOT_FOUND',
        'El propietario no existe o fue eliminado'
      );

    const rutNormalized = rutRaw.replace(/[^0-9kK]/g, '').toUpperCase();
    if (rutNormalized.length < 7)
      return failUpdate(
        'VALIDATION',
        'El RUT ingresado es demasiado corto. Verifica.'
      );

    const rutConflict = await sql`
      SELECT id FROM personas
      WHERE REPLACE(REPLACE(UPPER(rut), '.', ''), '-', '') = ${rutNormalized}
        AND public_id <> ${id}
      LIMIT 1
    `;
    if ((rutConflict as unknown as unknown[]).length > 0)
      return failUpdate(
        'CONFLICT',
        'Ya existe otro propietario registrado con este RUT.'
      );

    let fechaNacimiento: string | null = null;
    if (fechaNacimientoRaw) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimientoRaw))
        return failUpdate(
          'VALIDATION',
          'Fecha de nacimiento inválida (debe ser YYYY-MM-DD)'
        );
      const fnDate = new Date(fechaNacimientoRaw + 'T00:00:00');
      if (Number.isNaN(fnDate.getTime()))
        return failUpdate(
          'VALIDATION',
          'Fecha de nacimiento no es una fecha válida'
        );
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const maxDob = new Date(today);
      maxDob.setFullYear(today.getFullYear() - 30);
      if (fnDate > today)
        return failUpdate(
          'VALIDATION',
          'Fecha de nacimiento no puede estar en el futuro'
        );
      if (fnDate < maxDob)
        return failUpdate(
          'VALIDATION',
          'Fecha de nacimiento no puede ser mayor a 30 años atrás'
        );
      fechaNacimiento = fechaNacimientoRaw;
    }

    if (correoPersonal && !EMAIL_REGEX.test(correoPersonal))
      return failUpdate(
        'VALIDATION',
        'El correo personal no tiene un formato de email válido'
      );
    if (correoContacto && !EMAIL_REGEX.test(correoContacto))
      return failUpdate(
        'VALIDATION',
        'El correo de contacto no tiene un formato de email válido'
      );

    if (telefono) {
      const digits = telefono.replace(/\D/g, '');
      if (digits.length !== 9)
        return failUpdate('VALIDATION', 'El teléfono debe tener 9 dígitos');
    }

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
      if (!Number.isFinite(rshNum) || !Number.isInteger(rshNum))
        return failUpdate(
          'VALIDATION',
          'RSH debe ser un número entero o dejarse vacío'
        );
      if (rshNum < 40 || rshNum > 100)
        return failUpdate(
          'VALIDATION',
          'RSH fuera de rango: el valor debe estar entre 40 y 100'
        );
      if (rshNum % 10 !== 0)
        return failUpdate(
          'VALIDATION',
          'RSH inválido: solo tramos múltiplos de 10 (40, 50, 60, 70, 80, 90, 100)'
        );
      rsh = rshNum;
    }

    await sql`
      UPDATE personas SET
        rut = ${rutRaw},
        nombre = ${nombre},
        correo_personal = ${correoPersonal},
        correo_contacto = ${correoContacto},
        fecha_nacimiento = ${fechaNacimiento ? sql`(${fechaNacimiento})::text::date` : sql`NULL`},
        direccion = ${direccion},
        comuna = ${comuna},
        region = ${region},
        telefono = ${telefono},
        rsh = ${rsh},
        profesion_oficio = ${profesionOficio}
      WHERE public_id = ${id}
    `;

    revalidatePath('/admin/propietarios');
    revalidatePath(`/admin/propietarios/${id}`);

    return {
      success: true,
      message: `Propietario "${nombre}" actualizado exitosamente`,
      publicId: id,
    };
  } catch (error) {
    console.error('[updateOwner] DB error:', error);
    return failUpdate(
      'DB_ERROR',
      'No fue posible actualizar el propietario. Intenta nuevamente en unos segundos.'
    );
  }
}

function failUpdate(
  code: 'VALIDATION' | 'CONFLICT' | 'NOT_FOUND' | 'DB_ERROR',
  error: string
): UpdateOwnerResult {
  return { success: false, code, error };
}

function fail(
  code: 'VALIDATION' | 'CONFLICT' | 'DB_ERROR',
  error: string
): CreateOwnerResult {
  return { success: false, code, error };
}
