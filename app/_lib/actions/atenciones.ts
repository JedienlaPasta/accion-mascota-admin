'use server';
import sql from '../db';
import {
  TIPO_STYLES,
  TIPOS_ATENCION_VALIDOS,
} from '../static-data/tipos-atencion';
import { validateMicrochip } from '../utils/check-values';
import { revalidatePath } from 'next/cache';

export type CreateAttentionInput = {
  petPublicId: string;
  funcionarioPublicId?: string | null; // public_id del funcionario veterinario
  acompaniantePublicId?: string | null; // public_id del acompañante
  tipoAtencion: string;
  fechaAtencion: string; // ISO local datetime YYYY-MM-DDThh:mm (se convierte en TIMESTAMP
  pesoAtencion?: number | string | null;
  observaciones?: string | null;

  // CONSULTA_MEDICA
  motivo?: string | null;
  anamnesis?: string | null;
  examenFisico?: string | null;
  diagnosticoPredx?: string | null;
  examenesSolicitados?: string | null;
  tratamiento?: string | null;
  derivacionClinica?: boolean | string | null;

  // OPERATIVO_ESTERILIZACION
  resultadoEsterilizacion?: string | null;
  marcarEsterilizado?: boolean | string | null;

  // OPERATIVO_SANITARIO - Array con los codigos de procedimientos
  procedimientoCodes?: string[];

  // IMPLANTE_MICROCHIP (tabla implantaciones_microchip)
  numeroMicrochip?: string | null;
};

export type CreateAttentionResult =
  | {
      success: true;
      message: string;
      publicId: string;
    }
  | {
      success: false;
      error: string;
      code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR';
    };

export type DeleteAttentionResult =
  | { success: true; message: string }
  | {
      success: false;
      error: string;
      code: 'VALIDATION' | 'NOT_FOUND' | 'DB_ERROR';
    };

