'use server';
import sql from '../db';
import {
  TIPO_STYLES,
  TIPOS_ATENCION_VALIDOS,
} from '../static-data/tipos-atencion';
import { validateMicrochip } from '../utils/check-values';

// ================================================================
// TIPOS PÚBLICOS
// ================================================================

export type CreateAttentionInput = {
  /** public_id de la mascota */
  petPublicId: string;
  /** public_id del usuario veterinario (opcional: si no viene, busca uno default) */
  usuarioPublicId?: string | null;
  tipoAtencion: string;
  fechaAtencion: string; // ISO local datetime YYYY-MM-DDThh:mm (se convierte en TIMESTAMP
  pesoAtencion?: number | string | null;
  observaciones?: string | null;

  // --- Campos condicionales por TIPO ---
  // 1) CONSULTA_MEDICA / CONTROL / EMERGENCIA (tabla consultas_medicas)
  motivo?: string | null;
  anamnesis?: string | null;
  examenFisico?: string | null;
  diagnosticoPredx?: string | null;
  examenesSolicitados?: string | null;
  tratamiento?: string | null;
  derivacionClinica?: boolean | string | null;

  // 2) OPERATIVO_ESTERILIZACION (tabla operativos_esterilizacion)
  resultadoEsterilizacion?: string | null;
  marcarEsterilizado?: boolean | string | null;

  // 3) OPERATIVO_SANITARIO (tabla N-M atencion_procedimientos -> procedimientos)
  //    Array con los IDs INTEGER de procedimientos (no public_id, los IDs int)
  procedimientoIds?: string[];

  // 4) IMPLANTE_MICROCHIP (tabla implantaciones_microchip + UPDATE mascotas)
  numeroMicrochip?: string | null;
  /** Si es implante, actualiza la mascota (micro y inscrito_registro_nacional?**/
  actualizarMicrochipMascota?: boolean | string | null;
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

// ================================================================
// ACCIÓN PRINCIPAL
// ================================================================
export async function createAttention(
  input: CreateAttentionInput
): Promise<CreateAttentionResult> {
  try {
    // ----------------------------------------------------------------
    // 1) Validación y normalización
    // ----------------------------------------------------------------
    const petPublicId = input.petPublicId?.trim() ?? '';
    const tipo = (input.tipoAtencion ?? '').trim() as string;

    if (!petPublicId) return fail('NOT_FOUND', 'No se identificó la mascota');
    if (!TIPOS_ATENCION_VALIDOS.includes(tipo))
      return fail('VALIDATION', 'Tipo de atención no válido.');

    // 1a. Fecha
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
    maxAtras.setFullYear(hoy.getFullYear() - 40);
    if (fechaAtencionDate > new Date(hoy.getTime() + 1000 * 60 * 60 * 24 * 7))
      return fail(
        'VALIDATION',
        'La fecha no puede ser más de 7 días en el futuro.'
      );
    if (fechaAtencionDate < maxAtras)
      return fail(
        'VALIDATION',
        'Fecha de atención muy antigua (más de 40 años atrás.'
      );

    // 1b. Peso
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

    // ----------------------------------------------------------------
    // 2) Validar existencia (mascota + usuario)
    // ----------------------------------------------------------------
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

    // Resolver veterinario:
    let usuarioId: number;
    if (input.usuarioPublicId) {
      const u = await sql`
      SELECT id FROM usuarios WHERE public_id = ${input.usuarioPublicId} AND estado = TRUE LIMIT 1
    `;
      if ((u as unknown[]).length === 0)
        return fail(
          'NOT_FOUND',
          'Funcionario/a no encontrado/a o desactivado.'
        );
      usuarioId = Number(u[0].id);
    } else {
      const u = await sql`
        SELECT id FROM usuarios 
        WHERE estado = TRUE 
        ORDER BY 
          CASE WHEN LOWER(cargo) LIKE '%veterin%' THEN 0 
               WHEN LOWER(cargo) LIKE '%admin%' THEN 1 
               ELSE 2 END,
          id ASC
        LIMIT 1
      `;
      if ((u as unknown[]).length === 0)
        return fail(
          'NOT_FOUND',
          'No hay usuarios activos en el sistema para asociar a la atención.'
        );
      usuarioId = Number(u[0].id);
    }

    // ----------------------------------------------------------------
    // 3) Validaciones específicas por tipo de atención ANTES de la tx
    // ----------------------------------------------------------------
    // 3a. OPERATIVO_SANITARIO: al menos 1 procedimiento
    let procedimientoIdsInt: number[] = [];
    if (tipo === 'operativo_sanitario') {
      const ids = input.procedimientoIds ?? [];
      const cleanIds = Array.isArray(ids)
        .map((x) => Number(x))
        .filter((n) => Number.isFinite(n) && Number.isInteger(n) && n > 0);
      if (cleanIds.length === 0) {
        return fail(
          'VALIDATION',
          'Selecciona al menos un procedimiento para este operativo sanitario.'
        );
      }
      // Verificar que los IDs existan
      const existentes = await sql`
        SELECT id FROM procedimientos WHERE id IN ${sql(cleanIds)}`;
      if ((existentes as unknown[]).length !== cleanIds.length)
        return fail(
          'NOT_FOUND',
          'Uno o más procedimientos seleccionados no existen en el catálogo.'
        );
      procedimientoIdsInt = cleanIds;
    }

    // 3b. IMPLANTE microchip
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
          `Esta mascota ya tiene microchip registrado (${yaTieneChip}). Si es un reemplazo, actualiza la ficha primero.`
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

    // 3c. OPERATIVO_ESTERILIZACION: resultado
    let resultadoEsterilizacion: string | null = null;
    if (tipo === 'operativo_esterilizacion') {
      resultadoEsterilizacion =
        String(input.resultadoEsterilizacion ?? '').trim() || null;
      if (!resultadoEsterilizacion) {
        return fail('VALIDATION', 'Debes indicar el resultado de la cirugía.');
      }
    }

    // 3d. Consulta: motivo
    let motivo: string | null = null;
    if (
      tipo === 'consulta_medica' ||
      tipo === 'control' ||
      tipo === 'emergencia'
    ) {
      motivo = String(input.motivo ?? '').trim() || null;
      if (!motivo) {
        return fail(
          'VALIDATION',
          'Ingresa el motivo de la consulta/control/emergencia.'
        );
      }
    }

    const marcarEsterilizadoBool =
      typeof input.marcarEsterilizado === true ||
      String(input.marcarEsterilizado ?? '').toLowerCase() === 'true';

    const actualizarMicrochipMascotaBool =
      typeof input.actualizarMicrochipMascota === true ||
      String(input.actualizarMicrochipMascota ?? '').toLowerCase() === 'true';

    const derivacionClinicaBool =
      typeof input.derivacionClinica === true ||
      String(input.derivacionClinica ?? '').toLowerCase() === 'true';

    const observaciones = String(input.observaciones ?? '').trim() || null;
    const publicId = crypto.randomUUID();

    // ----------------------------------------------------------------
    // 4) TRANSACCIÓN ATÓMICA
    // ----------------------------------------------------------------
    await sql.begin(async (tx) => {
      // 4a. INSERT atenciones (fila principal
      await tx`
        INSERT INTO atenciones
          (public_id, usuario_id, mascota_id, fecha_atencion, tipo_atencion, peso_actual, observaciones)
        VALUES
          (${publicId}, ${usuarioId}, ${mascotaId}, ${fechaString}::timestamp, ${tipo}, ${pesoAtencion}, ${observaciones})
      `;

      // Cargar el ID serial para las tablas hijas.
      const attentionRow = await tx`
        SELECT id FROM atenciones WHERE public_id = ${publicId} LIMIT 1
      `;
      const atencionId = Number(attentionRow[0].id);

      // Subtipo 1: CONSULTA_MEDICA / CONTROL / EMERGENCIA (consultas_medicas)
      if (
        tipo === 'consulta_medica' ||
        tipo === 'control' ||
        tipo === 'emergencia'
      ) {
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
            (atencion_id, motivo, anamnesis, examen_fisico, diagnostico_predx, examenes_solicitados, tratamiento, derivacion_clinica_privada)
          VALUES
            (${atencionId}, ${cmMotivo}, ${cmAnamnesis}, ${cmExamenFisico}, ${cmDiagnosticoPredx}, ${cmExamenesSolicitados}, ${cmTratamiento}, ${derivacionClinicaBool})
        `;
      }

      // Subtipo 2: OPERATIVO_ESTERILIZACION
      if (tipo === 'operativo_esterilizacion') {
        await tx`
          INSERT INTO operativos_esterilizacion
            (atencion_id, resultado)
          VALUES
            (${atencionId}, ${resultadoEsterilizacion})
        `;
        if (marcarEsterilizadoBool) {
          await tx`
            UPDATE mascotas SET esterilizado = TRUE WHERE id = ${mascotaId}
          `;
        }
      }

      // Subtipo 3: OPERATIVO_SANITARIO (N-M atencion_procedimientos)
      if (tipo === 'operativo_sanitario' && procedimientoIdsInt.length > 0) {
        const rows = procedimientoIdsInt.map((pid) => ({
          procedimiento_id: pid,
          atencion_id: atencionId,
        }));
        await tx`
          INSERT INTO atencion_procedimientos ${tx(rows)}
        `;
      }

      // Subtipo 4: IMPLANTE microchip
      if (numeroMicrochipNormalizado) {
        await tx`INSERT INTO implantaciones_microchip (atencion_id, numero_microchip) VALUES (${atencionId}, ${numeroMicrochipNormalizado})`;
        if (actualizarMicrochipMascotaBool) {
          await tx`
            UPDATE mascotas SET microchip = ${numeroMicrochipNormalizado},
            inscrito_registro_nacional = TRUE
            WHERE id = ${mascotaId}`;
        }
      }
    });

    return {
      success: true,
      message: `Atención (${TIPO_STYLES[tipo].displayName}) registrada correctamente.`,
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

// ================================================================
// HELPERS
// ================================================================
function fail(
  code: 'VALIDATION' | 'NOT_FOUND' | 'CONFLICT' | 'DB_ERROR',
  error: string
): CreateAttentionResult {
  return { success: false, code, error };
}
