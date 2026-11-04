'use client';

import { createOwner } from '@/app/_lib/actions/propietarios';
import { formatPhone, formatRUT } from '@/app/_lib/utils/format';
import NewOwnerForm from '@/app/ui/admin/propietarios/nuevo/NewOwnerForm';
import NewOwnerPreviewData from '@/app/ui/admin/propietarios/nuevo/NewOwnerPreviewData';
import { ArrowLeft, Check } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
    telefonoPersonal: '',
    telefonoContacto: '',
    rsh: '',
  });

  // Formateador en vivo
  const handleChange = (field: string, value: string) => {
    let formatted = value;
    if (field === 'rut') formatted = formatRUT(value);
    setOwnerData((prev) => ({ ...prev, [field]: formatted }));
  };

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
        telefonoPersonal: ownerData.telefonoPersonal.trim()
          ? formatPhone(ownerData.telefonoPersonal)
          : '',
        telefonoContacto: ownerData.telefonoContacto.trim()
          ? formatPhone(ownerData.telefonoContacto)
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
  const requirementsHint = (
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

  const isValid = (cond: boolean) =>
    cond ? (
      <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
        <Check className="size-3" /> Listo
      </span>
    ) : null;

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
          <h1 className="text-foreground text-3xl font-bold">
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
        <NewOwnerForm
          ownerData={ownerData}
          requirementsHint={requirementsHint}
          isValid={isValid}
          handleChange={handleChange}
        />

        {/* DERECHA - PANEL DE AYUDA Y PREVISUALIZACIÓN */}
        <NewOwnerPreviewData
          ownerData={ownerData}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
