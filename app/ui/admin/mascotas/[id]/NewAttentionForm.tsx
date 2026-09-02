'use client';

import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Check,
  CheckCircle2,
  Plus,
  X,
  AlertTriangle,
  Scissors,
  Syringe,
  ClipboardList,
} from 'lucide-react';
import { Button } from '@/app/ui/components/Button';
import Input, {
  SafeNumberInput,
  TextArea,
  Select,
  CheckboxCard,
} from '@/app/ui/components/Input';
import {
  TIPO_STYLES,
  TIPOS_ATENCION_VALIDOS,
} from '@/app/_lib/static-data/tipos-atencion';
import { createAttention } from '@/app/_lib/actions/atenciones';
import { BaseMutedLink } from '@/app/ui/components/Link';
import Badge from '@/app/ui/components/Badge';
import { ProcedimientoItem } from '@/app/_lib/data/atenciones';

export type NewAttentionFormProps = {
  petPublicId: string;
  pesoInicial: number | string | null | undefined;
  procedimientosDisponibles: ProcedimientoItem[];
  tieneMicrochipRegistrado: boolean;
  esterilizado: boolean | null;
};

const RESULTADOS_ESTERILIZACION = [
  {
    value: 'APROBADO',
    label: 'Aprobado',
  },
  {
    value: 'SUSPENDIDO',
    label: 'Suspendido',
  },
];

