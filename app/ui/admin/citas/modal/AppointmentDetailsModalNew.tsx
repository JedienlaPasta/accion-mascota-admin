'use client';
import { Appointment } from '@/app/_lib/data-types/citas';
import { TIPO_STYLES } from '@/app/_lib/static-data/tipos-atencion';
import { formatDateWithTime, formatRUT } from '@/app/_lib/utils/format';
import { getAge } from '@/app/_lib/utils/get-values';
import {
  ArrowUpRight,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  Microchip,
  PawPrint,
  Stethoscope,
  User2,
  XIcon,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type WrapperProps = {
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
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
function AppointmentDetailsModalNew({
  children,
  onClose,
  className,
}: WrapperProps) {
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
      params.delete('appointmentId');
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
        className={`absolute top-1/2 left-1/2 max-h-[90vh] w-[94%] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl ${className}`}
      >
        {/* Contenido (Loading / Success / 404) */}
        <div className="max-h-[90vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// Skeleton
AppointmentDetailsModalNew.LoadingContent = LoadingContent;
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
    params.delete('appointmentId');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return (
    <div className="">
      {/* Shimmer Head con botones copiar ID y cerrar */}
      <header className="border-b border-gray-100 p-6 pb-4 sm:p-8 sm:pb-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-slate-100" />
          <div className="flex shrink-0 items-center gap-1">
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
        <div className="mb-3 h-7 w-1/3 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-5 w-3/7 animate-pulse rounded-md bg-slate-100" />
      </header>

      {/* Shimmer 2 tarjetas mascota + propietario */}
      <div className="space-y-5 p-6 pt-4 sm:p-8 sm:pt-6">
        <section className="grid gap-4 md:grid-cols-2">
          <div className="h-33.5 animate-pulse rounded-2xl border border-slate-100 bg-linear-to-br from-indigo-50 to-violet-50/60" />
          <div className="h-33.5 animate-pulse rounded-2xl border border-slate-100 bg-slate-50" />
        </section>

        {/* Shimmer contenido condicional */}
        <div className="h-25 animate-pulse rounded-2xl bg-slate-50 ring-1 ring-slate-100" />
      </div>

      {/* Shimmer footer */}
      <div className="flex flex-col items-stretch justify-between gap-3 border-t border-gray-100 bg-gray-50/60 p-5 sm:flex-row sm:items-center sm:px-8">
        <div className="h-4 w-50 animate-pulse rounded bg-slate-100" />
        <div className="flex gap-2">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-slate-100" />
          <div className="h-10 w-20 animate-pulse rounded-xl bg-slate-900/60" />
        </div>
      </div>
    </div>
  );
}

// ContentRenderer (404 o Success)
AppointmentDetailsModalNew.ContentRenderer = ContentRenderer;
export function ContentRenderer({
  appointment,
}: {
  appointment: Appointment | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const close = () => {
    const params = new URLSearchParams(searchParams);
    params.delete('appointmentId');
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // 404 inline (getAppointmentDetailById devolvió null)
  if (!appointment) {
    return (
      <div className="p-8 text-center sm:p-12">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 ring-1 ring-rose-100">
          <ClipboardList className="h-8 w-8 text-rose-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">
          Registro no encontrado
        </h3>
        <p className="mt-2 text-sm text-gray-500">
          El ID de cita que solicitaste no existe o fue eliminado.
        </p>
        <button
          type="button"
          onClick={close}
          className="mt-7 inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-6 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Volver al listado
        </button>
      </div>
    );
  }

  // SUCCESS
  const metaTipo = getTipoMeta(appointment.tipo_atencion);

  return (
    <div id="modal-attention-content">
      {/* Header modal */}
      <header className="border-b border-gray-100 p-6 pb-4 sm:p-8 sm:pb-6">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <span className="flex items-center gap-2">
            <p className="text-sm tracking-widest text-gray-400">ID Cita</p>
            <span className="text-gray-300">·</span>
            <p className="truncate font-mono text-sm font-semibold text-gray-800 uppercase">
              {appointment.public_id_cita}
            </p>
            <span className="text-gray-300">·</span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${metaTipo.bg} ${metaTipo.text} ${metaTipo.ring}`}
            >
              <metaTipo.Icon className="h-3.5 w-3.5" />
              {metaTipo.displayName}
            </span>
            aa
          </span>
          <div>
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar detalle atención"
              className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
            >
              <XIcon className="sw-4 h-4" />
            </button>
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 sm:text-3xl">
          Detalle de cita
        </h3>
        <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          {formatDateWithTime(appointment.hora_agendada)}
          <span className="text-gray-300">·</span>
          <User2 className="h-4 w-4 text-gray-400" />
          {appointment.funcionario_id}
          veterinario
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
              <p className="text-lg font-bold text-gray-900">
                {appointment.nombre_mascota}
              </p>
              {appointment.microchip && (
                <li className="flex items-center gap-1.5 text-xs">
                  <Microchip className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-mono tracking-tight text-emerald-800 tabular-nums">
                    {appointment.microchip}
                  </span>
                </li>
              )}
            </span>
            <ul className="mt-1 grid grid-cols-2 gap-1 text-xs text-gray-700">
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Especie:</span>
                {appointment.especie || '—'}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Edad:</span>
                {getAge(appointment.fecha_nacimiento || '')}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Sexo:</span>
                {appointment.sexo || '—'}
              </li>
              {/* <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">Peso:</span>
                {appointment.peso || '—'}
              </li> */}
            </ul>
          </div>

          {/* Bloque Propietario */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-5">
            <p className="text-[10px] font-bold tracking-widest text-gray-500 uppercase">
              Propietario
            </p>
            <p className="text-lg font-bold text-gray-900">
              {appointment.nombre_propietario}
            </p>
            <ul className="mt-1 space-y-1 text-xs text-gray-700">
              <li className="flex items-center gap-1.5">
                <span className="font-medium text-gray-500">RUT:</span>
                <span className="font-mono tabular-nums">
                  {formatRUT(appointment.rut_propietario)}
                </span>
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex flex-col items-stretch justify-between gap-3 border-t border-gray-100 bg-gray-50/60 p-5 sm:flex-row sm:items-center sm:px-8">
        {/* <p className="text-xs text-gray-500">
          Registro creado: {formatDateWithTime(appointment.created_at || '')}
        </p> */}
        <div className="flex flex-wrap items-center justify-end gap-2">
          <Link
            href={`/admin/mascotas/${appointment.mascota_id}`}
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            <PawPrint className="h-4 w-4" />
            Ver mascota
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 cursor-pointer items-center justify-center rounded-xl bg-slate-900 px-5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Cerrar
          </button>
        </div>
      </footer>
    </div>
  );
}

export default AppointmentDetailsModalNew;

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
        className={`mt-1 text-sm font-medium whitespace-pre-wrap text-gray-800 ${monospace ? 'font-mono' : ''}`}
      >
        {children}
      </p>
    </div>
  );
}
