'use client';

import { SettingsCard } from './SettingsCard';
import { SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import ToggleSwitch from './ToggleSwitch';

const SELECTS = [
  {
    key: 'theme',
    label: 'Tema',
    options: [
      { value: 'system', label: 'Según el sistema' },
      { value: 'light', label: 'Claro' },
      { value: 'dark', label: 'Oscuro' },
    ],
  },
  {
    key: 'dateFormat',
    label: 'Formato de fecha',
    options: [
      { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
      { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
      { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    ],
  },
  {
    key: 'density',
    label: 'Densidad de tablas',
    options: [
      { value: 'comfortable', label: 'Cómoda' },
      { value: 'compact', label: 'Compacta' },
    ],
  },
  {
    key: 'timezone',
    label: 'Zona horaria',
    options: [
      { value: 'America/Santiago', label: 'Santiago (CLT)' },
      { value: 'UTC', label: 'UTC' },
    ],
  },
] as const;

export default function PreferencesSection() {
  const [values, setValues] = useState<Record<string, string>>({
    theme: 'system',
    dateFormat: 'DD-MM-YYYY',
    density: 'comfortable',
    timezone: 'America/Santiago',
  });

  return (
    <SettingsCard
      title="Preferencias"
      description="Apariencia y comportamiento del panel administrativo."
      icon={SlidersHorizontal}
    >
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SELECTS.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="ml-1 text-[10px] font-bold text-slate-500 uppercase">
                {field.label}
              </label>
              <select
                value={values[field.key]}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [field.key]: e.target.value,
                  }))
                }
                className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100"
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="divide-y divide-gray-100 border-t border-gray-100 pt-2">
          <ToggleSwitch
            label="Notificaciones por correo"
            description="Recibir alertas de nuevas citas y solicitudes."
            defaultChecked
          />
          <ToggleSwitch
            label="Recordatorios automáticos"
            description="Enviar recordatorio a los propietarios antes de su cita."
            defaultChecked
          />
          <ToggleSwitch
            label="Resumen semanal"
            description="Recibir un informe de actividad cada lunes."
          />
        </div>
      </div>
    </SettingsCard>
  );
}
