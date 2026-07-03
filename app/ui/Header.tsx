'use client';

import Link from 'next/link';
import { useState } from 'react';
import { LoginButton, RegisterButton } from './components/Button';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import SessionMenu from './components/SessionMenu';
import {
  PawPrint,
  Calendar,
  User,
  LayoutDashboard,
  Home,
  X,
  Menu,
  Hospital,
  Mails,
  Ambulance,
  Library,
} from 'lucide-react';
import MobileNavMenu from './components/MobileNavMenu';
import { logout } from '../_lib/actions/auth';

const authenticatedNavLinks = [
  {
    href: '/portal/mascotas',
    label: 'Mis Mascotas',
    icon: <PawPrint className="h-4 w-4" />,
  },
  {
    href: '/portal/citas',
    label: 'Mis Citas',
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    href: '/portal/historial',
    label: 'Historial Clínico',
    icon: <Hospital className="h-4 w-4" />,
  },
  {
    href: '/portal/solicitudes',
    label: 'Mis Solicitudes',
    icon: <Mails className="h-4 w-4" />,
  },
  {
    href: '/portal/perfil',
    label: 'Mi Perfil',
    icon: <User className="h-4 w-4" />,
  },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { status } = useSession();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    await signOut({ redirectTo: '/' });
  };

  return (
    <header className="sticky top-0 z-50 bg-linear-to-b from-gray-900 via-slate-800 to-gray-900">
      <div className="mx-auto flex h-20 w-full items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5">
          <Image
            src="/logo.png"
            alt="Acción Mascota - Municipalidad de Algarrobo"
            width={140}
            height={140}
            className="size-16 sm:size-24"
            priority
          />
          <div className="flex flex-col leading-tight">
            <span className="-mb-0.5 text-[8px] font-medium tracking-wide text-gray-400 uppercase sm:text-[10px]">
              Municipalidad de
            </span>
            <span className="text-xs font-semibold text-gray-700 sm:text-sm">
              Algarrobo
            </span>
          </div>
        </Link>

        {/* (Desktop) Menu de sesion/navegacion y botones de autenticacion */}
        <div className="hidden items-center gap-2 sm:flex">
          {status !== 'authenticated' ? (
            <div className="flex gap-2">
              <LoginButton>Iniciar Sesión</LoginButton>
              <RegisterButton>Registrarse</RegisterButton>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              {!pathname.includes('portal') && (
                <Link
                  href="/portal/mascotas"
                  className="text-md rounded-lg px-3 py-2 text-slate-600 transition-colors outline-none hover:text-emerald-700"
                >
                  Ir al Portal
                </Link>
              )}
              <SessionMenu
                authenticatedNavLinks={authenticatedNavLinks}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            </div>
          )}
        </div>

        {/* (Movil) Boton toggle de navegacion */}
        <div className="flex items-center gap-4 md:hidden">
          {!pathname.includes('portal') && status === 'authenticated' && (
            <Link
              href="/portal/mascotas"
              className="rounded-lg px-3 py-2 text-sm text-slate-600 transition-colors outline-none hover:text-emerald-700"
            >
              Ir al Portal
            </Link>
          )}
          <button
            className="group relative flex aspect-square h-12 cursor-pointer items-center justify-center rounded-xl bg-emerald-800/90 font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-300"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
        </div>

        {/* (Movil) Panel de navegacion */}
        {mobileMenuOpen && (
          <MobileNavMenu
            authenticatedNavLinks={authenticatedNavLinks}
            setMobileMenuOpen={setMobileMenuOpen}
            handleLogout={handleLogout}
          />
        )}
      </div>
    </header>
  );
}
