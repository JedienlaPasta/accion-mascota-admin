'use client';

import { logout } from '@/app/_lib/actions/auth';
import { ChevronRight, LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function AdminSidebarProfile() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name || 'Usuario Admin';
  const userEmail = session?.user?.email || 'usuario@munialgarrobo.cl';
  const firstLetter = userName.trim().charAt(0).toUpperCase() || 'U';

  useEffect(() => {
    if (!menuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = menuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    await signOut({ redirectTo: '/' });
  };

  return (
    <div className="relative p-3" ref={menuRef}>
      {/* Botón principal del perfil (estilo trigger) */}
      <button
        type="button"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        className="group flex w-full cursor-pointer items-center gap-2.5 rounded-xl border border-gray-800 bg-[#040d1d]/60 px-2.5 py-2.5 text-left text-white transition-colors hover:border-gray-700 hover:bg-[#020711]"
      >
        {/* Avatar con inicial */}
        <span className="flex size-7 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-emerald-500/20 to-teal-500/10 text-base font-bold text-emerald-300 ring-1 ring-emerald-500/30">
          {firstLetter}
        </span>

        {/* Nombre y email */}
        <div className="flex min-w-0 flex-1 flex-col leading-tight">
          <span className="truncate text-sm font-semibold text-white">
            {userName}
          </span>
          <span className="-mt-0.5 truncate text-xs text-gray-400">
            {userEmail}
          </span>
        </div>

        {/* Chevron expandir/colapsar */}
        <ChevronRight
          className={`size-4 shrink-0 text-gray-500 transition-all duration-200 group-hover:text-gray-300 ${
            menuOpen ? 'rotate-180 text-gray-300' : ''
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <div
          role="menu"
          className="absolute right-3 bottom-0 left-3 z-50 mb-2 shrink-0 translate-x-[102%] overflow-hidden rounded-2xl border border-gray-700/80 bg-[#020711] shadow-2xl ring-1 shadow-black/40 ring-black/5"
        >
          {/* Header del menu */}
          <div className="flex items-center gap-3 border-b border-gray-800/70 bg-[#040d1d]/50 px-4 py-4">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-linear-to-br from-emerald-500/20 to-teal-500/10 text-base font-bold text-emerald-300 ring-1 ring-emerald-500/30">
              {firstLetter}
            </span>

            {/* Nombre y email */}
            <div className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="truncate text-sm font-semibold text-white">
                {userName}
              </span>
              <span className="-mt-0.5 truncate text-xs text-gray-400">
                {userEmail}
              </span>
            </div>
          </div>

          {/* Opciones del menu */}
          <div className="flex flex-col gap-0.5 px-1.5 py-1.5">
            {/* Perfil */}
            <Link
              href="/admin/configuracion"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-colors hover:bg-[#0b1426] hover:text-white"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-gray-800/60 text-gray-400 transition-colors group-hover:bg-gray-700/70 group-hover:text-gray-200">
                <User className="size-4" />
              </span>
              Mi Perfil
            </Link>

            {/* Separador */}
            <div className="my-1 h-px bg-gray-800/70" />

            {/* Cerrar Sesión */}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              disabled={status !== 'authenticated'}
              className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300 disabled:opacity-50 disabled:hover:bg-transparent"
            >
              <span className="flex size-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 transition-colors group-hover:bg-rose-500/15">
                <LogOut className="size-4" />
              </span>
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
