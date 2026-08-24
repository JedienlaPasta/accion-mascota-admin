'use client';

import type {
  ProcedimientoItem,
  VisitDetails,
} from '@/app/_lib/data/atenciones';
import {
  CalendarDays,
  ClipboardList,
  PawPrint,
  Stethoscope,
  User2,
  XIcon,
  ArrowUpRight,
  Microchip,
  Check,
  ClipboardCheck,
} from 'lucide-react';
import Link from 'next/link';
import { TIPO_STYLES } from '@/app/_lib/static-data/tipos-atencion';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getAge } from '@/app/_lib/utils/get-values';
import { formatDateWithTime, formatRUT } from '@/app/_lib/utils/format';

type WrapperProps = {
  // Contenido: LoadingContent / ContentRenderer
  children: React.ReactNode;
  // Closehandler opcional para OptimisticModalShell
  onClose?: () => void;
};

function getTipoMeta(raw?: string | null) {
  if (!raw) return { ...TIPO_STYLES.consulta_medica, displayName: 'Atención' };
  const key = raw.toLowerCase().trim();
  if (TIPO_STYLES[key]) return TIPO_STYLES[key];
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

// Wrapper Principal (solo estructura modal + cerrar)
function VisitRecordDetailModal({ children, onClose }: WrapperProps) {
  // Bloquear scroll mientras modal esté abierto
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const close =
    onClose ??
    (() => {
      const params = new URLSearchParams(searchParams);
      params.delete('visitId');
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });

  return (
    <div className="fixed inset-0 z-70 h-dvh" onClick={close} aria-hidden>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-800/75" />

      {/* Ventana modal + header cerrar */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className="absolute top-1/2 left-1/2 max-h-[90vh] w-[94%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        {/* Contenido (Loading / Success / 404) */}
        <div className="max-h-[90vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// Skeleton
VisitRecordDetailModal.LoadingContent = LoadingContent;
export function LoadingContent({
  onClose,
}: {
  onClose?: () => void;
} = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose();
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.delete('visitId');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="space-y-6 p-6 sm:p-8">
      {/* Shimmer Head con botones copiar ID y cerrar */}
      <div className="space-y-3">
        <div className="flex justify-between gap-4">
          <div className="h-6 w-36 animate-pulse rounded-full bg-slate-100" />
          <div className="-mb-2 flex shrink-0 items-center gap-1">
            <button
              type="button"
              title="Copiar ID atención"
              className="pointer-events-none inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-all duration-150"
              tabIndex={-1}
              aria-disabled
            >
              <ClipboardCheck className="h-4 w-4" />
            </button>
            <div aria-hidden className="mx-1 h-5 w-px bg-gray-200" />
            <button
              type="button"
              onClick={handleClose}
              aria-label="Cerrar detalle atención"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            >
              <XIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="h-8 w-3/4 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-5 w-2/3 animate-pulse rounded-md bg-slate-100" />
      </div>

      {/* Shimmer 3 tarjetas mascota + propietario + peso */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-40 animate-pulse rounded-2xl bg-linear-to-br from-indigo-50 to-violet-50/60 ring-1 ring-slate-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-slate-50 ring-1 ring-slate-100" />
        <div className="h-40 animate-pulse rounded-2xl bg-white ring-1 ring-slate-100" />
      </div>

      {/* Shimmer contenido condicional */}
      <div className="h-32 animate-pulse rounded-2xl bg-slate-50 ring-1 ring-slate-100" />

      {/* Shimmer footer */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="h-4 w-48 animate-pulse rounded bg-slate-100" />
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-10 w-24 animate-pulse rounded-xl bg-slate-900/60" />
        </div>
      </div>
    </div>
  );
}

// ContentRenderer (404 o Success)
VisitRecordDetailModal.ContentRenderer = ContentRenderer;
export function ContentRenderer({ visit }: { visit: VisitDetails | null }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!visit) return;
    try {
      await navigator.clipboard.writeText(visit.id);
      setCopied(true);
      const t = setTimeout(() => setCopied(false), 1800);
      return () => clearTimeout(t);
    } catch (e) {
      console.warn('[Copy Header] No se pudo copiar ID:', e);
    }
  };

  const close = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('visitId');
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // 404 inline (getVisitDetailById devolvió null)
  if (!visit) {
    return (
      <div className="p-8 text-center sm:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 ring-1 ring-rose-100">
          <ClipboardList className="h-8 w-8 text-rose-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Registro no encontrado
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          El ID de atención que solicitaste no existe o fue eliminado.
        </p>
        <button
          type="button"
          onClick={close}
          className="mt-7 inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  // SUCCESS (todo el contenido estaba antes en wrapper)
  const metaTipo = getTipoMeta(visit.tipo_atencion);

  return (
    <div id="modal-attention-content">
      {/* Header modal */}
      <header className="border-b border-gray-100 p-6 pb-4 sm:p-8 sm:pb-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <p className="text-sm tracking-widest text-gray-400">ID Atención</p>
            <span className="text-gray-300">·</span>
            <p className="truncate font-mono text-sm font-semibold text-gray-800 uppercase">
              {visit.id}
            </p>
            <span className="text-gray-300">·</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${metaTipo.bg} ${metaTipo.text} ${metaTipo.ring}`}
            >
              <metaTipo.Icon className="h-3.5 w-3.5" />
              {metaTipo.displayName}
            </span>
          </span>
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleCopy}
              title={
                copied ? '¡Copiado al portapapeles!' : 'Copiar ID atención'
              }
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-150 ${
                copied
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-600'
                  : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800'
              }`}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <ClipboardCheck className="h-4 w-4" />
              )}
            </button>
            <div aria-hidden className="mx-1 h-5 w-px bg-gray-200" />
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar detalle atención"
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            >
              <XIcon className="sw-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Ficha de atención
        </h3>
        <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          {formatDateWithTime(visit.fecha_atencion)}
          <span className="text-gray-300">·</span>
          <User2 className="h-4 w-4 text-gray-400" />
          {visit.veterinario}
        </p>
      </header>

      {/* Cuerpo modal */}
      <main className="space-y-5 p-6 pt-4 sm:p-8 sm:pt-6">
        <section className="grid gap-4 md:grid-cols-2">
          {/* Bloque Mascota */}
          <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-br from-indigo-50/60 to-violet-50/40 p-5">
            <div className="absolute -top-4 -right-4 opacity-5">
              <PawPrint className="h-24 w-24" />
            </div>
            <p className="text-[10px] font-bold tracking-widest text-indigo-500/90 uppercase">
              Mascota
            </p>

            <span className="grid grid-cols-2">
              <p className="mt-1 text-lg font-bold text-gray-900">
                {visit.nombre_mascota}
              </p>
              {visit.microchip && (
                <li className="flex items-center gap-1.5 text-xs">
                  <Microchip className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-mono tracking-tight text-emerald-800 tabular-nums">
                    {visit.microchip}
                  </span>
                </li>
              )}
            </span>
            <ul className="mt-2 grid grid-cols-2 gap-1.5 text-xs text-gray-700">
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Especie:</span>
                {visit.especie || '—'}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Edad:</span>
                {getAge(visit.fecha_nacimiento || '')}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Sexo:</span>
                {visit.sexo || '—'}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Peso:</span>
                {visit.peso_actual || '—'}
              </li>
            </ul>
          </div>

          {/* Bloque Propietario */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
            <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Propietario
            </p>
            <p className="mt-1 text-lg font-bold text-gray-900">
              {visit.nombre_propietario}
            </p>
            <ul className="mt-2 space-y-1 text-xs text-gray-700">
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">RUT:</span>
                <span className="font-mono tabular-nums">
                  {formatRUT(visit.rut_propietario)}
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Contenido condicional */}
        <section className="space-y-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6">
          {/* A) Consulta medica */}
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

          {/* B) Esterilizacion */}
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

          {/* C) Operativo sanitario */}
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

          {/* Fallback tipos futuros */}
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
                    aún no tiene campos específicos renderizados.
                  </div>
                )}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-stretch justify-between gap-3 border-t border-gray-100 bg-gray-50/60 p-5 sm:flex-row sm:items-center sm:px-8">
        <p className="text-xs text-gray-500">
          Registro creado: {formatDateWithTime(visit.created_at || '')}
        </p>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link
            href={`/admin/mascotas/${visit.public_id_mascota}`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            <PawPrint className="h-4 w-4" />
            Ver mascota
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </footer>
    </div>
  );
}

// Optimistic modal shell
export function OptimisticModalShell() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [optimisticVisitId, setOptimisticVisitId] = useState<string | null>(
    null
  );
  const urlVisitId = searchParams.get('visitId');

  // 1) Escuchar evento desde VisitsTableRow (click abrir)
  useEffect(() => {
    const handler = (e: Event) => {
      const evt = e as CustomEvent<string>;
      if (evt.detail) setOptimisticVisitId(String(evt.detail));
    };
    window.addEventListener('visit:open', handler as EventListener);
    return () =>
      window.removeEventListener('visit:open', handler as EventListener);
  }, []);

  // 2) Desmontar shell cuando URL coincida (Server modal tomó el relevo)
  useEffect(() => {
    if (optimisticVisitId && urlVisitId === optimisticVisitId) {
      // Pequeño delay 1 frame para evitar flicker entre shell y modal real
      const t = requestAnimationFrame(() => setOptimisticVisitId(null));
      return () => cancelAnimationFrame(t);
    }
  }, [urlVisitId, optimisticVisitId]);

  // 3) Si user cierra botón X / backdrop antes que Next responda
  const handleCloseOptimistic = () => {
    setOptimisticVisitId(null);
    const params = new URLSearchParams(searchParams);
    params.delete('visitId');
    const qs = params.toString();
    // Limpiar URL también localmente
    window.history.replaceState({}, '', qs ? `${pathname}?${qs}` : pathname);
    router.replace(qs ? `?${qs}` : '', { scroll: false });
  };

  // SOLO renderizamos shell si todavía NO coincidió con URL real,si coincidió → Server Component real ya está montado
  if (!optimisticVisitId || optimisticVisitId === urlVisitId) {
    return null;
  }

  return (
    <VisitRecordDetailModal onClose={handleCloseOptimistic}>
      <LoadingContent />
    </VisitRecordDetailModal>
  );
}

export default VisitRecordDetailModal;

//  FieldBox (micro-label tracking-wide gris + contenido)
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
