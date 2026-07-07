'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  PawPrint,
  Calendar,
  ClipboardList,
  User,
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const navItems = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/citas',
    label: 'Citas',
    icon: Calendar,
  },
  {
    href: '/admin/mascotas',
    label: 'Mascotas',
    icon: PawPrint,
  },
  {
    href: '/admin/propietarios',
    label: 'Propietarios',
    icon: User,
  },
  {
    href: '/admin/atenciones',
    label: 'Atenciones',
    icon: ClipboardList,
  },
  {
    href: '/admin/configuracion',
    label: 'Configuración',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  // if (status !== 'authenticated') {
  //   return null;
  // }

  if (!session) {
    console.log('Sidebar no protegido');
  }

  return (
    <aside className="w-72">
      <div className="fixed top-0 hidden h-full w-72 flex-col border-r border-zinc-800 bg-[#111727] lg:flex">
        {/* Sección del Logo */}
        <div className="border-b border-zinc-800/50 bg-linear-to-b from-zinc-900/50 to-transparent">
          <Link
            href="/"
            className="flex items-center gap-3 px-5 py-5 transition-colors hover:bg-white/5"
          >
            <div className="relative flex size-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500/15 to-teal-600/15 ring-1 ring-emerald-500/30">
              <Image
                src="/mascota_icon.png"
                alt="Acción Mascota - Municipalidad de Algarrobo"
                width={140}
                height={140}
                className="size-10 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-wide text-white uppercase">
                Acción Mascota
              </span>
              <span className="text-xs font-medium text-emerald-400/90">
                Municipalidad de Algarrobo
              </span>
            </div>
          </Link>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-3">
          <ul className="space-y-1">
            <li className="pt-2">
              <p className="tracking-wides mb-2 px-3 text-xs font-semibold text-gray-500 uppercase">
                Portal Admin
              </p>
            </li>

            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (pathname?.startsWith(item.href) && item.href !== '/admin');

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`group font-semiboldS flex items-center gap-2 rounded-xl border px-2 py-2 text-sm transition-colors ${
                      isActive
                        ? 'border-gray-800 bg-[#020711] text-white'
                        : 'border-transparent text-gray-400 hover:bg-[#040d1d] hover:text-gray-300'
                    }`}
                  >
                    <span
                      className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-700/30 text-gray-400 group-hover:bg-slate-700/50 group-hover:text-gray-200'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3">
          <div className="group flex items-center gap-2 rounded-xl border border-gray-800 bg-[#020711] px-2 py-2 text-sm text-white">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            Perfil
          </div>
        </div>
      </div>
    </aside>
  );
}
