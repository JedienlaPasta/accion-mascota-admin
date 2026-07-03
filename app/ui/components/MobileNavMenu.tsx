'use client';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { LoginButton, RegisterButton } from './Button';
import { JSX } from 'react';

type navLinks = {
  href: string;
  label: string;
  icon?: JSX.Element;
};

type MobileNavMenuProps = {
  authenticatedNavLinks?: navLinks[];
  setMobileMenuOpen: (open: boolean) => void;
  handleLogout: () => void;
};

export default function MobileNavMenu({
  authenticatedNavLinks,
  setMobileMenuOpen,
  handleLogout,
}: MobileNavMenuProps) {
  const { data: session, status } = useSession();

  return (
    <div className="fixed inset-0 top-[81px] z-50 flex justify-end md:hidden">
      {/* Panel lateral para movil */}
      <nav className="relative flex w-full flex-col gap-2 bg-white px-4 py-2">
        {/* Info usuario */}
        {session && (
          <div className="border-b border-gray-100 pt-2 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-800/80 text-lg font-bold text-white uppercase">
                {session?.user?.name?.charAt(0)}
              </span>
              <div className="overflow-hidden">
                <p className="mr-9 truncate text-sm font-semibold text-zinc-900">
                  {session?.user?.name}
                </p>
                <p className="mr-9 truncate text-xs text-zinc-500">
                  {session?.user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Navegacion Portal */}
        {status === 'authenticated' &&
          authenticatedNavLinks &&
          authenticatedNavLinks.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-100 pt-2">
              <h3 className="ml-2 text-[10px] text-zinc-500">MI PORTAL</h3>
              {authenticatedNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 px-2 py-2 text-[13px] text-zinc-700"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              ))}
            </div>
          )}

        <div className="flex flex-col gap-2 border-t border-gray-100 pt-2">
          {/* Logout */}
          {status === 'authenticated' ? (
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-left text-sm text-rose-600"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          ) : (
            <>
              <LoginButton>Iniciar Sesión</LoginButton>
              <RegisterButton>Registrarse</RegisterButton>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
