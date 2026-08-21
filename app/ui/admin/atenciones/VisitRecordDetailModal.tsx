'use client';

import type {
  ProcedimientoItem,
  VisitDetails,
} from '@/app/_lib/data/atenciones';
import {
  CalendarDays,
  ClipboardList,
  PawPrint,
  Scissors,
  Stethoscope,
  Syringe,
  User2,
  Weight,
  XIcon,
  ArrowUpRight,
  Microchip,
  Activity,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type VisitRecordDetailModalProps = {
  visit: VisitDetails | null;
  notFound: boolean;
};

// ==========================================================
// 🎨 Mapeo de TIPO_ATENCION → Estilos UI + Icono
// (igual que page.tsx header: mantiene consistencia)
// ==========================================================
const TIPO_STYLES: Record<
  string,
  {
    displayName: string;
    bg: string;
    text: string;
    ring: string;
    Icon: typeof Stethoscope;
  }
> = {
  consulta_medica: {
    displayName: 'Consulta médica',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200/60',
    Icon: Stethoscope,
  },
  operativo_sanitario: {
    displayName: 'Operativo sanitario',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200/60',
    Icon: Syringe,
  },
  operativo_esterilizacion: {
    displayName: 'Cirugía - Esterilización',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200/60',
    Icon: Scissors,
  },
  control: {
    displayName: 'Control / seguimiento',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200/60',
    Icon: ClipboardList,
  },
  emergencia: {
    displayName: 'Emergencia / Urgencia',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    ring: 'ring-orange-200/60',
    Icon: Activity,
  },
};

function getTipoMeta(raw?: string | null) {
  if (!raw) {
    return { ...TIPO_STYLES.consulta_medica, displayName: 'Atención' };
  }
  const key = raw.toLowerCase().trim();
  if (TIPO_STYLES[key]) return TIPO_STYLES[key];
  // Fallback genérico (si agregan tipos nuevos no se rompe)
  return {
    displayName: raw
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    ring: 'ring-slate-200/60',
    Icon: Stethoscope,
  };
}

// ==========================================================
// 🧮 Helpers: cálculos derivados
// ==========================================================
function calcularEdad(fechaNacStr?: string | null): string {
  if (!fechaNacStr) return 'Edad desconocida';
  const nac = new Date(fechaNacStr + 'T00:00:00');
  if (Number.isNaN(nac.getTime())) return 'Edad desconocida';
  const hoy = new Date();
  let years = hoy.getFullYear() - nac.getFullYear();
  let months = hoy.getMonth() - nac.getMonth();
  if (hoy.getDate() < nac.getDate()) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years <= 0 && months <= 0) return 'Recién nacida';
  if (years <= 0) return `${months} mes${months === 1 ? '' : 'es'}`;
  if (months === 0) return `${years} año${years === 1 ? '' : 's'}`;
  return `${years}a ${months}m`;
}

