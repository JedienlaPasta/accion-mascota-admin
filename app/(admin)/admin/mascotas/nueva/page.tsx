'use client';

import { createPet } from '@/app/_lib/actions/mascotas';
import { formatRUT } from '@/app/_lib/utils/format';
import NewPetForm from '@/app/ui/admin/mascotas/nueva/NewPetForm';
import NewPetPreviewData from '@/app/ui/admin/mascotas/nueva/NewPetPreviewData';
import { ArrowLeft, Check, X } from 'lucide-react';
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
      // !petData.raza ||
      !petData.sexo ||
      !petData.color ||
      // !petData.peso ||
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

  const isValid = (cond: boolean, value: string) =>
    value.length >= 3 ? (
      cond ? (
        <span className="inline-flex items-center gap-1 font-semibold text-blue-600">
          <Check className="size-3" /> Listo
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 font-semibold text-red-600">
          <X className="size-3" /> Inválido
        </span>
      )
    ) : null;

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
        <NewPetForm
          petData={petData}
          isValid={isValid}
          handleChange={handleChange}
        />

        {/* Derecha - Preview Data */}
        <NewPetPreviewData
          petData={petData}
          isSubmitting={isSubmitting}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
