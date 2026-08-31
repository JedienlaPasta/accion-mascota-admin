import { Suspense } from 'react';
import sql from '@/app/_lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, Download, X } from 'lucide-react';
import { Button } from '@/app/ui/components/Button';
import { TIPO_STYLES } from '@/app/_lib/static-data/tipos-atencion';
import {
  formatDate,
  formatPhone,
  formatRUT,
  formatShortDate,
} from '@/app/_lib/utils/format';
import { BaseLink } from '@/app/ui/components/Link';
import PdfViewerSuspenseBoundary from './PdfViewerSuspenseBoundary';

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ download?: '1' }>;
};

export default async function PdfTestPage(props: PageProps) {
  const { id } = await props.params;

  // 1) Obtener datos de la atencion + mascota + propietario + veterinario (temporal)
  const rows = await sql`
    SELECT
      a.public_id AS atencion_public_id,
      a.fecha_atencion,
      a.tipo_atencion,
      a.peso_actual,
      a.observaciones,
      -- Consulta Médica
      cm.motivo AS cm_motivo,
      cm.anamnesis AS cm_anamnesis,
      cm.examen_fisico AS cm_examen_fisico,
      cm.diagnostico_predx AS cm_predx,
      cm.examenes_solicitados AS cm_examenes,
      cm.tratamiento AS cm_tratamiento,
      -- Mascota
      m.public_id AS mascota_public_id,
      m.nombre AS mascota_nombre,
      m.fecha_nacimiento::text AS mascota_fecha_nacimiento,
      m.especie AS mascota_especie,
      m.raza AS mascota_raza,
      m.color AS mascota_color,
      m.patron AS mascota_patron,
      m.sexo AS mascota_sexo,
      m.microchip AS mascota_microchip,
      m.modo_obtencion AS mascota_modo_obtencion,
      m.razon_tenencia AS mascota_razon_tenencia,
      m.esterilizado AS mascota_esterilizado,
      -- Propietario
      p.public_id AS propietario_public_id,
      p.nombre AS propietario_nombre,
      p.rut AS propietario_rut,
      p.fecha_nacimiento AS propietario_fn,
      p.direccion AS propietario_direccion,
      p.comuna AS propietario_comuna,
      p.correo_personal AS propietario_correo,
      p.telefono AS propietario_telefono,
      -- Veterinario
      u.public_id AS veterinario_public_id,
      u.nombre AS veterinario_nombre,
      u.rut AS veterinario_rut
    FROM atenciones a
    LEFT JOIN consultas_medicas cm ON cm.atencion_id = a.id
    INNER JOIN mascotas m ON m.id = a.mascota_id
    INNER JOIN propietarios p ON p.id = m.propietario_id
    LEFT JOIN usuarios u ON u.id = a.usuario_id
    WHERE a.public_id = ${id}
    LIMIT 1
  `;

  const atencion = rows[0];
  if (!atencion) notFound();

  console.log(
    'Fecha nacimiento de la mascota:',
    atencion.mascota_fecha_nacimiento
  );

  // 2) Formatear datos para el PDF
  const splitVetName = atencion.veterinario_nombre
    ? atencion.veterinario_nombre.trim().split(' ')
    : [];
  const veterinarioNombres = splitVetName
    .slice(0, Math.ceil(splitVetName.length / 2))
    .join(' ');
  const veterinarioApellidos = splitVetName
    .slice(Math.ceil(splitVetName.length / 2))
    .join(' ');

  const pdfPayload = {
    fecha: formatDate(String(atencion.fecha_atencion)),
    responsable: {
      nombre: atencion.propietario_nombre ?? '',
      rut: atencion.propietario_rut ? formatRUT(atencion.propietario_rut) : '',
      fechaNacimiento: atencion.propietario_fn
        ? formatDate(String(atencion.propietario_fn))
        : '',
      direccion: atencion.propietario_direccion ?? '',
      comuna: atencion.propietario_comuna ?? '',
      mail: atencion.propietario_correo ?? '',
      telefono: atencion.propietario_telefono
        ? formatPhone(atencion.propietario_telefono)
        : '',
    },
    paciente: {
      nombre: atencion.mascota_nombre ?? '',
      fechaNacimiento: atencion.mascota_fecha_nacimiento
        ? formatShortDate(atencion.mascota_fecha_nacimiento)
        : '',
      especie: atencion.mascota_especie ?? '',
      raza: atencion.mascota_raza ?? '',
      color: atencion.mascota_color ?? '',
      patron: atencion.mascota_patron ?? '',
      sexo: atencion.mascota_sexo ?? '',
      peso: atencion.peso_actual
        ? `${Number(atencion.peso_actual).toFixed(2)} kg`
        : '',
      microchip: atencion.mascota_microchip ?? '',
      modoObtencion: atencion.mascota_modo_obtencion ?? '',
      razonTenencia: atencion.mascota_razon_tenencia ?? '',
      esterilizado:
        atencion.mascota_esterilizado === true
          ? 'SI'
          : atencion.mascota_esterilizado === false
            ? 'NO'
            : '',
    },
    clinica: {
      motivo: atencion.cm_motivo ?? '',
      anamnesis: atencion.cm_anamnesis ?? '',
      examenFisico: atencion.cm_examen_fisico ?? '',
      preDx: atencion.cm_predx ?? '',
      examenes: atencion.cm_examenes ?? '',
      tratamiento: atencion.cm_tratamiento ?? '',
    },
    veterinario: {
      nombres: veterinarioNombres,
      apellidos: veterinarioApellidos,
      rut: atencion.veterinario_rut ? formatRUT(atencion.veterinario_rut) : '',
      comuna: atencion.propietario_comuna ?? '', // Falta agregar este campo en la DB
    },
    tipoAtencion: String(atencion.tipo_atencion ?? 'consulta_medica'),
  };

  // 3) Renderizar pagina + panel acciones superior
  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col items-start justify-between gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-center">
          <div>
            <Link
              href={`/admin/propietarios`}
              className="text-muted-foreground hover:text-foreground mb-2 inline-flex items-center gap-1 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-800">
              <FileText className="size-6 text-emerald-700" />
              Ficha de Atención · PDF
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Previsualización en vivo del documento descargable.
            </p>
          </div>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <BaseLink
              href="/admin/pdf-test"
              className="border-slate-200 hover:bg-white"
            >
              <X className="size-4" />
              Cerrar
            </BaseLink>
            <BaseLink href={`/admin/atenciones/${atencion.atencion_public_id}`}>
              Ver ficha web
            </BaseLink>
            <Button className="bg-emerald-600 hover:bg-emerald-700">
              <Download className="size-4" />
              Descargar PDF
            </Button>
          </div>
        </header>

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Barra superior de meta-datos */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/60 px-6 py-3">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 ring-1 ring-slate-200">
                ID Atención:
                <code className="font-mono text-slate-600">
                  {atencion.atencion_public_id}
                </code>
              </span>
              <span
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase ring-1 ${TIPO_STYLES[pdfPayload.tipoAtencion as keyof typeof TIPO_STYLES]?.bg ?? 'bg-slate-100 text-slate-700 ring-slate-200'} ${TIPO_STYLES[pdfPayload.tipoAtencion as keyof typeof TIPO_STYLES]?.text ?? ''} ${TIPO_STYLES[pdfPayload.tipoAtencion as keyof typeof TIPO_STYLES]?.ring ?? ''}`}
              >
                {TIPO_STYLES[
                  pdfPayload.tipoAtencion as keyof typeof TIPO_STYLES
                ]?.displayName ?? pdfPayload.tipoAtencion}
              </span>
              <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 ring-1 ring-slate-200">
                Paciente: {atencion.mascota_nombre}
              </span>
              <span className="rounded-lg bg-white px-2.5 py-1 font-semibold text-slate-700 ring-1 ring-slate-200">
                Tutor: {atencion.propietario_nombre}
              </span>
            </div>
          </div>

          {/* Visor PDF */}
          <Suspense
            fallback={
              <div className="flex h-[85vh] items-center justify-center bg-slate-50">
                <p className="text-sm text-slate-500">Cargando…</p>
              </div>
            }
          >
            <PdfViewerSuspenseBoundary datos={pdfPayload} />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