export async function createAttention(
  input: CreateAttentionInput
): Promise<CreateAttentionResult> {
  try {
    console.log(input);
    // 1) Validación y normalización
    const petPublicId = input.petPublicId?.trim() ?? '';
    const tipo = (input.tipoAtencion ?? '').trim() as string;

    if (!petPublicId) return fail('NOT_FOUND', 'No se identificó la mascota');
    if (!TIPOS_ATENCION_VALIDOS.includes(tipo))
      return fail('VALIDATION', 'Tipo de atención no válido.');

    // Fecha
    const fechaString = input.fechaAtencion?.trim();
    if (!fechaString)
      return fail('VALIDATION', 'No se ingresó fecha/hora de la atención.');
    // Aceptar YYYY-MM-DDThh:mm o YYYY-MM-DD.
    if (!/^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2})?)?$/.test(fechaString))
      return fail(
        'VALIDATION',
        'Fecha/hora de atención no cumple el formato esperado (YYYY-MM-DD hh:mm).'
      );
    const fechaAtencionDate = new Date(
      /T/.test(fechaString) ? fechaString : `${fechaString}T12:00:00`
    );
    if (Number.isNaN(fechaAtencionDate.getTime()))
      return fail(
        'VALIDATION',
        'Fecha/hora de atención no es una fecha válida.'
      );
    const hoy = new Date();
    const maxAtras = new Date();
    maxAtras.setFullYear(hoy.getFullYear() - 1);
    if (fechaAtencionDate > new Date(hoy.getTime() + 1000 * 60 * 60 * 24 * 7))
      return fail(
        'VALIDATION',
        'La fecha no puede ser más de 7 días en el futuro.'
      );
    if (fechaAtencionDate < maxAtras)
      return fail(
        'VALIDATION',
        'Fecha de atención muy antigua (más de 1 año atrás).'
      );

    // Peso
    let pesoAtencion: number | null = null;
    if (
      input.pesoAtencion !== undefined &&
      input.pesoAtencion !== null &&
      String(input.pesoAtencion).trim() !== ''
    ) {
      const n =
        typeof input.pesoAtencion === 'number'
          ? input.pesoAtencion
          : Number(String(input.pesoAtencion).replace(',', '.'));
      if (!Number.isFinite(n) || n <= 0 || n > 999.99)
        return fail(
          'VALIDATION',
          'Peso inválido: debe ser un número mayor a 0 kg (máx 999.99 kg).'
        );
      pesoAtencion = Number(n.toFixed(2));
    }

    // 2) Validar existencia (mascota + funcionario + acompañante)
    const petRow = await sql`
      SELECT id, public_id, microchip, esterilizado, inscrito_registro_nacional
      FROM mascotas
      WHERE public_id = ${petPublicId}
      LIMIT 1
    `;
    if ((petRow as unknown[]).length === 0)
      return fail('NOT_FOUND', 'No existe la mascota en el sistema.');

    const mascotaId = Number(petRow[0].id);
    const yaTieneChip = Boolean(petRow[0].microchip);

    const funcionarioPublicIdRaw = input.funcionarioPublicId?.trim() ?? '';
    if (!funcionarioPublicIdRaw) {
      return fail(
        'VALIDATION',
        'No se identificó el funcionario/a que realiza la atención. Inicia sesión o selecciona un veterinario.'
      );
    }
    const userRow = await sql`
      SELECT f.id
      FROM funcionarios f
      JOIN personas p ON p.id = f.persona_id
      WHERE p.public_id = ${funcionarioPublicIdRaw}
        AND f.estado = TRUE
      LIMIT 1
    `;
    if ((userRow as unknown[]).length === 0) {
      return fail('NOT_FOUND', 'Funcionario/a no encontrado/a o desactivado.');
    }
    const funcionarioId = Number(userRow[0].id);

    let acompanianteId: number | null = null;
    const acompaniantePublicIdRaw = input.acompaniantePublicId?.trim() ?? '';
    if (acompaniantePublicIdRaw) {
      const companionUserRow = await sql`
        SELECT p.id
        FROM personas p
        WHERE p.public_id = ${acompaniantePublicIdRaw}
        LIMIT 1
      `;
      if ((companionUserRow as unknown[]).length === 0) {
        return fail(
          'NOT_FOUND',
          'Acompañante/a no encontrado/a o desactivado.'
        );
      }
      acompanianteId = Number(companionUserRow[0].id);
    }

    // 3) Validaciones por tipo de atención antes de la tx
    // OPERATIVO_SANITARIO: al menos 1 procedimiento
    let procedimientoIdsInt: number[] = [];
    if (tipo === 'OPERATIVO_SANITARIO') {
      const codes = input.procedimientoCodes ?? [];
      if (codes.length === 0) {
        return fail(
          'VALIDATION',
          'Selecciona al menos un procedimiento para este operativo sanitario.'
        );
      }
      // Verificar que los Codes existan
      const idsExistentes = await sql`
        SELECT id FROM procedimientos WHERE codigo IN ${sql(codes)}`;
      if ((idsExistentes as unknown[]).length !== codes.length)
        return fail(
          'NOT_FOUND',
          'Uno o más procedimientos seleccionados no existen en el catálogo.'
        );
      procedimientoIdsInt = idsExistentes.map((x) => Number(x.id));
    }

    // IMPLANTE MICROCHIP
    let numeroMicrochipNormalizado: string | null = null;
    if (input.numeroMicrochip && String(input.numeroMicrochip).trim()) {
      const chip = String(input.numeroMicrochip).trim();
      const warnings = validateMicrochip(chip);
      if (warnings.length > 0) {
        return fail('VALIDATION', warnings[0]);
      }
      if (yaTieneChip) {
        return fail(
          'CONFLICT',
          `Esta mascota ya tiene microchip registrado (${yaTieneChip}).`
        );
      }
      // Unicidad del chip en tabla implantaciones.
      const repetido = await sql`
        SELECT id FROM implantaciones_microchip WHERE numero_microchip = ${chip} LIMIT 1
        `;
      if ((repetido as unknown[]).length > 0) {
        return fail(
          'CONFLICT',
          'Este número de microchip ya fue implantado en otra mascota.'
        );
      }
      numeroMicrochipNormalizado = chip;
    }

    // OPERATIVO_ESTERILIZACION: resultado
    let resultadoEsterilizacion: string | null = null;
    if (tipo === 'OPERATIVO_ESTERILIZACION') {
      resultadoEsterilizacion =
        String(input.resultadoEsterilizacion ?? '')
          .trim()
          .toUpperCase() || null;
      if (!resultadoEsterilizacion) {
        return fail('VALIDATION', 'Debes indicar el resultado de la cirugía.');
      }
    }

    // Consulta: motivo
    let motivo: string | null = null;
    if (tipo === 'CONSULTA_MEDICA') {
      motivo = String(input.motivo ?? '').trim() || null;
      if (!motivo) {
        return fail('VALIDATION', 'Ingresa el motivo de la consulta.');
      }
    }

    const derivacionClinicaBool = Boolean(input.derivacionClinica) === true;
    const observaciones = String(input.observaciones ?? '').trim() || null;
    const publicId = crypto.randomUUID();

    console.log(tipo);

    // 4) TRANSACCIÓN ATOMICA
    await sql.begin(async (tx) => {
      const attentionRow = await tx`
        INSERT INTO atenciones
          (
            public_id,
            funcionario_id,
            mascota_id,
            fecha_atencion,
            tipo_atencion,
            peso_actual,
            observaciones,
            acompaniante_id
          )
        VALUES
          (
            ${publicId},
            ${funcionarioId},
            ${mascotaId},
            (${fechaString})::timestamp AT TIME ZONE 'America/Santiago',
            ${tipo},
            ${pesoAtencion},
            ${observaciones},
            ${acompanianteId}
          )
        RETURNING id
      `;
      const atencionId = Number(attentionRow[0].id);

      // Subtipo 1: CONSULTA_MEDICA
      if (tipo === 'CONSULTA_MEDICA') {
        const cmMotivo = String(input.motivo ?? '').trim() || null;
        const cmAnamnesis = String(input.anamnesis ?? '').trim() || null;
        const cmExamenFisico = String(input.examenFisico ?? '').trim() || null;
        const cmDiagnosticoPredx =
          String(input.diagnosticoPredx ?? '').trim() || null;
        const cmExamenesSolicitados =
          String(input.examenesSolicitados ?? '').trim() || null;
        const cmTratamiento = String(input.tratamiento ?? '').trim() || null;

        await tx`
          INSERT INTO consultas_medicas
            (
              atencion_id, 
              motivo, 
              anamnesis, 
              examen_fisico, 
              diagnostico_predx, 
              examenes_solicitados, 
              tratamiento, 
              derivacion_clinica_privada
            )
          VALUES
            (
              ${atencionId}, 
              ${cmMotivo}, 
              ${cmAnamnesis}, 
              ${cmExamenFisico}, 
              ${cmDiagnosticoPredx}, 
              ${cmExamenesSolicitados}, 
              ${cmTratamiento}, 
              ${derivacionClinicaBool}
            )
        `;
      }

      // Subtipo 2: OPERATIVO_ESTERILIZACION
      if (tipo === 'OPERATIVO_ESTERILIZACION' && resultadoEsterilizacion) {
        await tx`
          INSERT INTO operativos_esterilizacion
            (atencion_id, resultado)
          VALUES
            (${atencionId}, ${resultadoEsterilizacion})
        `;
        if (resultadoEsterilizacion === 'APROBADO') {
          await tx`
            UPDATE mascotas SET esterilizado = TRUE WHERE id = ${mascotaId}
          `;
        }
      }

      // Subtipo 3: OPERATIVO_SANITARIO
      if (tipo === 'OPERATIVO_SANITARIO' && procedimientoIdsInt.length > 0) {
        const rows = procedimientoIdsInt.map((pid) => ({
          procedimiento_id: pid,
          atencion_id: atencionId,
        }));
        await tx`
          INSERT INTO atencion_procedimientos ${tx(rows)}
        `;
      }

      // Subtipo 4: IMPLANTE MICROCHIP
      if (numeroMicrochipNormalizado) {
        await tx`INSERT INTO implantaciones_microchip (atencion_id, numero_microchip) VALUES (${atencionId}, ${numeroMicrochipNormalizado})`;
      }
    });

    return {
      success: true,
      message: `Atención (${TIPO_STYLES[tipo.toLowerCase()].displayName}) registrada correctamente.`,
      publicId,
    };
  } catch (error) {
    console.error('[createAttention] DB error:', error);
    return fail(
      'DB_ERROR',
      'No fue posible registrar la atención. Intenta nuevamente en unos segundos.'
    );
  }
}

