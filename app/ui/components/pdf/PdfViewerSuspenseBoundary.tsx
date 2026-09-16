'use client';

import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('@/app/ui/components/pdf/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[90vh] items-center justify-center rounded-xl bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />
        <p className="text-sm text-gray-500">Cargando visor PDF…</p>
      </div>
    </div>
  ),
});

export default function PdfViewerSuspenseBoundary({
  datos,
  className,
}: {
  datos: unknown;
  className?: string;
}) {
  return <PdfViewer datos={datos} className={className} />;
}
