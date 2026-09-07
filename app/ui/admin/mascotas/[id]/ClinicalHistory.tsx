'use client';

import { useState } from 'react';
import { ClinicHistoryItem } from '@/app/_lib/data-types/mascotas';
import { deleteAttention } from '@/app/_lib/actions/atenciones';
import { TIPO_STYLES } from '@/app/_lib/static-data/tipos-atencion';
import { capitalize, formatShortDate } from '@/app/_lib/utils/format';
import Badge from '@/app/ui/components/Badge';
import { SecondaryButton } from '@/app/ui/components/Button';
import { toast } from 'sonner';
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Loader2,
  Stethoscope,
  Trash2,
} from 'lucide-react';
import Link from 'next/link';
import { ProcedimientoItem } from '@/app/_lib/data/atenciones';

export default function ClinicalHistory({
  clinicHistory: initialHistory,
}: {
  clinicHistory: ClinicHistoryItem[];
}) {
  const [history, setHistory] = useState<ClinicHistoryItem[]>(initialHistory);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDeleteAttention(registro: ClinicHistoryItem) {
    const tipoLabel =
      TIPO_STYLES[registro.tipo_atencion.toLowerCase()]?.label ??
      registro.tipo_atencion;
    const fecha = formatShortDate(registro.fecha_atencion);
    const ok = window.confirm(
      `ATENCION: Eliminar registro del ${fecha} (${tipoLabel}) ?\n\nSe borran TODAS las tablas hijas: diagnosticos, procedimientos, implantes, esterilizacion.\n\nEsta accion NO SE PUEDE DESHACER.`
    );
    if (!ok) return;

    setDeletingId(registro.id);
    try {
      const res = await deleteAttention(registro.id);
      if (!res.success) {
        toast.error(res.error ?? 'No fue posible borrar la atencion.');
        return;
      }
      setHistory((prev) => prev.filter((x) => x.id !== registro.id));
      toast.success(res.message);
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : 'Ocurrio un error al intentar borrar la atencion.'
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Historial Clinico</h3>
          <p className="text-sm text-gray-500">
            Registro de atenciones y procedimientos
          </p>
        </div>
        <Link href="/admin/atenciones">
          <SecondaryButton className="gap-2 px-4 py-2 text-sm font-medium shadow-sm transition-all hover:shadow">
            Ver atenciones
            <ChevronRight className="h-3 w-3" />
          </SecondaryButton>
        </Link>
      </div>

      <div className="space-y-1.5">
        {history.length > 0 ? (
          history.map((registro) => {
            const tipoKey = registro.tipo_atencion.toLowerCase();
            const TipoIcon = TIPO_STYLES[tipoKey]?.Icon ?? Stethoscope;
            const isConsulta = registro.tipo_atencion === 'CONSULTA_MEDICA';
            const isEsterilizacion =
              registro.tipo_atencion === 'OPERATIVO_ESTERILIZACION';
            const isSanitario =
              registro.tipo_atencion === 'OPERATIVO_SANITARIO';
            const isDeleting = deletingId === registro.id;

            return (
              <details
                key={registro.id}
                className="group overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm transition-colors select-none hover:border-gray-200"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${TIPO_STYLES[tipoKey]?.bg ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''}`}
                    >
                      <TipoIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-gray-700">
                        {TIPO_STYLES[tipoKey]?.label ?? registro.tipo_atencion}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs">
                        <span className="font-medium text-gray-500 tabular-nums">
                          {formatShortDate(registro.fecha_atencion)}
                        </span>
                        <span
                          className={`rounded-full px-2.5 py-1 font-medium ${TIPO_STYLES[tipoKey]?.bg ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''}`}
                        >
                          {TIPO_STYLES[tipoKey]?.label ??
                            registro.tipo_atencion}
                        </span>
                        <span className="text-gray-400">·</span>
                        <span className="font-medium text-gray-600">
                          {registro.veterinario}
                        </span>
                        {registro.peso_actual != null && (
                          <>
                            <span className="text-gray-400">·</span>
                            <span className="font-medium text-slate-600 tabular-nums">
                              {Number(registro.peso_actual).toFixed(2)} kg
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                </summary>

                <div
                  className={`border-t border-gray-100/80 bg-gray-50 p-4 text-sm transition-opacity ${
                    isDeleting ? 'pointer-events-none opacity-60' : ''
                  }`}
                >
                  {/* Consultas Medicas */}
                  {isConsulta && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Motivo consulta
                        </p>
                        <p className="mt-0.5 font-medium text-gray-900">
                          {registro.motivo || 'Sin motivo registrado'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Diagnostico presuntivo
                        </p>
                        <p className="mt-0.5 font-medium text-gray-900">
                          {registro.pre_dx || 'Sin diagnostico registrado'}
                        </p>
                      </div>

                      <div className="sm:col-span-2">
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Anamnesis
                        </p>
                        <p className="mt-0.5 whitespace-pre-line text-gray-700">
                          {registro.anamnesis || 'Sin antecedentes registrados'}
                        </p>
                      </div>

                      {registro.examen_fisico && (
                        <div className="sm:col-span-2">
                          <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                            Examen fisico
                          </p>
                          <p className="mt-0.5 whitespace-pre-line text-gray-700">
                            {registro.examen_fisico}
                          </p>
                        </div>
                      )}

                      {registro.examenes_solicitados && (
                        <div className="sm:col-span-2">
                          <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                            Examenes solicitados
                          </p>
                          <p className="mt-0.5 whitespace-pre-line text-gray-700">
                            {registro.examenes_solicitados}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Tratamiento indicado
                        </p>
                        <p className="mt-0.5 whitespace-pre-line text-gray-700">
                          {registro.tratamiento || 'Sin tratamiento registrado'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        {registro.derivacion_clinica_privada && (
                          <div className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                            <FileText className="h-4 w-4" />
                            <p className="text-xs font-semibold">
                              Derivado a especialista
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Operativos Esterilizacion */}
                  {isEsterilizacion && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Procedimientos Aplicados
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {registro.resultado_esterilizacion ? (
                            <span
                              key="resultado"
                              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ${TIPO_STYLES[tipoKey]?.ring ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''} ${TIPO_STYLES[tipoKey]?.bg ?? ''}`}
                            >
                              <span
                                className={`-ml-1.5 rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[10px] tracking-tight ring-1 ${TIPO_STYLES[tipoKey]?.ring ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''}`}
                              >
                                ESTERILIZACION
                              </span>
                              {capitalize(registro.resultado_esterilizacion)}
                            </span>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Sin resultado registrado
                            </p>
                          )}
                          {registro.procedimientos_aplicados &&
                          registro.procedimientos_aplicados.length > 0 ? (
                            registro.procedimientos_aplicados.map(
                              (p: ProcedimientoItem) => (
                                <span
                                  key={p.codigo}
                                  className={`inline-flex items-center gap-1.5 rounded-xl ring-1 ${TIPO_STYLES[tipoKey]?.ring ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''} ${TIPO_STYLES[tipoKey]?.bg ?? ''} px-3 py-1.5 text-xs font-semibold shadow-sm`}
                                >
                                  <span
                                    className={`-ml-1.5 rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[10px] tracking-tight ring-1 ${TIPO_STYLES[tipoKey]?.ring ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''}`}
                                  >
                                    {p.codigo}
                                  </span>
                                  {p.nombre}
                                </span>
                              )
                            )
                          ) : (
                            <p className="text-sm text-gray-500">
                              Sin procedimientos registrados en este operativo
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Tratamiento post-operatorio
                        </p>
                        <p className="mt-0.5 whitespace-pre-line text-gray-700">
                          {registro.tratamiento ||
                            'Sin indicaciones registradas'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Operativos Sanitarios */}
                  {isSanitario && (
                    <div className="space-y-3">
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Procedimientos aplicados
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {registro.procedimientos_aplicados &&
                          registro.procedimientos_aplicados.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {registro.procedimientos_aplicados.map(
                                (p: ProcedimientoItem) => (
                                  <span
                                    key={p.codigo}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm ring-1 ${TIPO_STYLES[tipoKey]?.ring ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''} ${TIPO_STYLES[tipoKey]?.bg ?? ''}`}
                                  >
                                    <span
                                      className={`-ml-1.5 rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[10px] tracking-tight ring-1 ${TIPO_STYLES[tipoKey]?.ring ?? ''} ${TIPO_STYLES[tipoKey]?.text ?? ''}`}
                                    >
                                      {p.codigo}
                                    </span>
                                    {p.nombre}
                                  </span>
                                )
                              )}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500">
                              Sin procedimientos registrados en este operativo
                            </p>
                          )}
                        </div>
                      </div>

                      {registro.tratamiento && (
                        <div>
                          <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                            Observaciones / indicaciones
                          </p>
                          <p className="mt-0.5 whitespace-pre-line text-gray-700">
                            {registro.tratamiento}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Fallback atencion de tipo desconocido */}
                  {!isConsulta && !isEsterilizacion && !isSanitario && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Detalle
                        </p>
                        <p className="mt-0.5 text-gray-700">
                          Tipo de atencion {registro.tipo_atencion} - sin campos
                          especificos renderizados.
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                          Notas
                        </p>
                        <p className="mt-0.5 whitespace-pre-line text-gray-700">
                          {registro.tratamiento || 'Sin informacion adicional'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* ===== FOOTER ACCIONES: VER PDF + ELIMINAR ===== */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200/80 pt-4">
                    <span className="text-xs text-gray-500">
                      Acciones: abrir ficha PDF o eliminar definitivamente el
                      registro.
                    </span>
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link href={`/admin/pdf-test/${registro.id}`}>
                        <SecondaryButton className="gap-2 px-3 py-2 text-xs shadow-sm">
                          <FileText className="h-3.5 w-3.5" />
                          Ver PDF
                        </SecondaryButton>
                      </Link>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDeleteAttention(registro)}
                        className={[
                          'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150',
                          isDeleting
                            ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                            : 'cursor-pointer border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 hover:text-rose-800 active:bg-rose-200',
                        ].join(' ')}
                      >
                        {isDeleting ? (
                          <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="size-3.5" />
                        )}
                        {isDeleting ? 'Eliminando...' : 'Eliminar atencion'}
                      </button>
                    </div>
                  </div>
                </div>
              </details>
            );
          })
        ) : (
          <div className="py-6 text-center text-sm text-gray-500">
            Sin registros clinicos todavia
          </div>
        )}
      </div>
    </div>
  );
}