// Helper: valor por default YYYY-MM-DDThh:mm (datetime-local en hora de Chile (no importa offset, sólo la hora local)
function defaultFechaAhora(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d}T${hh}:${mm}`;
}

export default function NewAttentionForm(props: NewAttentionFormProps) {
  const petPublicId = props.petPublicId;
  const router = useRouter();

  // Campos base
  const [tipo, setTipo] = useState<string>('consulta_medica');
  const [fecha, setFecha] = useState<string>(defaultFechaAhora());
  const [peso, setPeso] = useState<string>(
    props.pesoInicial != null ? String(props.pesoInicial) : ''
  );
  const [observaciones, setObservaciones] = useState<string>('');

  // Subtipo 1: CONSULTA_MEDICA
  const [motivo, setMotivo] = useState('');
  const [anamnesis, setAnamnesis] = useState('');
  const [examenFisico, setExamenFisico] = useState('');
  const [diagnosticoPredx, setDiagnosticoPredx] = useState('');
  const [examenesSolicitados, setExamenesSolicitados] = useState('');
  const [tratamiento, setTratamiento] = useState('');
  const [derivacionClinica, setDerivacionClinica] = useState(false);

  // Subtipo 2: ESTERILIZACION
  const [resultadoEsterilizacion, setResultadoEsterilizacion] = useState('');
  const [marcarEsterilizado, setMarcarEsterilizado] = useState<boolean>(
    props.esterilizado !== true
  );

  // Subtipo 3: OPERATIVO_SANITARIO
  const [procedimientoCodes, setProcedimientoCodes] = useState<string[]>([]);

  // Subtipo 4: IMPLANTE_MICROCHIP
  const [numeroMicrochip, setNumeroMicrochip] = useState('');

  // Estado de envío
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const TipoConf = TIPO_STYLES[tipo];
  const TipoIcon = TipoConf.Icon;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');

    if (tipo === 'consulta_medica' && !motivo.trim()) {
      toast.error('Ingrese el motivo de la consulta', {
        description: 'Revisa los datos e intenta nuevamente.',
        duration: 5000,
      });
      setSubmitError('Ingrese el motivo de la consulta');
      setIsSubmitting(false);
      return;
    }

    if (
      tipo === 'operativo_esterilizacion' &&
      !resultadoEsterilizacion.trim()
    ) {
      toast.error('Ingrese el resultado de la esterilización', {
        description: 'Revisa los datos e intenta nuevamente.',
        duration: 5000,
      });
      setSubmitError('Ingrese el resultado de la esterilización');
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Registrando atención...');

    try {
      const response = await createAttention({
        petPublicId,
        usuarioPublicId: '213ac5be-3c2a-4447-8339-2373657f90c5',
        tipoAtencion: tipo,
        fechaAtencion: fecha,
        pesoAtencion: peso,
        observaciones,

        // Consulta-like
        motivo: tipo === 'consulta_medica' ? motivo : null,
        anamnesis: tipo === 'consulta_medica' ? anamnesis : null,
        examenFisico: tipo === 'consulta_medica' ? examenFisico : null,
        diagnosticoPredx: tipo === 'consulta_medica' ? diagnosticoPredx : null,
        examenesSolicitados:
          tipo === 'consulta_medica' ? examenesSolicitados : null,
        tratamiento: tipo === 'consulta_medica' ? tratamiento : null,
        derivacionClinica:
          tipo === 'consulta_medica' ? derivacionClinica : null,

        // Esterilización
        resultadoEsterilizacion:
          tipo === 'operativo_esterilizacion' ? resultadoEsterilizacion : null,
        marcarEsterilizado:
          tipo === 'operativo_esterilizacion' ? marcarEsterilizado : null,

        // Operativo Sanitario
        procedimientoCodes: procedimientoCodes,

        // Implante
        numeroMicrochip: numeroMicrochip.trim() ? numeroMicrochip.trim() : null,
      });

      if (!response.success) {
        toast.error('No se pudo registrar la atención', {
          id: toastId,
          description: response.error,
          duration: 5500,
        });
        setSubmitError(response.error);
        setIsSubmitting(false);
        return;
      }

      setTimeout(() => {
        toast.success('Atención registrada con éxito', {
          id: toastId,
          description: response.message,
          duration: 2600,
        });
      });
      setTimeout(() => {
        router.push(`/admin/mascotas/${petPublicId}`);
      }, 1000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Error al registrar la atención';
      toast.error(message, {
        id: toastId,
        description: 'Revisa los datos e intenta nuevamente.',
        duration: 5000,
      });
      setSubmitError(message);
      return;
    } finally {
      setTimeout(() => setIsSubmitting(false), 500);
    }
  };

  const toggleProcedimientoCode = (code: string) => {
    setProcedimientoCodes((prev) =>
      prev.includes(code) ? prev.filter((x) => x !== code) : [...prev, code]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Seccion 1: Datos generales de la atencion */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        {/* Cabecera stepper */}
        <div className="mb-5 flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="mb-1 flex items-center gap-2.5">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-200/60">
              <TipoIcon className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Datos Generales
              </h2>
              <p className="text-xs text-gray-500">
                Indicar el tipo de atención que deseas registrar y sus datos
                generales.
              </p>
            </div>
          </div>
          <Badge
            className={`${TipoConf.bg} ${TipoConf.text} ${TipoConf.ring} px-3 py-1 text-xs font-bold uppercase ring-1`}
          >
            <TipoIcon className="mr-1 h-3.5 w-3.5" />
            {TipoConf.displayName}
          </Badge>
        </div>

        {/* Tipo de atencion */}
        <div className="mb-6">
          <label className="mb-3 block text-xs font-bold text-gray-700">
            ¿Qué tipo de atención deseas registrar?{' '}
            <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {TIPOS_ATENCION_VALIDOS.map((tipo_atencion) => {
              const c = TIPO_STYLES[tipo_atencion];
              const Icon = c.Icon;
              const active = tipo === tipo_atencion;
              return (
                <button
                  key={tipo_atencion}
                  type="button"
                  onClick={() => setTipo(tipo_atencion)}
                  className={`relative flex cursor-pointer flex-col items-start gap-2 rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? `${c.bg} ${c.text} ${c.ring} scale-[1.01] border-transparent shadow-md ring-2`
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  <div
                    className={`flex size-10 items-center justify-center rounded-xl ${active ? 'bg-white/80 shadow-sm ring-1 ring-white' : 'bg-gray-50 text-gray-600 ring-1 ring-gray-200'}`}
                  >
                    <Icon className="size-5 shrink-0" />
                  </div>
                  <div>
                    <p className="text-xs leading-tight font-black tracking-wide uppercase">
                      {c.displayName}
                    </p>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed opacity-75">
                      {tipo_atencion === 'consulta_medica' &&
                        'Atención general'}
                      {tipo_atencion === 'control' && 'Seguimiento'}
                      {tipo_atencion === 'emergencia' && 'Urgencia inmediata'}
                      {tipo_atencion === 'operativo_sanitario' &&
                        'Vacunas/procedimientos'}
                      {tipo_atencion === 'operativo_esterilizacion' &&
                        'Cirugía castración'}
                    </p>
                  </div>
                  {active ? (
                    <span className="absolute top-3 right-3 inline-flex size-5 items-center justify-center rounded-full bg-white/70 text-emerald-700 shadow-sm ring-1 ring-white">
                      <Check className="size-3" />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fecha + Peso */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-12">
          <div className="sm:col-span-8">
            <Input
              label="Fecha y hora de la atención"
              nombre="fechaAtencion"
              type="datetime-local"
              value={fecha}
              setData={setFecha}
              required
            />
          </div>
          <div className="sm:col-span-4">
            <SafeNumberInput
              label="Peso (kg)"
              nombre="pesoAtencion"
              placeHolder="Ej: 12.5"
              value={peso}
              setData={setPeso}
              required={false}
            />
          </div>
        </div>
      </section>

      {/* Seccion 2: Consulta medica */}
      {tipo === 'consulta_medica' ? (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2.5">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 ring-1 ring-sky-200/60">
              <TipoIcon className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Datos Clínicos — {TipoConf.displayName}
              </h2>
              <p className="text-xs text-gray-500">
                Registro del motivo, evolución y tratamiento indicado.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
            <div className="md:col-span-6">
              <TextArea
                label="Motivo de consulta"
                nombre="motivo"
                placeHolder="Ej: Decaimiento, vómitos y pérdida de apetito desde hace 2 días."
                maxLength={500}
                value={motivo}
                setData={setMotivo}
                required
              />
            </div>
            <div className="md:col-span-6">
              <TextArea
                label="Anamnesis (antecedentes)"
                nombre="anamnesis"
                placeHolder="Ej: Vacunas al día. Última desparasitación hace 1 mes. Convive con 2 perros más."
                maxLength={1000}
                value={anamnesis}
                setData={setAnamnesis}
              />
            </div>
            <div className="md:col-span-6">
              <TextArea
                label="Examen físico"
                nombre="examenFisico"
                placeHolder="Temperatura 39.2°C, mucosa pálida, pulso 120 lpm, sin dolor abdominal leve."
                maxLength={1000}
                value={examenFisico}
                setData={setExamenFisico}
              />
            </div>
            <div className="md:col-span-6">
              <TextArea
                label="Diagnóstico presuntivo (Pre-Dx)"
                nombre="diagnosticoPredx"
                placeHolder="Gastroenteritis viral vs. cuerpo extraño."
                maxLength={500}
                value={diagnosticoPredx}
                setData={setDiagnosticoPredx}
              />
            </div>
            <div className="md:col-span-6">
              <TextArea
                label="Exámenes solicitados"
                nombre="examenesSolicitados"
                placeHolder="Hemograma completo, perfil bioquímico renal y radiografía de abdomen."
                maxLength={600}
                value={examenesSolicitados}
                setData={setExamenesSolicitados}
              />
            </div>
            <div className="md:col-span-6">
              <TextArea
                label="Tratamiento / Indicaciones"
                nombre="tratamiento"
                placeHolder="Omeprazol 10mg VO cada 12h por 7 días. Dieta blanda. Volver en 72h si no mejora."
                maxLength={1200}
                value={tratamiento}
                setData={setTratamiento}
              />
            </div>
            <div className="md:col-span-6">
              <CheckboxCard
                label="Derivación a especialista / clínica privada"
                description="Marca esta casilla si se deriva a otra institución o especialista externo."
                checked={derivacionClinica}
                onChange={setDerivacionClinica}
              />
            </div>
          </div>
        </section>
      ) : null}
      {/* Seccion 3: Operativo esterilizacion */}
      {tipo === 'operativo_esterilizacion' ? (
        <section
          className={`rounded-2xl border border-gray-100 bg-white p-6 shadow-sm ${props.esterilizado === true ? 'opacity-60' : ''}`}
        >
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-rose-50 text-rose-700 ring-1 ring-rose-200/60">
                <Scissors className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Cirugía de Esterilización
                </h2>
                <p className="text-xs text-gray-500">
                  Resultado y seguimiento post-operatorio.
                </p>
              </div>
            </div>
            {props.esterilizado === true ? (
              <Badge className="bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Ya figura esterilizado
              </Badge>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <Select
                label="Resultado del procedimiento"
                nombre="resultado"
                disabled={props.esterilizado === true}
                value={resultadoEsterilizacion}
                setData={setResultadoEsterilizacion}
                options={[
                  { value: '', label: 'Selecciona el resultado...' },
                  ...RESULTADOS_ESTERILIZACION,
                ]}
                required
              />
            </div>
          </div>
        </section>
      ) : null}
      {/* Seccion 4: Operativo sanitario */}
      {tipo === 'operativo_sanitario' ? (
        <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60">
                <Syringe className="size-5" />
              </span>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Operativo Sanitario — Procedimientos
                </h2>
                <p className="text-xs text-gray-500">
                  Marca todos los procedimientos aplicados en este operativo.
                </p>
              </div>
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-600 tabular-nums ring-1 ring-slate-200">
              {procedimientoCodes.length} seleccionados
            </div>
          </div>

          {props.procedimientosDisponibles.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-500">
              ⚠️ No hay procedimientos cargados en la tabla{' '}
              <code className="rounded bg-gray-100 px-1 text-xs">
                procedimientos
              </code>
              . Agrega vacunas, desparasitaciones, etc. para poder
              seleccionarlos.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-2">
              {props.procedimientosDisponibles.map((p) => {
                const active = procedimientoCodes.includes(p.codigo);
                return (
                  <button
                    key={p.codigo}
                    type="button"
                    onClick={() => toggleProcedimientoCode(p.codigo)}
                    className={`group flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                      active
                        ? 'border-emerald-200 bg-emerald-50 shadow-sm ring-1 ring-emerald-100'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border ${
                        active
                          ? 'border-emerald-600 bg-emerald-600 text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {active ? <Check className="size-3.5" /> : null}
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="truncate text-sm font-bold text-gray-900">
                        {p.nombre}
                      </p>
                      <p className="truncate font-mono text-[11px] text-gray-500">
                        Código: {p.codigo}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>
      ) : null}
      {/* Seccion 5: Implante de microchip (opcional, cualquier tipo) */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/60">
              <Plus className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Implante de Microchip
              </h2>
              <p className="text-xs text-gray-500">
                Opcional. Registro si en esta atención.{' '}
                <span className="font-semibold text-slate-600">
                  Si la mascota ya tiene chip, este campo se ignora.
                </span>
              </p>
            </div>
          </div>
          {props.tieneMicrochipRegistrado ? (
            <Badge className="bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-slate-200">
              Ya cuenta con microchip
            </Badge>
          ) : null}
        </div>
        <div>
          <Input
            label="Número de microchip (ISO 11784/11785: 15 dígitos)"
            nombre="numeroMicrochip"
            placeHolder={
              props.tieneMicrochipRegistrado
                ? 'La mascota ya tiene chip — desactiva ese flag antes'
                : 'Ej: 956000012345678 (sólo números)'
            }
            maxLength={15}
            value={numeroMicrochip}
            setData={setNumeroMicrochip}
          />
        </div>
      </section>
      {/* Seccion 6: Observaciones generales */}
      <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-2.5">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
            <ClipboardList className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Observaciones Generales
            </h2>
            <p className="text-xs text-gray-500">
              Notas administrativas o comentarios adicionales que no encajen en
              los otros campos.
            </p>
          </div>
        </div>
        <TextArea
          label="Observaciones"
          nombre="observaciones"
          placeHolder="Ej: Paciente requiere control en 7 días. Recordar dosis de refuerzo."
          value={observaciones}
          setData={setObservaciones}
          maxLength={1200}
        />
      </section>
      {/* Error top */}
      {submitError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100"
        >
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <div className="flex flex-col">
            <span className="font-semibold">
              No se pudo registrar la atención:
            </span>
            <span>{submitError}</span>
          </div>
        </div>
      ) : null}
      {/* Footer: Acciones */}
      <footer className="sticky bottom-0 z-10">
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
            <BaseMutedLink
              href={`/admin/mascotas/${petPublicId}`}
              className="h-10 justify-center text-xs"
            >
              <X className="h-4 w-4" />
              Volver a la ficha
            </BaseMutedLink>
          </div>

          <div className="flex items-center gap-2 sm:justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 w-full gap-2 bg-emerald-600 text-sm shadow-md hover:bg-emerald-700 hover:shadow-lg"
            >
              <Check className="h-4 w-4" />
              {isSubmitting ? 'Guardando…' : 'Guardar Atención'}
            </Button>
          </div>
        </div>
      </footer>
    </form>
  );
}
