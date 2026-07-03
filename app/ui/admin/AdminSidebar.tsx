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
    // <aside className="sticky top-0 hidden w-72 flex-col border-r border-zinc-200/70 bg-white lg:flex">
    <aside className="sticky top-0 hidden w-72 flex-col border-r border-zinc-200/70 bg-linear-to-b from-gray-900 via-slate-800 to-gray-900 lg:flex">
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          <li className="pt-2">
            <p className="mb-2 px-3 text-xs font-semibold tracking-wide text-zinc-400 uppercase">
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
                  className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-emerald-800/90 text-white shadow-sm shadow-emerald-900/20'
                      : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                  }`}
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-lg transition-colors ${
                      isActive
                        ? 'bg-white/10'
                        : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200/70'
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
    </aside>
  );
}
