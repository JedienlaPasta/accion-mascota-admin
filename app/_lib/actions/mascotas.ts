'use server';
import { revalidatePath } from 'next/cache';
import sql from '../db';

export type CreatePetInput = {
  rut?: string | null;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: string;
  color: string;
  /** Peso en KG, llega string desde input number */
  peso: number | string;
  chip: string;
  esterilizado: boolean | string;
};

export type CreatePetResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR';
    };

export type PetForEdit = {
  id: string;
  rut: string;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: string;
  color: string;
  peso: string;
  chip: string;
  esterilizado: string;
};

const mapEspecieFromDb = (raw: unknown): string => {
  const v = String(raw ?? '')
    .trim()
    .toLowerCase();
  if (v.includes('canin') || v === 'perro' || v === 'perra') return 'perro';
  if (v.includes('felin') || v === 'gato' || v === 'gata') return 'gato';
  return 'otro';
};

const mapEspecieToDb = (raw: string): string => {
  const v = raw.trim().toLowerCase();
  if (v.includes('canin') || v === 'perro' || v === 'perra') return 'CANINO';
  if (v.includes('felin') || v === 'gato' || v === 'gata') return 'FELINO';
  return 'OTRO';
};

export async function getPetForEdit(id: string): Promise<PetForEdit | null> {
  try {
    const rows = await sql`
      SELECT
        m.public_id, m.nombre, m.especie, m.raza, m.sexo, m.color,
        m.microchip, m.esterilizado,
        m.fecha_nacimiento::text AS fecha_nacimiento,
        p.rut
      FROM mascotas m
      LEFT JOIN personas p ON m.responsable_id = p.id
      WHERE m.public_id = ${id}
      LIMIT 1
    `;
    const row = rows[0] as Record<string, unknown> | undefined;
    if (!row) return null;
    return {
      id: String(row.public_id ?? ''),
      rut: String(row.rut ?? ''),
      nombre: String(row.nombre ?? ''),
      especie: mapEspecieFromDb(row.especie),
      raza: String(row.raza ?? ''),
      fechaNacimiento: String(row.fecha_nacimiento ?? '').slice(0, 10),
      sexo: String(row.sexo ?? '').toLowerCase(),
      color: String(row.color ?? ''),
      peso: '',
      chip: String(row.microchip ?? ''),
      esterilizado:
        row.esterilizado === true
          ? 'true'
          : row.esterilizado === false
            ? 'false'
            : '',
    };
  } catch (error) {
    console.error('[getPetForEdit] DB error:', error);
    return null;
  }
}

