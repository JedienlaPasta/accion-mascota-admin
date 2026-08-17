'use client';

import { createPet } from '@/app/_lib/actions/mascotas';
import { formatRUT } from '@/app/_lib/utils/format';
import { Button, SecondaryButton } from '@/app/ui/components/Button';
import MascotaSelect from '@/app/ui/components/Dropdown';
import Input, { SafeNumberInput } from '@/app/ui/components/Input';
import { BaseMutedLink } from '@/app/ui/components/Link';
import {
  ArrowLeft,
  Camera,
  Check,
  FileText,
  Panda,
  UploadCloud,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function NewPetAdminPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const router = useRouter();

  const [petData, setPetData] = useState({
    rut: '',
    nombre: '',
    especie: '',
    raza: '',
    fechaNacimiento: '',
    sexo: '',
    color: '',
    peso: '',
    chip: '',
    esterilizado: '',
  });

  // Microchip: solo 15 digitos maximo (sin letras, sin espacios)
  const formatChip = (raw: string): string =>
    raw.replace(/\D/g, '').slice(0, 15);

  // Peso: normalizar input coma chilena o punto decimal a Number
  const pesoClean = (raw: number | string): number => {
    const num = Number(String(raw || '').replace(',', '.'));
    return Number.isFinite(num) ? num : NaN;
  };

  // Formatear valores mientras el usuario escribe (on blur + on change)
  const handleChange = (field: string, value: string) => {
    let formatted = value;
    if (field === 'rut') formatted = formatRUT(value);
    if (field === 'chip') formatted = formatChip(value);
    setPetData((prev) => ({ ...prev, [field]: formatted }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (petData.chip && petData.chip.length !== 15) {
      setSubmitError(
        'El microchip debe tener EXACTAMENTE 15 dígitos. Deja el campo vacío si la mascota no tiene chip.'
      );
      return;
    }

    if (
      !petData.nombre ||
      !petData.especie ||
      !petData.raza ||
      !petData.sexo ||
      !petData.color ||
      !petData.peso ||
      !petData.esterilizado
    ) {
      setSubmitError('Faltan datos obligatorios para registrar la mascota');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Guardando mascota...');

    try {
      const response = await createPet(petData);

      if (!response.success) {
        toast.error('No se pudo registrar la mascota', {
          id: toastId,
          description: response.error || 'Error al registrar la mascota',
          duration: 5500,
        });
        setSubmitError(response.error || 'No se pudo registrar la mascota');
        return;
      }

      setTimeout(() => {
        toast.success('Mascota registrada con exito', {
          id: toastId,
          description: response.message,
          duration: 2800,
        });
      }, 500);

      setTimeout(() => {
        router.push('/admin/mascotas');
      }, 2800);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al registrar la mascota';
      toast.error('No se pudo registrar la mascota', {
        id: toastId,
        description: message,
        duration: 5500,
      });
      setSubmitError(message);
      setIsSubmitting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showError = Boolean(submitError);

  return (
    <div className="min-h-full bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Link
              href="/admin/mascotas"
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
          <h1 className="text-foreground text-3xl font-bold">Nueva Mascota</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Ingresa los datos para registrar a una nueva mascota.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BaseMutedLink href="/admin/mascotas">
            <X className="h-4 w-4" />
            Cancelar
          </BaseMutedLink>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-10 gap-2 bg-emerald-600 hover:bg-emerald-700"
          >
            <Check className="h-4 w-4" />
            Guardar
          </Button>
        </div>
      </div>

      {showError && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100"
        >
          <span className="font-semibold">
            No se pudo registrar la mascota:
          </span>
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Izquierda - Formulario */}
        <div className="space-y-6 lg:col-span-2">
          {/* Informacion Basica */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-gray-900">
              Información Básica
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Nombre */}
              <div>
                <Input
                  label="Nombre"
                  nombre="nombre"
                  placeHolder="Ej: Copito"
                  value={petData.nombre}
                  setData={(val) => handleChange('nombre', val)}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.nombre.length === 0
                      ? 'Nombre o apodo de la mascota.'
                      : petData.nombre.length < 3
                        ? 'Mínimo 3 caracteres.'
                        : petData.nombre.length > 30
                          ? 'Máximo 30 caracteres.'
                          : 'Nombre completado.'}
                  </span>
                  {petData.nombre.length >= 3 &&
                    petData.nombre.length <= 30 && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <Check className="size-3" /> Listo
                      </span>
                    )}
                </div>
              </div>

              {/* Especie */}
              <div>
                <MascotaSelect
                  label="Especie"
                  readOnly={true}
                  value={petData.especie}
                  onChange={(val) => handleChange('especie', val)}
                  options={[
                    { value: 'perro', label: 'Perro' },
                    { value: 'gato', label: 'Gato' },
                    { value: 'otro', label: 'Otro' },
                  ]}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.especie
                      ? 'Especie seleccionada.'
                      : 'Selecciona Perro / Gato / Otro.'}
                  </span>
                  {petData.especie && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Listo
                    </span>
                  )}
                </div>
              </div>

              {/* Raza */}
              <div>
                <Input
                  label="Raza"
                  nombre="raza"
                  placeHolder="Ej: Mestizo"
                  value={petData.raza}
                  setData={(val) => handleChange('raza', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.raza.length === 0
                      ? 'Si no sabes puedes dejarlo vacío.'
                      : petData.raza.length < 3
                        ? 'Mínimo 3 caracteres.'
                        : petData.raza.length > 30
                          ? 'Máximo 30 caracteres.'
                          : 'Raza ingresada.'}
                  </span>
                  {petData.raza.length >= 3 && petData.raza.length <= 30 && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Listo
                    </span>
                  )}
                </div>
              </div>

              {/* Fecha Nacimiento */}
              <div>
                <Input
                  label="Fecha de Nacimiento"
                  nombre="fechaNacimiento"
                  type="date"
                  value={petData.fechaNacimiento}
                  setData={(val) => handleChange('fechaNacimiento', val)}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.fechaNacimiento
                      ? `${petData.fechaNacimiento} — fecha elegida.`
                      : 'Usa fecha estimada si no la sabes.'}
                  </span>
                  {petData.fechaNacimiento && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Listo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalles Fisicos */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-lg font-bold text-gray-900">
              Detalles Físicos y Salud
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Sexo */}
              <div>
                <MascotaSelect
                  label="Sexo"
                  readOnly={true}
                  value={petData.sexo}
                  onChange={(val) => handleChange('sexo', val)}
                  options={[
                    { value: 'macho', label: 'Macho' },
                    { value: 'hembra', label: 'Hembra' },
                  ]}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.sexo
                      ? 'Sexo biológico seleccionado.'
                      : 'Selecciona Macho / Hembra.'}
                  </span>
                  {petData.sexo && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Listo
                    </span>
                  )}
                </div>
              </div>

              {/* Color */}
              <div>
                <Input
                  label="Color / Pelaje"
                  nombre="color"
                  placeHolder="Ej: Negro con manchas blancas"
                  value={petData.color}
                  setData={(val) => handleChange('color', val)}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.color.length === 0
                      ? 'Describe el color y patrón.'
                      : petData.color.length < 5
                        ? 'Describe un poco más.'
                        : 'Descripción de pelaje completada.'}
                  </span>
                  {petData.color.length >= 5 && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Listo
                    </span>
                  )}
                </div>
              </div>

              {/* Peso */}
              <div>
                <SafeNumberInput
                  label="Peso (kg)"
                  nombre="peso"
                  placeHolder="Ej: 12,5"
                  value={petData.peso}
                  setData={(val) => handleChange('peso', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {!petData.peso
                      ? 'Usa coma o punto para decimales.'
                      : pesoClean(petData.peso) > 99.99 ||
                          isNaN(pesoClean(petData.peso))
                        ? 'Rango válido: 0.1 → 99.99 kg.'
                        : `${pesoClean(petData.peso).toFixed(2)} kg ingresados.`}
                  </span>
                  {petData.peso &&
                    !isNaN(pesoClean(petData.peso)) &&
                    pesoClean(petData.peso) > 0 &&
                    pesoClean(petData.peso) <= 99.99 && (
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                        <Check className="size-3" /> Listo
                      </span>
                    )}
                </div>
              </div>

              {/* Esterilizado */}
              <div>
                <MascotaSelect
                  label="Esterilizado"
                  value={petData.esterilizado}
                  onChange={(val) => handleChange('esterilizado', val)}
                  options={[
                    { value: 'true', label: 'Sí, está castrado/a' },
                    { value: 'false', label: 'No, aún no' },
                  ]}
                  required
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.esterilizado
                      ? 'Estatus de castración elegido.'
                      : 'Marca la opción correcta.'}
                  </span>
                  {petData.esterilizado && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Listo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Identificacion */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Identificación
                </h2>
                <p className="mt-1 text-xs text-gray-500">
                  Registros oficiales de la mascota y su vínculo con el
                  propietario.
                </p>
              </div>
              <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-gray-500 ring-1 ring-gray-200">
                Campos opcionales
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* N° Microchip (opcional: mascotas sin chip) */}
              <div>
                <Input
                  label="N° Microchip"
                  nombre="chip"
                  placeHolder="15 dígitos del chip"
                  maxLength={15}
                  value={petData.chip}
                  setData={(val) => handleChange('chip', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.chip.length === 0
                      ? 'Sin microchip — puedes dejarlo vacío.'
                      : petData.chip.length < 15
                        ? `${petData.chip.length}/15 dígitos`
                        : 'Formato microchip válido.'}
                  </span>
                  {petData.chip.length === 15 && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Listo
                    </span>
                  )}
                </div>
              </div>

              {/* RUT Propietario (opcional: mascotas rescatadas) */}
              <div>
                <Input
                  label="RUT Propietario"
                  nombre="rut"
                  placeHolder="Ej: 12.345.678-9"
                  maxLength={12}
                  value={petData.rut}
                  setData={(val) => handleChange('rut', val)}
                />
                <div className="mt-1.5 flex items-center justify-between px-1 text-[11px]">
                  <span className="text-gray-500">
                    {petData.rut
                      ? 'Se aplicará formato automático al escribir.'
                      : '¿Mascota rescatada? — puedes dejarlo vacío.'}
                  </span>
                  {petData.rut && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                      <Check className="size-3" /> Asociado
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Derecha - Documentos */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">Documentos</h2>
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 py-8 transition-colors hover:bg-gray-100">
              <div className="mb-3 rounded-full bg-emerald-50 p-3">
                <UploadCloud className="h-6 w-6 text-emerald-600" />
              </div>
              <p className="text-center text-sm font-medium text-gray-700">
                <span className="cursor-pointer text-emerald-600 hover:underline">
                  Haz clic para subir
                </span>{' '}
                o arrastra
              </p>
              <p className="mt-1 text-center text-xs text-gray-500">
                PDF, PNG, JPG (max. 5MB)
              </p>
            </div>

            {/* Ejemplo de documento */}
            <div className="mt-4 rounded-lg border border-gray-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-gray-900">
                    Certificado_vacunas.pdf
                  </p>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-gray-100">
                    <div className="h-1.5 w-full rounded-full bg-emerald-500"></div>
                  </div>
                </div>
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <Check className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>

          {/* Foto de Perfil de Mascota */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-bold text-gray-900">
              Foto de Perfil
            </h2>
            <p className="text-muted-foreground mb-4 text-xs">
              Sube una foto clara de tu mascota (max. 2MB).
            </p>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gray-100 shadow-sm ring-4 ring-white">
                <Panda className="h-10 w-10 text-gray-400" />
              </div>
              <SecondaryButton className="gap-2 border-gray-200 bg-white px-3 text-xs hover:bg-gray-50">
                <Camera className="h-4 w-4" />
                Subir foto
              </SecondaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
