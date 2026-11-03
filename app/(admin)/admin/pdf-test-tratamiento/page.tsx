'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ArrowLeft, FileText } from 'lucide-react';
import FichaTratamientoPosteriorPdf, {
  TreatmentSheetData,
} from '@/app/ui/components/pdf/FichaTratamientoPosteriorPdf';

const mockData: TreatmentSheetData = {
  fechaEntrega: '02 noviembre 2026',
  tipoAtencion: 'OPERATIVO_ESTERILIZACION',
  procedimiento: 'Ovariohisterectomía (OVH) y control post operatorio',
  proximoControl: 'Control en 48 horas y retiro de puntos en 10 días.',
  responsable: {
    nombre: 'CAROLINA FRANCIA SAEZ',
    rut: '14.497.568-5',
    telefono: '9 1200 0556',
    mail: 'carolina.saez@email.com',
  },
  paciente: {
    nombre: 'ALMENDRA',
    especie: 'CANINO',
    raza: 'MESTIZO',
    sexo: 'HEMBRA',
    edad: '4 AÑOS',
    peso: '18.4 kg',
    color: 'BLANCO CREMA',
    patron: 'PARCHE',
    tipoTenencia: 'CON DUEÑO',
    microchip: '152000000000123',
  },
  profesional: {
    nombre: 'Dra. Javiera Rojas',
    rut: '17.654.321-0',
    cargo: 'Médico Veterinario',
  },
  tratamientos: [
    {
      farmaco: 'Meloxicam 1.5 mg/ml',
      dosis: '0.7 ml',
      frecuencia: 'Cada 24 horas',
      duracion: '4 días',
      via: 'Oral',
      observaciones: 'Administrar con alimento.',
    },
    {
      farmaco: 'Amoxicilina + Ácido clavulánico',
      dosis: '1 comprimido',
      frecuencia: 'Cada 12 horas',
      duracion: '7 días',
      via: 'Oral',
      observaciones: 'Completar tratamiento.',
    },
    {
      farmaco: 'Limpieza local',
      dosis: '—',
      frecuencia: '2 veces al día',
      duracion: '10 días',
      via: 'Tópica',
      observaciones: 'Usar suero fisiológico y gasa limpia.',
    },
  ],
  examenes: [
    'Hemograma completo',
    'Perfil bioquimico',
    'Panel de coagulacion',
    'Perfil lipidico',
  ],
  observacionesGenerales: 'Ayuno de 8 horas, sin comida pero con agua.',
};

export default function PdfTestTratamientoPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    const renderPdf = async () => {
      setLoading(true);
      setError('');

      try {
        const instance = pdf();
        instance.updateContainer(
          <FichaTratamientoPosteriorPdf datos={mockData} />
        );
        const blob = await instance.toBlob();

        if (cancelled) return;

        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error
            ? e.message
            : 'No se pudo generar la vista previa del PDF.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    renderPdf();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6 lg:p-8">
      <div className="flex flex-col gap-3">
        <Link
          href="/admin"
          className="text-muted-foreground hover:text-foreground inline-flex w-fit items-center gap-1 text-sm"
        >
          <ArrowLeft className="size-4" />
          Volver
        </Link>

        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <FileText className="size-6 text-emerald-700" />
            Ficha de Tratamiento Posterior
          </h1>
        </div>
      </div>

      {error ? (
        <div className="flex min-h-[70vh] items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-red-700 shadow-sm">
          <div className="text-center">
            <p className="text-sm font-bold">Error al renderizar PDF</p>
            <p className="mt-1 text-xs">{error}</p>
          </div>
        </div>
      ) : loading ? (
        <div className="flex min-h-[70vh] items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
            <p className="text-sm text-slate-500">Renderizando PDF…</p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <iframe
            title="Ficha de tratamiento posterior"
            src={url}
            className="h-[85vh] w-full border-0"
          />
        </div>
      )}
    </div>
  );
}