export async function createPet(
  input: CreatePetInput
): Promise<CreatePetResult> {
  try {
    // Validación de entrada
    const rawRut = input.rut?.trim();
    const nombre = input.nombre?.trim();
    const especie = input.especie?.trim();
    const raza = input.raza?.trim();
    const fechaNacimientoRaw = input.fechaNacimiento?.trim();
    const sexo = input.sexo?.trim();
    const color = input.color?.trim();
    const pesoRaw = input.peso;
    const chip = input.chip?.trim();

    const esterilizadoBool =
      typeof input.esterilizado === 'boolean'
        ? input.esterilizado
        : String(input.esterilizado || '').toLowerCase() === 'true';

    // Validaciones estrictas
    // rawRut no es obligatorio. Puede ser null/vacío = mascota rescatada o comunitaria.
    if (!nombre)
      return fail('VALIDATION', 'No se ingresó nombre de la mascota');
    if (!especie) return fail('VALIDATION', 'No se seleccionó especie');
    if (!raza) return fail('VALIDATION', 'No se ingresó raza');
    if (!sexo) return fail('VALIDATION', 'No se seleccionó sexo');
    if (!color) return fail('VALIDATION', 'No se ingresó color/pelaje');
    if (!chip) return fail('VALIDATION', 'No se ingresó número de microchip');

    // Fecha nacimiento: regex + Date.parse + no futuro + max 30 años atras
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimientoRaw || ''))
      return fail(
        'VALIDATION',
        'Fecha de nacimiento inválida (formato YYYY-MM-DD)'
      );
    const fnDate = new Date(fechaNacimientoRaw + 'T00:00:00');
    if (Number.isNaN(fnDate.getTime()))
      return fail('VALIDATION', 'Fecha de nacimiento no es una fecha válida');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyYearsAgo = new Date(today);
    thirtyYearsAgo.setFullYear(today.getFullYear() - 30);
    if (fnDate > today)
      return fail(
        'VALIDATION',
        'Fecha de nacimiento no puede estar en el futuro'
      );
    if (fnDate < thirtyYearsAgo)
      return fail(
        'VALIDATION',
        'Fecha de nacimiento no puede ser mayor a 30 años atrás'
      );
    // Se ingresa el string raw validado para la fecha de nacimiento (YYYY-MM-DD, sin hora)
    const fechaNacimiento = fechaNacimientoRaw;

    // Peso: numeric(5,2) = 99.99 kg maximo
    // const pesoNum =
    //   typeof pesoRaw === 'number'
    //     ? pesoRaw
    //     : Number(String(pesoRaw || '').replace(',', '.'));
    // if (Number.isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 99.99)
    //   return fail('VALIDATION', 'Peso inválido, debe ser entre 0.1 y 99.99 kg');

    // Verificar microchip unico
    const petRow = await sql`
      SELECT id FROM mascotas WHERE microchip = ${chip} LIMIT 1
    `;
    if ((petRow as unknown as unknown[]).length > 0)
      return fail(
        'CONFLICT',
        'Ya existe una mascota registrada con este microchip'
      );

    let propietarioIdNum: number | null = null;

    if (rawRut) {
      // const rutNormalized = rawRut.replace(/[^0-9kK-]/g, '').toUpperCase();    // Cambiar a esto una vez que arregle el tema del rut en la db, idealmente deberia guardarlos con guion 123456789-K
      const rutNormalized = rawRut.replace(/[^0-9kK]/g, '').toUpperCase();

      // Si el usuario escribio solo caracteres invalidos y quedo vacio
      if (rutNormalized) {
        const propietarioRow = await sql`
          SELECT id
          FROM personas
          WHERE REPLACE(REPLACE(UPPER(rut), '.', ''), '-', '') = ${rutNormalized}
          LIMIT 1
        `;
        if ((propietarioRow as unknown as unknown[]).length === 0)
          return fail(
            'NOT_FOUND',
            'No se encontró ningúna persona con ese RUT. Verifica que esté bien escrito o deja el campo vacío para mascota sin dueño.'
          );
        propietarioIdNum = Number(propietarioRow[0].id);
      }
    }

    const publicId = crypto.randomUUID();

    await sql`
      INSERT INTO mascotas
        (
          public_id,
          responsable_id,
          nombre,
          especie,
          raza,
          sexo,
          fecha_nacimiento,
          color,
          microchip,
          esterilizado
        )
      VALUES
        (
          ${publicId},
          ${propietarioIdNum},
          ${nombre},
          ${especie},
          ${raza},
          ${sexo},
          (${fechaNacimiento})::text::date,
          ${color},
          ${chip},
          ${esterilizadoBool}
        )
    `;

    return {
      success: true,
      message: `Mascota "${nombre}" creada exitosamente`,
    };
  } catch (error) {
    console.error('[createPet] DB error:', error);
    return fail(
      'DB_ERROR',
      'No fue posible registrar la mascota. Intenta nuevamente en unos segundos.'
    );
  }
}

export type UpdatePetResult =
  | { success: true; message: string; publicId: string }
  | {
      success: false;
      error: string;
      code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR';
    };

