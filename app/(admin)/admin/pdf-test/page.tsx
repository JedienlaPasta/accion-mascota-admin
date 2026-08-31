import Link from 'next/link';
import sql from '@/app/_lib/db';
import { FileText, ArrowLeft } from 'lucide-react';

export default async function PdfTestIndexPage() {
  // Buscar 5 atenciones existentes (de tipo consulta_medica si existen) (temporal)
  const atenciones = await sql`
    SELECT a.public_id, m.nombre AS mascota, p.nombre AS tutor, a.fecha_atencion, a.tipo_atencion
    FROM atenciones a
    INNER JOIN mascotas m ON m.id = a.mascota_id
    INNER JOIN propietarios p ON p.id = m.propietario_id
    ORDER BY a.id DESC
    LIMIT 5
  `;

  return (
    <div className="mx-auto max-w-6xl p-8">
      <Link
        href="/admin"
        className="text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1 text-sm"
      >
        <ArrowLeft className="size-4" />
        Volver
      </Link>
      <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-800">
        <FileText className="size-6 text-emerald-700" />
        Atención · Pruebas PDF
      </h1>

      {atenciones.length === 0 ? (
        <p className="text-sm text-slate-500">
          Aún no hay atenciones cargadas. Crea una atención y vuelve aquí.
        </p>
      ) : (
        <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {atenciones.map((a: any) => (
            <li
              key={a.public_id}
              className="flex flex-col gap-1 px-5 py-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-bold text-slate-800">
                  {a.mascota} — {a.tipo_atencion}
                </p>
                <p className="text-xs text-slate-500">
                  Tutor: {a.tutor} ·{' '}
                  {new Date(a.fecha_atencion).toLocaleString('es-CL')}
                </p>
              </div>
              <Link
                href={`/admin/pdf-test/${a.public_id}`}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-emerald-700"
              >
                Ver PDF →
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