function formatFechaCL(str?: string | null): string {
  if (!str) return '—';
  const d = new Date(str);
  if (Number.isNaN(d.getTime())) return str;
  return d.toLocaleString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export default function VisitRecordDetailModal({
  visit,
  notFound,
}: VisitRecordDetailModalProps) {
  // ==========================================================
  // 🚨 FIX CRÍTICO: antes loading=true PERO NUNCA setLoading(false)
  //    → spinner infinito. Ahora loading 250ms (mejora transición).
  // ==========================================================
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, []);

  // Bloquear scroll del contenedor principal mientras modal esté abierto
  useEffect(() => {
    const mainContainer = document.getElementById('main-scroll');
    if (!mainContainer) return;
    const scrollbarWidth =
      mainContainer.offsetWidth - mainContainer.clientWidth;
    mainContainer.style.overflow = 'hidden';
    if (scrollbarWidth > 0)
      mainContainer.style.paddingRight = `${scrollbarWidth}px`;
    return () => {
      mainContainer.style.overflow = '';
      mainContainer.style.paddingRight = '';
    };
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleModalClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('visitId');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // Meta tipo atención (icono + colores legibles)
  const metaTipo = useMemo(() => getTipoMeta(visit?.tipo_atencion), [visit]);

  if (loading) {
    return (
      <div
        aria-hidden
        className="fixed inset-0 top-0 left-0 z-70 flex h-dvh items-center justify-center bg-gray-800/70"
      >
        <div className="size-12 animate-spin rounded-full border-4 border-white/80 border-t-emerald-600" />
      </div>
    );
  }

  if (notFound || !visit) {
    return (
      <div
        className="fixed inset-0 top-0 left-0 z-70 h-dvh bg-gray-800/70"
        onClick={handleModalClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Registro no encontrado"
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-white p-8 text-center shadow-2xl"
        >
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 ring-1 ring-rose-100">
            <ClipboardList className="h-7 w-7 text-rose-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            Registro no encontrado
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            El ID de atención que solicitaste no existe o fue eliminado.
          </p>
          <button
            onClick={handleModalClose}
            type="button"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Volver al listado
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // ✅ CASO FELIZ: modal completo con datos reales
  // ----------------------------------------------------------
  return (
    <div className="fixed inset-0 z-70" onClick={handleModalClose} aria-hidden>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-gray-800/70 backdrop-blur-sm" />

      {/* Ventana modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-attention-title"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-1/2 left-1/2 max-h-[90vh] w-[94%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* ============ HEADER ============ */}
        <header className="flex items-start justify-between gap-4 border-b border-gray-100 p-6 sm:p-8">
          <div className="min-w-0 flex-1">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${metaTipo.bg} ${metaTipo.text} ${metaTipo.ring}`}
              >
                <metaTipo.Icon className="h-3.5 w-3.5" />
                {metaTipo.displayName}
              </span>
            </div>
            <h3
              id="modal-attention-title"
              className="text-xl font-bold text-gray-900 sm:text-2xl"
            >
              Ficha de atención
            </h3>
            <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
              <CalendarDays className="h-4 w-4 text-gray-400" />
              {formatFechaCL(visit.fecha_atencion)}
              <span className="text-gray-300">·</span>
              <User2 className="h-4 w-4 text-gray-400" />
              {visit.veterinario}
            </p>
          </div>
          <button
            type="button"
            onClick={handleModalClose}
            aria-label="Cerrar detalle atención"
            className="shrink-0 rounded-xl p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <XIcon className="h-5 w-5" />
          </button>
        </header>

        {/* ============ CUERPO SCROLLEABLE ============ */}
        <main className="max-h-[calc(90vh-10rem)] space-y-5 overflow-y-auto p-6 sm:p-8">
          {/* Bloque 1: MASCOTA + PROPIETARIO + PESO */}
          <section className="grid gap-4 md:grid-cols-3">
            {/* 🐾 Card Mascota */}
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-indigo-50/60 to-violet-50/40 p-5">
              <div className="absolute -top-4 -right-4 opacity-5">
                <PawPrint className="h-24 w-24" />
              </div>
              <p className="text-[10px] font-bold tracking-widest text-indigo-500/90 uppercase">
                Mascota
              </p>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {visit.nombre_mascota}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
                <li className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">Especie:</span>
                  {visit.especie || '—'}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">Sexo:</span>
                  {visit.sexo || '—'}
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">Edad:</span>
                  {calcularEdad(visit.fecha_nacimiento)}
                </li>
                {visit.microchip && (
                  <li className="flex items-center gap-1.5">
                    <Microchip className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-mono tracking-tight text-emerald-800 tabular-nums">
                      {visit.microchip}
                    </span>
                  </li>
                )}
              </ul>
            </div>

            {/* 🧑 Card Propietario */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                Propietario
              </p>
              <p className="mt-2 text-lg font-bold text-gray-900">
                {visit.nombre_propietario}
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-gray-700">
                <li className="flex items-center gap-1.5">
                  <span className="font-medium text-gray-500">RUT:</span>
                  <span className="font-mono tabular-nums">
                    {visit.rut_propietario}
                  </span>
                </li>
              </ul>
            </div>

            {/* 📊 Card Peso + Resumen rápido */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5">
              <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
                Medición & Código
              </p>
              <div className="mt-2 flex items-end gap-2">
                <Weight className="h-5 w-5 text-slate-600" />
                <p className="text-2xl font-bold text-gray-900 tabular-nums">
                  {visit.peso_actual == null
                    ? '—'
                    : Number(visit.peso_actual).toFixed(2)}
                </p>
                <p className="pb-1 text-sm font-medium text-gray-500">kg</p>
              </div>
              <p className="mt-4 text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                ID atención
              </p>
              <p className="mt-0.5 truncate font-mono text-xs text-gray-600">
                {visit.id}
              </p>
            </div>
          </section>

          {/* Bloque 2: CONTENIDO CONDICIONAL POR TIPO */}
          <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
            {/* ------------------------------------------------------------
                 CASO A: CONSULTA MÉDICA → 6 campos
               ------------------------------------------------------------ */}
            {visit.tipo_atencion?.toLowerCase() === 'consulta_medica' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldBox label="Motivo de consulta">
                  {visit.motivo_atencion || 'No registrado.'}
                </FieldBox>
                <FieldBox label="Diagnóstico presuntivo (Pre-DX)">
                  {visit.diagnostico_predx || 'No registrado.'}
                </FieldBox>
                <FieldBox label="Anamnesis" fullWidth>
                  {visit.anamnesis || 'No registrado.'}
                </FieldBox>
                <FieldBox label="Examen físico" fullWidth>
                  {visit.examen_fisico || 'No registrado.'}
                </FieldBox>
                <FieldBox label="Exámenes de laboratorio / imágenes" fullWidth>
                  {visit.examenes_solicitados || 'No se solicitaron exámenes.'}
                </FieldBox>
                <FieldBox label="Tratamiento indicado" fullWidth monospace>
                  {visit.tratamiento || 'No se indicó tratamiento.'}
                </FieldBox>
              </div>
            )}

            {/* ------------------------------------------------------------
                 CASO B: OPERATIVO ESTERILIZACION → resultado / obs
               ------------------------------------------------------------ */}
            {visit.tipo_atencion?.toLowerCase() ===
              'operativo_esterilizacion' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FieldBox label="Resultado de la cirugía">
                  {visit.resultado_esterilizacion || 'No registrado.'}
                </FieldBox>
                <FieldBox label="Observaciones post-operatorias" fullWidth>
                  {visit.observaciones_esterilizacion ||
                    'Sin observaciones registradas.'}
                </FieldBox>
                {visit.tratamiento && (
                  <FieldBox
                    label="Tratamiento post-operatorio"
                    fullWidth
                    monospace
                  >
                    {visit.tratamiento}
                  </FieldBox>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------
                 CASO C: OPERATIVO SANITARIO → badges de procedimientos
               ------------------------------------------------------------ */}
            {visit.tipo_atencion?.toLowerCase() === 'operativo_sanitario' && (
              <div className="space-y-3">
                <p className="text-[11px] font-bold tracking-wide text-gray-400 uppercase">
                  Procedimientos aplicados
                </p>
                {visit.procedimientos_aplicados &&
                visit.procedimientos_aplicados.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {visit.procedimientos_aplicados.map(
                      (p: ProcedimientoItem) => (
                        <span
                          key={p.codigo}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 shadow-sm"
                        >
                          <span className="rounded-md bg-white/80 px-1.5 py-0.5 font-mono text-[10px] tracking-tight text-emerald-600 ring-1 ring-emerald-200">
                            {p.codigo}
                          </span>
                          {p.nombre}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    No se encontraron procedimientos asociados.
                  </p>
                )}
              </div>
            )}

            {/* ------------------------------------------------------------
                 FALLBACK / TIPOS FUTUROS: Mostramos lo que tengamos.
                 (así no se rompe cuando agreguen IMPLANTE_MICROCHIP etc)
               ------------------------------------------------------------ */}
            {![
              'consulta_medica',
              'operativo_esterilizacion',
              'operativo_sanitario',
            ].includes(visit.tipo_atencion?.toLowerCase() || '') && (
              <div className="space-y-4 sm:grid sm:grid-cols-2">
                {visit.motivo_atencion && (
                  <FieldBox label="Motivo / Descripción">
                    {visit.motivo_atencion}
                  </FieldBox>
                )}
                {visit.diagnostico_predx && (
                  <FieldBox label="Diagnóstico presuntivo">
                    {visit.diagnostico_predx}
                  </FieldBox>
                )}
                {visit.tratamiento && (
                  <FieldBox label="Tratamiento / notas" fullWidth monospace>
                    {visit.tratamiento}
                  </FieldBox>
                )}
                {!visit.motivo_atencion &&
                  !visit.diagnostico_predx &&
                  !visit.tratamiento && (
                    <div className="rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-500 ring-1 ring-slate-200/60 sm:col-span-2">
                      Tipo{' '}
                      <code className="mx-1 rounded bg-white px-1.5 py-0.5 text-slate-700 ring-1 ring-slate-300/60">
                        {visit.tipo_atencion}
                      </code>{' '}
                      aún no tiene campos específicos renderizados. Se mostrarán
                      los generales.
                    </div>
                  )}
              </div>
            )}
          </section>
        </main>

        {/* ============ FOOTER ============ */}
        <footer className="flex flex-col items-stretch justify-between gap-3 border-t border-gray-100 bg-gray-50/60 p-5 sm:flex-row sm:items-center sm:px-8">
          <p className="text-xs text-gray-500">
            Registro creado: {formatFechaCL(visit.created_at)}
          </p>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {/* Link a ficha completa de la mascota */}
            <Link
              href={`/admin/mascotas/${visit.public_id_mascota}`}
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            >
              <PawPrint className="h-4 w-4" />
              Ver mascota
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            {/* Cerrar */}
            <button
              type="button"
              onClick={handleModalClose}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              Cerrar
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ==========================================================
// 🎁 Mini componente DRY (repetido 10+ veces en el body)
//    = FieldBox (micro-label tracking-wide gris + contenido)
// ==========================================================
function FieldBox({
  label,
  children,
  fullWidth = false,
  monospace = false,
}: {
  label: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  monospace?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-gray-100 bg-gray-50/60 p-4 ${fullWidth ? 'sm:col-span-2' : ''}`}
    >
      <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
        {label}
      </p>
      <p
        className={`mt-1.5 text-sm font-medium whitespace-pre-wrap text-gray-800 ${monospace ? 'font-mono' : ''}`}
      >
        {children}
      </p>
    </div>
  );
}