export async function updatePet(
  input: CreatePetInput & { id: string }
): Promise<UpdatePetResult> {
  try {
    const id = input.id?.trim();
    if (!id) return failUpdate('VALIDATION', 'No se identificó a la mascota');

    const rawRut = input.rut?.trim();
    const nombre = input.nombre?.trim();
    const especie = input.especie?.trim();
    const raza = input.raza?.trim();
    const fechaNacimientoRaw = input.fechaNacimiento?.trim();
    const sexo = input.sexo?.trim();
    const color = input.color?.trim();
    const chip = input.chip?.trim();

    const esterilizadoBool =
      typeof input.esterilizado === 'boolean'
        ? input.esterilizado
        : String(input.esterilizado || '').toLowerCase() === 'true';

    if (!nombre)
      return failUpdate('VALIDATION', 'No se ingresó nombre de la mascota');
    if (!especie) return failUpdate('VALIDATION', 'No se seleccionó especie');
    if (!raza) return failUpdate('VALIDATION', 'No se ingresó raza');
    if (!sexo) return failUpdate('VALIDATION', 'No se seleccionó sexo');
    if (!color)
      return failUpdate('VALIDATION', 'No se ingresó color/pelaje');
    if (!chip)
      return failUpdate('VALIDATION', 'No se ingresó número de microchip');

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimientoRaw || ''))
      return failUpdate(
        'VALIDATION',
        'Fecha de nacimiento inválida (formato YYYY-MM-DD)'
      );
    const fnDate = new Date(fechaNacimientoRaw + 'T00:00:00');
    if (Number.isNaN(fnDate.getTime()))
      return failUpdate(
        'VALIDATION',
        'Fecha de nacimiento no es una fecha válida'
      );
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const thirtyYearsAgo = new Date(today);
    thirtyYearsAgo.setFullYear(today.getFullYear() - 30);
    if (fnDate > today)
      return failUpdate(
        'VALIDATION',
        'Fecha de nacimiento no puede estar en el futuro'
      );
    if (fnDate < thirtyYearsAgo)
      return failUpdate(
        'VALIDATION',
        'Fecha de nacimiento no puede ser mayor a 30 años atrás'
      );
    const fechaNacimiento = fechaNacimientoRaw;

    const exists = await sql`
      SELECT id FROM mascotas WHERE public_id = ${id} LIMIT 1
    `;
    if ((exists as unknown as unknown[]).length === 0)
      return failUpdate(
        'NOT_FOUND',
        'La mascota no existe o fue eliminada'
      );

    const chipConflict = await sql`
      SELECT id FROM mascotas
      WHERE microchip = ${chip} AND public_id <> ${id}
      LIMIT 1
    `;
    if ((chipConflict as unknown as unknown[]).length > 0)
      return failUpdate(
        'CONFLICT',
        'Ya existe otra mascota registrada con este microchip'
      );

    let propietarioIdNum: number | null = null;
    if (rawRut) {
      const rutNormalized = rawRut.replace(/[^0-9kK]/g, '').toUpperCase();
      if (rutNormalized) {
        const propietarioRow = await sql`
          SELECT id
          FROM personas
          WHERE REPLACE(REPLACE(UPPER(rut), '.', ''), '-', '') = ${rutNormalized}
          LIMIT 1
        `;
        if ((propietarioRow as unknown as unknown[]).length === 0)
          return failUpdate(
            'NOT_FOUND',
            'No se encontró ningúna persona con ese RUT. Verifica que esté bien escrito o deja el campo vacío para mascota sin dueño.'
          );
        propietarioIdNum = Number(propietarioRow[0].id);
      }
    }

    await sql`
      UPDATE mascotas SET
        responsable_id = ${propietarioIdNum},
        nombre = ${nombre},
        especie = ${mapEspecieToDb(especie)},
        raza = ${raza},
        sexo = ${sexo},
        fecha_nacimiento = (${fechaNacimiento})::text::date,
        color = ${color},
        microchip = ${chip},
        esterilizado = ${esterilizadoBool}
      WHERE public_id = ${id}
    `;

    revalidatePath('/admin/mascotas');
    revalidatePath(`/admin/mascotas/${id}`);

    return {
      success: true,
      message: `Mascota "${nombre}" actualizada exitosamente`,
      publicId: id,
    };
  } catch (error) {
    console.error('[updatePet] DB error:', error);
    return failUpdate(
      'DB_ERROR',
      'No fue posible actualizar la mascota. Intenta nuevamente en unos segundos.'
    );
  }
}

function failUpdate(
  code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR',
  error: string
): UpdatePetResult {
  return { success: false, code, error };
}

function fail(
  code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR',
  error: string
): CreatePetResult {
  return { success: false, code, error };
}
