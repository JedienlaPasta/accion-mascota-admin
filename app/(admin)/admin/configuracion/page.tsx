import {
  ORG_INFO,
  PROCEDURES_MOCK,
  STAFF_MOCK,
} from '@/app/_lib/static-data/configuracion';
import AccountCard from '@/app/ui/admin/configuracion/AccountCard';
import AppointmentScheduleSection from '@/app/ui/admin/configuracion/AppointmentScheduleSection';
import PreferencesSection from '@/app/ui/admin/configuracion/PreferencesSection';
import {
  InfoRow,
  SettingsCard,
} from '@/app/ui/admin/configuracion/SettingsCard';
import Badge from '@/app/ui/components/Badge';
import {
  Building2,
  Globe,
  ListChecks,
  Mail,
  MapPin,
  Phone,
  Users,
} from 'lucide-react';

export default function ConfiguracionPageAdmin() {
  return (
    <div className="flex min-h-full flex-col space-y-6 bg-gray-50/50 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-baseline">
        <div>
          <h2 className="text-foreground text-lg font-bold">Configuración</h2>
          <p className="text-muted-foreground text-sm">
            Ajustes generales de la plataforma, horarios de atención y datos
            institucionales.
          </p>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <SettingsCard
          title="Organización"
          description="Datos institucionales de la unidad."
          icon={Building2}
        >
          <div className="divide-y divide-gray-100">
            <InfoRow label="Institución" value={ORG_INFO.nombre} />
            <InfoRow label="Unidad" value={ORG_INFO.unidad} />
            <InfoRow label="Comuna" value={ORG_INFO.comuna} icon={MapPin} />
            <InfoRow label="Región" value={ORG_INFO.region} icon={MapPin} />
            <InfoRow
              label="Dirección"
              value={ORG_INFO.direccion}
              icon={MapPin}
            />
            <InfoRow label="Teléfono" value={ORG_INFO.telefono} icon={Phone} />
            <InfoRow label="Correo" value={ORG_INFO.correo} icon={Mail} />
            <InfoRow label="Sitio web" value={ORG_INFO.sitioWeb} icon={Globe} />
            <InfoRow
              label="Zona horaria"
              value={ORG_INFO.zonaHoraria}
              icon={Globe}
            />
          </div>
        </SettingsCard>

        <AccountCard />

        <AppointmentScheduleSection />

        <PreferencesSection />
      </section>

      {/* Personal */}
      <SettingsCard
        title="Personal y Roles"
        description="Funcionarios habilitados en el sistema."
        icon={Users}
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-2xl">
            <thead className="border-y border-gray-200/80 bg-gray-50/60">
              <tr className="text-xs text-gray-500">
                <th className="px-4 py-3 text-left font-normal">Nombre</th>
                <th className="px-4 py-3 text-left font-normal">RUT</th>
                <th className="px-4 py-3 text-left font-normal">Cargo</th>
                <th className="px-4 py-3 text-left font-normal">Permisos</th>
                <th className="px-4 py-3 text-center font-normal">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {STAFF_MOCK.map((person) => (
                <tr key={person.rut} className="text-sm">
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {person.nombre}
                  </td>
                  <td className="px-4 py-3 text-slate-500 tabular-nums">
                    {person.rut}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{person.cargo}</td>
                  <td className="px-4 py-3 text-slate-500 capitalize">
                    {person.permisos}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge
                      className={
                        person.estado
                          ? 'bg-emerald-50 text-emerald-700 ring-emerald-200/60'
                          : 'bg-gray-50 text-gray-500 ring-gray-200/60'
                      }
                    >
                      {person.estado ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      {/* Catálogo de procedimientos */}
      <SettingsCard
        title="Catálogo de Procedimientos"
        description="Procedimientos disponibles para operativos sanitarios."
        icon={ListChecks}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {PROCEDURES_MOCK.map((procedure) => (
            <div
              key={procedure.codigo}
              className="flex flex-col gap-1 rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-3"
            >
              <span className="font-mono text-[11px] font-semibold text-emerald-700">
                {procedure.codigo}
              </span>
              <span className="text-sm font-medium text-slate-700">
                {procedure.nombre}
              </span>
            </div>
          ))}
        </div>
      </SettingsCard>
    </div>
  );
}
