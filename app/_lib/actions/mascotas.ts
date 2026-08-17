'use server';
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
    const pesoNum =
      typeof pesoRaw === 'number'
        ? pesoRaw
        : Number(String(pesoRaw || '').replace(',', '.'));
    if (Number.isNaN(pesoNum) || pesoNum <= 0 || pesoNum > 99.99)
      return fail('VALIDATION', 'Peso inválido, debe ser entre 0.1 y 99.99 kg');

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
          FROM propietarios
          WHERE REPLACE(REPLACE(UPPER(rut), '.', ''), '-', '') = ${rutNormalized}
          LIMIT 1
        `;
        if ((propietarioRow as unknown as unknown[]).length === 0)
          return fail(
            'NOT_FOUND',
            'No se encontró ningún propietario con ese RUT. Verifica que esté bien escrito o deja el campo vacío para mascota sin dueño.'
          );
        propietarioIdNum = Number(propietarioRow[0].id);
      }
    }

    const publicId = crypto.randomUUID();

    await sql`
      INSERT INTO mascotas
        (
          public_id,
          propietario_id,
          nombre,
          especie,
          raza,
          sexo,
          fecha_nacimiento,
          color,
          peso,
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
          ${pesoNum},
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

function fail(
  code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR',
  error: string
): CreatePetResult {
  return { success: false, code, error };
}
