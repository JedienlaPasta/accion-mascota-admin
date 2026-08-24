import {
  Activity,
  ClipboardList,
  Scissors,
  Stethoscope,
  Syringe,
} from 'lucide-react';

export const TIPO_STYLES: Record<
  string,
  {
    displayName: string;
    bg: string;
    text: string;
    ring: string;
    Icon: typeof Stethoscope;
  }
> = {
  consulta_medica: {
    displayName: 'Consulta médica',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    ring: 'ring-sky-200/60',
    Icon: Stethoscope,
  },
  operativo_sanitario: {
    displayName: 'Operativo sanitario',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200/60',
    Icon: Syringe,
  },
  operativo_esterilizacion: {
    displayName: 'Cirugía - Esterilización',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200/60',
    Icon: Scissors,
  },
  control: {
    displayName: 'Control / seguimiento',
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    ring: 'ring-violet-200/60',
    Icon: ClipboardList,
  },
  emergencia: {
    displayName: 'Emergencia / Urgencia',
    bg: 'bg-orange-50',
    text: 'text-orange-700',
    ring: 'ring-orange-200/60',
    Icon: Activity,
  },
};
