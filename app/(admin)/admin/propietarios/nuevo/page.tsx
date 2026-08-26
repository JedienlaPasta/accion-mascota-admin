'use client';

import { createOwner } from '@/app/_lib/actions/propietarios';
import { validateRutDv } from '@/app/_lib/utils/check-values';
import { capitalizeAll, formatPhone, formatRUT } from '@/app/_lib/utils/format';
import { getInitials } from '@/app/_lib/utils/get-values';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import Input, { SafeNumberInput, TextArea } from '@/app/ui/components/Input';
import {
  ArrowLeft,
  AtSign,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  FileText,
  Hash,
  Home,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  UserPlus2,
  UserRound,
  X,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Extrae las iniciales del nombre (2 letras máx) para avatar placeholder. */

export default function NewOwnerAdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();

  const [ownerData, setOwnerData] = useState({
    rut: '',
    nombre: '',
    correoPersonal: '',
    correoContacto: '',
    fechaNacimiento: '',
    direccion: '',
    comuna: '',
    region: '',
    telefono: '',
    rsh: '',
    profesionOficio: '',
  });

  // Formateador en vivo
  const handleChange = (field: string, value: string) => {
    let formatted = value;
    if (field === 'rut') formatted = formatRUT(value);
    setOwnerData((prev) => ({ ...prev, [field]: formatted }));
  };

  //   const handlePhoneBlur = () => {
  //     setOwnerData((prev) => ({ ...prev, telefono: formatPhone(prev.telefono) }));
  //   };

  const rshClean = (raw: number | string): number | null => {
    const trimmed = String(raw || '').trim();
    if (!trimmed) return null;
    const num = Number(trimmed.replace(',', '.'));
    return Number.isFinite(num) ? num : (null as unknown as null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setSubmitError('');

    // Prevalidación cliente
    if (!ownerData.rut.trim()) {
      setSubmitError('El RUT es un dato obligatorio');
      return;
    }
    if (!ownerData.nombre.trim()) {
      setSubmitError('El nombre completo es obligatorio');
      return;
    }
    if (
      ownerData.correoPersonal &&
      !EMAIL_REGEX.test(ownerData.correoPersonal.trim())
    ) {
      setSubmitError('El correo personal no tiene un formato válido');
      return;
    }
    if (
      ownerData.correoContacto &&
      !EMAIL_REGEX.test(ownerData.correoContacto.trim())
    ) {
      setSubmitError('El correo de contacto no tiene un formato válido');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Guardando propietario...');

    try {
      const response = await createOwner({
        ...ownerData,
        telefono: ownerData.telefono.trim()
          ? formatPhone(ownerData.telefono)
          : '',
        rsh: rshClean(ownerData.rsh),
      });

      if (!response.success) {
        toast.error('No se pudo registrar el propietario', {
          id: toastId,
          description: response.error,
          duration: 5500,
        });
        setSubmitError(response.error);
        return;
      }

      toast.success('Propietario registrado con éxito', {
        id: toastId,
        description: response.message,
        duration: 2600,
      });

      setTimeout(() => {
        router.push(`/admin/propietarios/${response.publicId}`);
      }, 900);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al registrar el propietario';
      toast.error('No se pudo registrar el propietario', {
        id: toastId,
        description: message,
        duration: 5500,
      });
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = Boolean(submitError);

  // ----- Helpers visuales -----
  const reqHint = (
    len: number,
    min: number,
    max: number,
    labelEmpty: string,
    labelDone: string
  ) =>
    len === 0
      ? labelEmpty
      : len < min
        ? `Mínimo ${min} caracteres.`
        : len > max
          ? `Máximo ${max} caracteres.`
          : labelDone;

  const ok = (cond: boolean) =>
    cond ? (
      <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
        <Check className="size-3" /> Listo
      </span>
    ) : null;

  const progress =
    (Object.values(ownerData).filter((v) => Boolean(String(v).trim())).length /
      Object.keys(ownerData).length) *
    100;

  const camposCompletados = Object.values(ownerData).filter((v) =>
    Boolean(String(v).trim())
  ).length;

  return (
    <div className="min-h-full bg-gray-50/50 p-6 lg:p-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              href="/admin/propietarios"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
          <h1 className="text-foreground flex items-center gap-2 text-3xl font-bold">
            <UserPlus2 className="h-7 w-7 text-emerald-700" />
            Registrar Propietario
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ingresa los datos para registrar a un nuevo propietario en el
            sistema.
          </p>
        </div>
      </div>

      {/* Alerta de Error */}
      {showError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100"
        >
          <span className="font-semibold">
            No se pudo registrar el propietario:
          </span>
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* IZQUIERDA - FORMULARIO */}
        <div className="space-y-6 lg:col-span-2">
          {/* INFORMACIÓN PERSONAL */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-2">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100">
                <FileText className="size-4.5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Información Personal
                </h2>
                <p className="text-xs text-gray-500">
                  Datos de identidad básicos del nuevo propietario.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* RUT */}
              <div>
                <Input
                  label="RUT"
                  nombre="rut"
                  placeHolder="Ej: 12.345.678-9"
                  maxLength={12}
                  value={ownerData.rut}
                  setData={(val) => handleChange('rut', val)}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {ownerData.rut
                      ? 'Se aplicará formato automático al escribir. Revisa el validador →'
                      : 'RUT sin puntos ni guión también funciona (escribir solo números + DV).'}
                  </span>
                  {ok(ownerData.rut.replace(/[^0-9kK]/g, '').length >= 7)}
                </div>
              </div>

              {/* Nombre Completo */}
              <div>
                <Input
                  label="Nombre Completo"
                  nombre="nombre"
                  placeHolder="Ej: María Fernanda Rojas Pérez"
                  value={ownerData.nombre}
                  setData={(val) => handleChange('nombre', val)}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {reqHint(
                      ownerData.nombre.length,
                      3,
                      120,
                      'Nombre y apellidos completos.',
                      'Nombre ingresado.'
                    )}
                  </span>
                  {ok(
                    ownerData.nombre.length >= 3 &&
                      ownerData.nombre.length <= 120
                  )}
                </div>
              </div>

              {/* Fecha de Nacimiento */}
              <div>
                <Input
                  label="Fecha de Nacimiento"
                  nombre="fechaNacimiento"
                  type="date"
                  value={ownerData.fechaNacimiento}
                  setData={(val) => handleChange('fechaNacimiento', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {ownerData.fechaNacimiento
                      ? `${ownerData.fechaNacimiento} — fecha elegida.`
                      : 'Campo opcional, se usa solo si se conoce.'}
                  </span>
                  {ok(Boolean(ownerData.fechaNacimiento))}
                </div>
              </div>

              {/* Telefono */}
              <div>
                <div className="contents">
                  <Input
                    label="Teléfono / Celular"
                    nombre="telefono"
                    placeHolder="Ej: +56 9 1234 5678"
                    maxLength={9}
                    value={ownerData.telefono}
                    setData={(val) => handleChange('telefono', val)}
                  />
                </div>
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {!ownerData.telefono
                      ? 'Ingresar un número de 9 dígitos (sin +56).'
                      : `${ownerData.telefono}`}
                  </span>
                  {ok(ownerData.telefono.replace(/\D/g, '').length >= 9)}
                </div>
              </div>
            </div>
          </section>

          {/* CONTACTO */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
                  <AtSign className="size-4.5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Contacto</h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Correos para notificaciones y seguimiento.
                  </p>
                </div>
              </div>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-500 ring-1 ring-gray-200">
                Campos opcionales
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Input
                  label="Correo Personal"
                  nombre="correoPersonal"
                  type="email"
                  placeHolder="correo.personal@email.cl"
                  value={ownerData.correoPersonal}
                  setData={(val) => handleChange('correoPersonal', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {ownerData.correoPersonal &&
                    !EMAIL_REGEX.test(ownerData.correoPersonal)
                      ? 'Formato email no válido (revisa @ y dominio).'
                      : ownerData.correoPersonal
                        ? 'Correo personal válido.'
                        : 'Principal correo del propietario.'}
                  </span>
                  {ok(
                    Boolean(
                      ownerData.correoPersonal &&
                      EMAIL_REGEX.test(ownerData.correoPersonal)
                    )
                  )}
                </div>
              </div>
              <div>
                <Input
                  label="Correo de Contacto / Tercero"
                  nombre="correoContacto"
                  type="email"
                  placeHolder="otro@email.cl (familiar, encargado)"
                  value={ownerData.correoContacto}
                  setData={(val) => handleChange('correoContacto', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {ownerData.correoContacto &&
                    !EMAIL_REGEX.test(ownerData.correoContacto)
                      ? 'Formato email no válido.'
                      : ownerData.correoContacto
                        ? 'Correo alternativo registrado.'
                        : 'Si vive solo, puedes dejarlo vacío.'}
                  </span>
                  {ok(
                    Boolean(
                      ownerData.correoContacto &&
                      EMAIL_REGEX.test(ownerData.correoContacto)
                    )
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* DOMICILIO */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-2">
              <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <Home className="size-4.5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">Domicilio</h2>
                <p className="mt-1 text-xs text-gray-500">
                  Ubicación de pertenencia geográfica.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
              <div className="md:col-span-6">
                <Input
                  label="Dirección Completa"
                  nombre="direccion"
                  placeHolder="Ej: Av. Peñablanca 404, Depto 404, Piso 4"
                  maxLength={100}
                  value={ownerData.direccion}
                  setData={(val) => handleChange('direccion', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {reqHint(
                      ownerData.direccion.length,
                      5,
                      100,
                      'Calle + número + block/depto si corresponde.',
                      'Dirección registrada.'
                    )}
                  </span>
                  {ok(
                    ownerData.direccion.length >= 5 &&
                      ownerData.direccion.length <= 100
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <Input
                  label="Comuna"
                  nombre="comuna"
                  placeHolder="Ej: Algarrobo"
                  value={ownerData.comuna}
                  setData={(val) => handleChange('comuna', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {ownerData.comuna.length === 0
                      ? 'Comuna de residencia.'
                      : `${ownerData.comuna.length}/80 caracteres.`}
                  </span>
                  {ok(
                    ownerData.comuna.length >= 2 &&
                      ownerData.comuna.length <= 80
                  )}
                </div>
              </div>

              <div className="md:col-span-3">
                <Input
                  label="Región"
                  nombre="region"
                  placeHolder="Ej: Valparaíso"
                  value={ownerData.region}
                  setData={(val) => handleChange('region', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {ownerData.region.length === 0
                      ? 'Región a la que pertenece la comuna.'
                      : `${ownerData.region.length}/80 caracteres.`}
                  </span>
                  {ok(
                    ownerData.region.length >= 3 &&
                      ownerData.region.length <= 80
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* SOCIOECONOMICO */}
          <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex size-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                  <Building2 className="size-4.5" />
                </span>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Socioeconómico y Laboral
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    Datos complementarios.
                  </p>
                </div>
              </div>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-500 ring-1 ring-gray-200">
                Opcional
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* RSH */}
              <div>
                <SafeNumberInput
                  label="N° RSH"
                  nombre="rsh"
                  placeHolder="Ej: 1842217 (solo números)"
                  value={ownerData.rsh}
                  setData={(val) => handleChange('rsh', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="flex items-center gap-1 text-gray-500">
                    <Hash className="size-3 text-gray-400" />
                    {!ownerData.rsh
                      ? 'Número del Registro Social de Hogares (si se conoce).'
                      : rshClean(ownerData.rsh) !== null &&
                          Number.isFinite(Number(rshClean(ownerData.rsh)))
                        ? `RSH ingresado: ${rshClean(ownerData.rsh)}.`
                        : 'Sólo números enteros positivos.'}
                  </span>
                  {ok(
                    rshClean(ownerData.rsh) !== null &&
                      Number.isInteger(Number(rshClean(ownerData.rsh))) &&
                      Number(rshClean(ownerData.rsh) ?? -1) >= 0
                  )}
                </div>
              </div>

              {/* Profesion / Oficio */}
              <div>
                <Input
                  label="Profesión u Oficio"
                  nombre="profesionOficio"
                  placeHolder="Ej: Docente, Jubilado, Empleada Doméstica"
                  maxLength={80}
                  value={ownerData.profesionOficio}
                  setData={(val) => handleChange('profesionOficio', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {reqHint(
                      ownerData.profesionOficio.length,
                      2,
                      80,
                      'Actividad principal actual o última registrada.',
                      'Profesión / oficio registrado.'
                    )}
                  </span>
                  {ok(
                    ownerData.profesionOficio.length >= 2 &&
                      ownerData.profesionOficio.length <= 80
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* DERECHA - PANEL DE AYUDA Y PREVISUALIZACIÓN */}
        <div className="space-y-6">
          {/* Tarjeta de previsualizacion */}
          <aside className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            {/* Header + gradiente */}
            <div className="relative h-24 bg-linear-to-br from-emerald-500 via-emerald-600 to-teal-700">
              <div className="absolute -bottom-9 left-6">
                <div className="flex size-18 items-center justify-center rounded-2xl bg-white shadow-lg ring-4 shadow-emerald-900/10 ring-white">
                  {ownerData.nombre.trim() ? (
                    <span className="text-2xl font-black text-emerald-700 select-none">
                      {getInitials(ownerData.nombre)}
                    </span>
                  ) : (
                    <UserRound className="size-9 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 pt-12 pb-6">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-gray-900">
                    {ownerData.nombre.trim() ? (
                      capitalizeAll(ownerData.nombre)
                    ) : (
                      <span className="text-gray-400">
                        Nombre del propietario
                      </span>
                    )}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5">
                    {ownerData.rut.trim() ? (
                      <>
                        <BadgeCheck className="size-3.5 text-slate-500" />
                        <span className="text-xs font-semibold text-slate-700">
                          {formatRUT(ownerData.rut)}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-gray-400">
                        RUT pendiente
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Lista de datos (solo aparecen los que tienen valor) */}
              <ul className="mt-5 space-y-2.5 text-xs">
                {ownerData.telefono.trim() && (
                  <li className="flex items-center gap-2 text-gray-600">
                    <Phone className="size-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">
                      {formatPhone(ownerData.telefono)}
                    </span>
                  </li>
                )}
                {(ownerData.correoPersonal || ownerData.correoContacto) && (
                  <li className="flex items-start gap-2 text-gray-600">
                    <AtSign className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">
                      {ownerData.correoPersonal?.trim() ||
                        ownerData.correoContacto?.trim()}
                    </span>
                  </li>
                )}
                {ownerData.fechaNacimiento.trim() && (
                  <li className="flex items-center gap-2 text-gray-600">
                    <CalendarDays className="size-3.5 shrink-0 text-gray-400" />
                    <span>{ownerData.fechaNacimiento}</span>
                  </li>
                )}
                {(ownerData.direccion ||
                  ownerData.comuna ||
                  ownerData.region) && (
                  <li className="flex items-start gap-2 text-gray-600">
                    <MapPin className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                    <span className="line-clamp-2">
                      {[
                        ownerData.direccion.trim(),
                        ownerData.comuna.trim(),
                        ownerData.region.trim(),
                      ]
                        .filter(Boolean)
                        .map(capitalizeAll)
                        .join(' · ') || (
                        <span className="text-gray-400">Sin domicilio</span>
                      )}
                    </span>
                  </li>
                )}
                {ownerData.profesionOficio.trim() && (
                  <li className="flex items-start gap-2 text-gray-600">
                    <Building2 className="mt-0.5 size-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">
                      {capitalizeAll(ownerData.profesionOficio)}
                    </span>
                  </li>
                )}
                {!ownerData.telefono.trim() &&
                  !ownerData.correoPersonal?.trim() &&
                  !ownerData.correoContacto?.trim() &&
                  !ownerData.fechaNacimiento.trim() &&
                  !ownerData.direccion.trim() &&
                  !ownerData.comuna.trim() &&
                  !ownerData.region.trim() &&
                  !ownerData.profesionOficio.trim() && (
                    <li className="rounded-xl bg-slate-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500 ring-1 ring-slate-100">
                      Completa los campos opcionales — aquí se verá una vista
                      previa de cómo quedará la ficha.
                      <br />
                      <span className="text-[10px]">
                        Solo se muestran los campos que hayas completado.
                      </span>
                    </li>
                  )}
              </ul>
            </div>
          </aside>

          {/* Widget 2: VALIDADOR DE DÍGITO VERIFICADOR (RUT en vivo) */}
          <aside className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-900">
              <ShieldCheck className="size-4 text-slate-600" />
              Validador RUT
            </h2>
            {(() => {
              const { valid, expectedDv, actualDv } = validateRutDv(
                ownerData.rut
              );
              const statusColor =
                valid === true
                  ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
                  : valid === false
                    ? 'bg-rose-50 text-rose-700 ring-rose-100'
                    : 'bg-slate-50 text-slate-500 ring-slate-100';
              const iconLeft =
                valid === true ? (
                  <ShieldCheck className="size-4 text-emerald-600" />
                ) : valid === false ? (
                  <ShieldAlert className="size-4 text-rose-600" />
                ) : (
                  <XCircle className="size-4 text-slate-400" />
                );
              return (
                <div className={`rounded-xl p-3 text-xs ring-1 ${statusColor}`}>
                  <div className="flex items-center gap-2">
                    {iconLeft}
                    <span className="leading-tight font-semibold">
                      {valid === true
                        ? 'Dígito verificador OK'
                        : valid === false
                          ? 'Dígito verificador inválido'
                          : 'Aún no hay RUT para validar'}
                    </span>
                  </div>
                  {valid === false && (
                    <p className="mt-1.5 pl-6 text-[11px] leading-relaxed">
                      El cuerpo del RUT corresponde al dígito{' '}
                      <span className="font-bold">
                        {expectedDv === 'K' ? 'K' : expectedDv}
                      </span>{' '}
                      y tú escribiste{' '}
                      <span className="font-bold">
                        {actualDv === 'K' ? 'K' : actualDv || '(vacío)'}
                      </span>
                      .<br />
                      Revisa si te equivocaste del último número/K.
                    </p>
                  )}
                  {valid === null && (
                    <p className="mt-1.5 pl-6 text-[11px] leading-relaxed">
                      Escribe un RUT completo (números + último dígito/K) y aquí
                      verás en tiempo real si es matemáticamente válido.
                    </p>
                  )}
                </div>
              );
            })()}
          </aside>

          {/* Widget 3: PROGRESO + ACCIONES STICKY */}
          <aside className="sticky bottom-0 z-10 space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h2 className="mb-3 flex items-center justify-between text-sm font-bold text-gray-900">
                <span className="flex items-center gap-2">
                  <Hash className="size-4 text-slate-600" />
                  Progreso
                </span>
                <span className="text-[11px] font-bold text-emerald-700">
                  {Math.min(100, Math.round(progress))}%
                </span>
              </h2>
              <div className="space-y-2">
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200/80">
                  <div
                    className="h-full rounded-full bg-linear-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">
                    {camposCompletados}
                  </span>{' '}
                  de {Object.keys(ownerData).length} campos completados.
                </p>
                <p className="mt-2 rounded-xl bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-600 ring-1 ring-slate-100">
                  Solo{' '}
                  <span className="font-semibold text-slate-800">
                    RUT y Nombre
                  </span>{' '}
                  son estrictamente obligatorios. Todo lo demás se puede
                  completar después directamente en la ficha.
                </p>
              </div>
            </div>

            {/* Acciones (sticky ya por el padre) */}
            <div className="hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-md lg:block">
              <div className="flex flex-col items-stretch gap-3">
                <SecondaryButton
                  className="justify-center border-gray-200 hover:bg-gray-50"
                  onClick={() => router.back()}
                >
                  <X className="h-4 w-4" />
                  Descartar
                </SecondaryButton>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="h-10 gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <Check className="h-4 w-4" />
                  {isSubmitting ? 'Guardando…' : 'Guardar Propietario'}
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
