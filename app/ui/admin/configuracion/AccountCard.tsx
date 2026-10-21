'use client';

import { SettingsCard, InfoRow } from './SettingsCard';
import { UserCircle, Mail, ShieldCheck } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Badge from '@/app/ui/components/Badge';

export default function AccountCard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Usuario Admin';
  const userEmail = session?.user?.email || 'usuario@munialgarrobo.cl';
  const roles = session?.user?.roles ?? [];

  return (
    <SettingsCard
      title="Cuenta y Sesión"
      description="Autenticación gestionada por Keycloak."
      icon={UserCircle}
    >
      <div className="divide-y divide-gray-100">
        <InfoRow label="Usuario" value={userName} icon={UserCircle} />
        <InfoRow label="Correo" value={userEmail} icon={Mail} />
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="size-4 text-slate-400" />
            Roles
          </span>
          <div className="flex flex-wrap justify-end gap-1.5">
            {roles.length > 0 ? (
              roles.map((role) => (
                <Badge
                  key={role}
                  className="bg-emerald-50 text-emerald-700 ring-emerald-200/60"
                >
                  {role}
                </Badge>
              ))
            ) : (
              <span className="text-sm font-medium text-slate-800">—</span>
            )}
          </div>
        </div>
      </div>
    </SettingsCard>
  );
}