// Eliminar Atencion
export async function deleteAttention(
  publicId: string
): Promise<DeleteAttentionResult> {
  const safeId = publicId?.trim() ?? '';
  if (!safeId) {
    return {
      success: false,
      code: 'VALIDATION',
      error: 'Falta identificador de la atención.',
    };
  }

  try {
    // 1) Confirmar que exista la atencion
    const existente = await sql`
      SELECT a.id, m.public_id AS mascota_public_id
      FROM atenciones a
      LEFT JOIN mascotas m ON m.id = a.mascota_id
      WHERE a.public_id = ${safeId}
      LIMIT 1
    `;
    if ((existente as unknown[]).length === 0) {
      return {
        success: false,
        code: 'NOT_FOUND',
        error: 'Atención no encontrada (o ya fue borrada).',
      };
    }
    const atencionId = Number(existente[0].id);
    const mascotaPublicId = existente[0].mascota_public_id as string | null;

    // 2) Transacción: borrar tablas hijas y luego la atención.
    await sql.begin(async (tx) => {
      await tx`DELETE FROM consultas_medicas          WHERE atencion_id = ${atencionId}`;
      await tx`DELETE FROM operativos_esterilizacion  WHERE atencion_id = ${atencionId}`;
      await tx`DELETE FROM atencion_procedimientos    WHERE atencion_id = ${atencionId}`;
      await tx`DELETE FROM implantaciones_microchip   WHERE atencion_id = ${atencionId}`;

      // Borrar atencion
      await tx`DELETE FROM atenciones WHERE id = ${atencionId}`;
    });

    revalidatePath('/admin/atenciones');
    revalidatePath('/admin/mascotas');
    if (mascotaPublicId) {
      revalidatePath(`/admin/mascotas/${mascotaPublicId}`);
    }

    return {
      success: true,
      message: 'Atención eliminada correctamente.',
    };
  } catch (error) {
    console.error('[deleteAttention] DB error:', error);
    return {
      success: false,
      code: 'DB_ERROR',
      error: 'No fue posible borrar la atención. Intenta nuevamente.',
    };
  }
}

// ================================================================
// HELPERS
// ================================================================
function fail(
  code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR',
  error: string
): CreateAttentionResult {
  return { success: false, code, error };
}
