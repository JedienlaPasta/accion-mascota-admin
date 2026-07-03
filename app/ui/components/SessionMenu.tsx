import { logout } from '@/app/_lib/actions/auth';
import { ChevronDown, LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { JSX, useEffect, useRef, useState } from 'react';

type navLinks = {
  href: string;
  label: string;
  icon?: JSX.Element;
};

type SessionMenuProps = {
  authenticatedNavLinks?: navLinks[];
  setMobileMenuOpen: (open: boolean) => void;
};

export default function SessionMenu({
  authenticatedNavLinks,
  setMobileMenuOpen,
}: SessionMenuProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!userMenuOpen) return;

    const onPointerDown = (e: PointerEvent) => {
      const el = userMenuRef.current;
      if (!el) return;
      if (e.target instanceof Node && !el.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [userMenuOpen]);

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await logout();
    await signOut({ redirectTo: '/' });
  };

  const userName = session?.user?.name?.split(' ')[0] || 'Gestion Interna';

  return (
    <div className="relative flex w-fit items-center gap-2">
      {/* Menu de navegacion normal para Desktop (Dropdown) */}
      <div className="hidden md:block" ref={userMenuRef}>
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 rounded-full border border-zinc-200/70 bg-gray-50 py-1 pr-3 pl-1 text-zinc-800 transition-colors"
          aria-haspopup="menu"
          aria-expanded={userMenuOpen}
          onClick={() => setUserMenuOpen((prev) => !prev)}
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-emerald-800/80 text-sm font-bold text-zinc-50 uppercase">
            {userName.charAt(0)}
          </span>
          <ChevronDown className="size-4 text-zinc-400" />
        </button>

        {/* Navegacion Portal */}
        {userMenuOpen && (
          <div
            role="menu"
            className="absolute top-full right-0 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-200 bg-white px-2 shadow-lg shadow-gray-700/20"
          >
            <div className="mb-2 border-b border-zinc-200 px-2 py-3">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {session?.user?.name}
              </p>
              <p className="truncate text-[11px] text-zinc-500">
                {session?.user?.email ||
                  `${userName.split(' ')[0].toLowerCase()}@example.com`}
              </p>
            </div>

            {/* Navegacion Portal */}
            {status === 'authenticated' &&
              authenticatedNavLinks &&
              authenticatedNavLinks.length > 0 && (
                <div className="mb-2 flex flex-col gap-1 border-b border-zinc-200 pb-2">
                  <h3 className="ml-2 text-[10px] text-zinc-500">MI PORTAL</h3>
                  {authenticatedNavLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 rounded-lg px-2 py-2 text-[13px] text-slate-700 transition-colors hover:bg-slate-100/90 hover:text-slate-800"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className="mb-2 flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-rose-600 transition-colors hover:bg-rose-50/60"
            >
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
