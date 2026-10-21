import { HeartPulse, Stethoscope, Syringe } from 'lucide-react';

export type StatMetricKey =
  | 'octuple'
  | 'antirrabica'
  | 'triple'
  | 'de'
  | 'di'
  | 'implantacion'
  | 'total_atenciones'
  | 'perros'
  | 'gatos';

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
    enabled: false,
    Icon: HeartPulse,
  },
  {
    value: 'CONSULTA_MEDICA',
    label: 'Consultas Médicas',
    enabled: false,
    Icon: Stethoscope,
  },
] as const;
