import { HeartPulse, Stethoscope, Syringe } from 'lucide-react';

export type StatMetricKey =
  | 'octuple'
  | 'antirrabica'
  | 'triple'
  | 'de'
  | 'di'
  | 'implantacion'
  | 'verificacion'
  | 'total_atenciones'
  | 'perros'
  | 'perros_macho'
  | 'perros_hembra'
  | 'gatos'
  | 'gatos_macho'
  | 'gatos_hembra'
  | 'aprobadas'
  | 'finalizada_sin_exito'
  | 'ya_intervenidos'
  | 'inscrito_plataforma'
  | 'con_dueno'
  | 'sin_dueno'
  | 'derivados'
  | 'tratamiento_casa';

export type StatMetric = {
  key: StatMetricKey;
  label: string;
  shortLabel: string;
};

export const SANITARY_METRICS: StatMetric[] = [
  { key: 'octuple', label: 'Óctuple', shortLabel: 'Óctuple' },
  { key: 'antirrabica', label: 'Antirrábica', shortLabel: 'Antirrábica' },
  { key: 'triple', label: 'Triple Felina', shortLabel: 'Triple Felina' },
  { key: 'de', label: 'Desparasitación Externa', shortLabel: 'D.E' },
  { key: 'di', label: 'Desparasitación Interna', shortLabel: 'D.I' },
  {
    key: 'implantacion',
    label: 'Implantación Microchip',
    shortLabel: 'Implantación',
  },
  {
    key: 'total_atenciones',
    label: 'Total Atenciones',
    shortLabel: 'Total Atenciones',
  },
  { key: 'perros', label: 'Perros', shortLabel: 'Perros' },
  { key: 'gatos', label: 'Gatos', shortLabel: 'Gatos' },
];

export const STERILIZATION_METRICS: StatMetric[] = [
  { key: 'total_atenciones', label: 'Total Atenciones', shortLabel: 'Total' },
  { key: 'aprobadas', label: 'Aprobadas', shortLabel: 'Aprobadas' },
  {
    key: 'finalizada_sin_exito',
    label: 'Finalizada sin éxito',
    shortLabel: 'Sin éxito',
  },
  {
    key: 'ya_intervenidos',
    label: 'Ya intervenidos',
    shortLabel: 'Ya interv.',
  },
  {
    key: 'implantacion',
    label: 'Implantación Microchip',
    shortLabel: 'Implant.',
  },
  { key: 'verificacion', label: 'Verificación', shortLabel: 'Verific.' },
  {
    key: 'inscrito_plataforma',
    label: 'Total inscrito en plataforma',
    shortLabel: 'Inscritos',
  },
  { key: 'con_dueno', label: 'Con dueño', shortLabel: 'Con dueño' },
  { key: 'sin_dueno', label: 'Sin dueño', shortLabel: 'Sin dueño' },
];

export const CONSULT_METRICS: StatMetric[] = [
  { key: 'total_atenciones', label: 'Total Atenciones', shortLabel: 'Total' },
  { key: 'perros', label: 'Perros', shortLabel: 'Perros' },
  { key: 'perros_macho', label: 'Perros macho', shortLabel: 'P. Macho' },
  { key: 'perros_hembra', label: 'Perros hembra', shortLabel: 'P. Hembra' },
  { key: 'gatos', label: 'Gatos', shortLabel: 'Gatos' },
  { key: 'gatos_macho', label: 'Gatos macho', shortLabel: 'G. Macho' },
  { key: 'gatos_hembra', label: 'Gatos hembra', shortLabel: 'G. Hembra' },
  { key: 'derivados', label: 'Derivados', shortLabel: 'Derivados' },
  {
    key: 'implantacion',
    label: 'Microchip implantado',
    shortLabel: 'Implantación',
  },
  {
    key: 'verificacion',
    label: 'Microchip verificado',
    shortLabel: 'Verificación',
  },
];

export const REPORT_CONFIG: Record<string, StatMetric[]> = {
  OPERATIVO_SANITARIO: SANITARY_METRICS,
  OPERATIVO_ESTERILIZACION: STERILIZATION_METRICS,
  CONSULTA_MEDICA: CONSULT_METRICS,
};

export function getReportMetrics(tipo: string): StatMetric[] {
  return REPORT_CONFIG[tipo] ?? [];
}

export const REPORT_TYPES = [
  {
    value: 'OPERATIVO_SANITARIO',
    label: 'Operativos Sanitarios',
    enabled: true,
    Icon: Syringe,
  },
  {
    value: 'OPERATIVO_ESTERILIZACION',
    label: 'Esterilizaciones',
    enabled: true,
    Icon: HeartPulse,
  },
  {
    value: 'CONSULTA_MEDICA',
    label: 'Consultas Médicas',
    enabled: true,
    Icon: Stethoscope,
  },
] as const;
