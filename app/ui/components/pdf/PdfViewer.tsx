'use client';
import { useEffect, useRef, useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import CertificadoConsultaMedica from './Certificado';

type Props = {
  datos: unknown;
  className?: string;
};

// Visor PDF
export default function PdfViewer({ datos, className = '' }: Props) {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const datosRef = useRef(datos);
  datosRef.current = datos;

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    setLoading(true);
    setError('');

    (async () => {
      try {
        const Document = (
          <CertificadoConsultaMedica datos={datosRef.current as any} />
        );
        const instance = pdf();
        instance.updateContainer(Document);
        const blob = await instance.toBlob();
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (e) {
        if (cancelled) return;
        setError(
          e instanceof Error ? e.message : 'No se pudo renderizar el PDF.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  if (error) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center rounded-xl bg-red-50 text-red-700 ring-1 ring-red-200">
        <div className="flex flex-col gap-1 px-6 py-4 text-center">
          <p className="text-sm font-bold">Error al renderizar PDF</p>
          <p className="text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center rounded-xl bg-slate-50 ring-1 ring-slate-200">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
          <p className="text-sm text-gray-500">Renderizando PDF…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`h-[90vh] w-full overflow-hidden rounded-lg border-2 border-gray-200 bg-white ${className}`}
    >
      <iframe title="Visor PDF" src={url} className="h-full w-full border-0" />
    </div>
  );
}
