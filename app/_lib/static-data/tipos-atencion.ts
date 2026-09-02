import { HeartPulse, Stethoscope, Syringe } from 'lucide-react';

export const TIPOS_ATENCION_VALIDOS: string[] = [
  'consulta_medica',
  'operativo_sanitario',
  'operativo_esterilizacion',
];

export const TIPO_STYLES: Record<
  string,
  {
    displayName: string;
    label: string;
    bg: string;
    text: string;
    ring: string;
    Icon: typeof Stethoscope;
  }
> = {
  consulta_medica: {
    displayName: 'Consulta médica',
    label: 'Consulta',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200/60',
    Icon: Stethoscope,
  },
  operativo_sanitario: {
    displayName: 'Operativo sanitario',
    label: 'Operativo Sanitario',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200/60',
    Icon: Syringe,
  },
  operativo_esterilizacion: {
    displayName: 'Cirugía - Esterilización',
    label: 'Operativo Esterilización',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200/60',
    Icon: HeartPulse,
  },
};
