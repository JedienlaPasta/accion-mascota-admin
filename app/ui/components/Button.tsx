'use client';
import { signIn } from 'next-auth/react';
import * as React from 'react';

type ButtonProps = React.ComponentProps<'button'> & {
  className?: string;
  hasIcon?: boolean;
};

export function LoginButton({ ...props }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClick = () => {
    setIsLoading(true);
    signIn('keycloak', { callbackUrl: '/portal/mascotas' });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`group relative flex h-12 min-w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl font-semibold text-white shadow-lg shadow-gray-200 transition-all duration-300 ${isLoading ? 'cursor-not-allowed bg-emerald-900/50' : 'bg-emerald-800/90 hover:bg-emerald-700'}`}
    >
      {/* Overlay gradiente para hover */}
      {!isLoading && (
        <div className="absolute inset-0 rounded-xl bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {/* Spinner reemplaza el texto cuando carga */}
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-4 border-white/80 border-t-emerald-800/60" />
          </div>
        ) : (
          props.children
        )}
      </div>
    </button>
  );
}

export function RegisterButton({ ...props }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = React.useState(false);
  const handleClick = () => {
    setIsLoading(true);
    signIn(
      'keycloak',
      { callbackUrl: '/portal/mascotas' },
      { prompt: 'create' }
    );
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`group relative flex h-12 min-w-48 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-200/80 bg-white font-semibold text-gray-700 shadow-lg shadow-gray-200/50 transition-all duration-300 hover:border-gray-300/60 hover:bg-gray-50 ${isLoading ? 'cursor-not-allowed opacity-60' : ''}`}
    >
      {/* Overlay para hover */}
      {!isLoading && (
        <div className="absolute inset-0 rounded-xl bg-gray-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {/* Spinner reemplaza el texto cuando carga */}
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="size-5 animate-spin rounded-full border-4 border-gray-200 border-t-gray-600" />
          </div>
        ) : (
          props.children
        )}
      </div>
    </button>
  );
}

export function CTAButtonLogin({ ...props }: { children: React.ReactNode }) {
  return (
    <button
      onClick={() => signIn('keycloak', { callbackUrl: '/admin/mascotas' })}
      className="group shover:shadow-emerald-900/15 relative cursor-pointer overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 px-6 py-4 text-lg font-black text-white shadow-lg transition-all duration-300 hover:scale-102 active:scale-95 md:px-10"
    >
      {/* Overlay gradiente para hover con transición suave */}
      <div className="absolute inset-0 bg-linear-to-bl from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center justify-center gap-2">
        <svg
          className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>

        <span>{props.children}</span>
      </div>
    </button>
  );
}

export function MutedCTAButtonLogin({
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => signIn('keycloak', { callbackUrl: '/admin/mascotas' })}
      className="relative cursor-pointer rounded-2xl bg-gray-100 px-6 py-4 text-lg font-black text-gray-600 shadow-lg ring-2 ring-gray-300/90 transition-all duration-300 hover:scale-103 active:scale-95 md:px-10"
    >
      <span>{props.children}</span>
    </button>
  );
}

// ===============

export function Button({ className, onClick, ...props }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex h-12 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-800/90 px-8 text-white shadow-md transition-all duration-300 hover:bg-emerald-700 ${className}`}
    >
      <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {props.children}
      </div>
    </button>
  );
}

export function SecondaryButton({ className, ...props }: ButtonProps) {
  return (
    <button
      className={`flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium shadow-sm transition-colors hover:border-slate-300 ${className}`}
      {...props}
    />
  );
}

export function UploadSecondaryButton({ className, ...props }: ButtonProps) {
  return (
    <span
      className={`px-auto flex min-h-9 cursor-pointer items-center justify-center rounded-lg border border-zinc-100 text-gray-800 shadow-sm shadow-zinc-200 transition-shadow duration-300 hover:shadow-lg ${className}`}
      {...props}
    />
  );
}
