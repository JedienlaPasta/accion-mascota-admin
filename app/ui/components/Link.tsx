'use client';
import Link from 'next/link';
import * as React from 'react';

type LinkProps = React.ComponentProps<'a'> & {
  href: string;
  children: React.ReactNode;
  className?: string;
  hasIcon?: boolean;
};

export function CTALink({ hasIcon = true, href, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className="group shover:shadow-emerald-900/15 relative cursor-pointer overflow-hidden rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 px-6 py-4 text-lg font-black text-white shadow-lg transition-all duration-300 hover:scale-102 active:scale-95 md:px-10"
    >
      {/* Overlay gradiente para hover con transición suave */}
      <div className="absolute inset-0 bg-linear-to-bl from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center justify-center gap-2">
        {hasIcon && (
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
        )}
        <span>{props.children}</span>
      </div>
    </Link>
  );
}

export function MutedCTALink({ hasIcon = true, href, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className="relative cursor-pointer rounded-2xl bg-gray-100 px-6 py-4 text-lg font-black text-gray-600 shadow-lg ring-2 ring-gray-300/90 transition-all duration-300 hover:scale-103 active:scale-95 md:px-10"
    >
      <span>{props.children}</span>
    </Link>
  );
}

// ====

export function BaseLink({ href, className, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className={`group relative flex h-12 min-w-48 cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-800/90 px-8 text-white shadow-lg transition-all duration-300 hover:bg-emerald-700 ${className}`}
    >
      {/* Overlay gradiente para hover con transición suave */}
      <div className="absolute inset-0 bg-linear-to-br from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex items-center justify-center gap-2">
        {props.children}
      </div>
    </Link>
  );
}

export function BaseMutedLink({ href, className, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className={`relative flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 font-medium text-gray-700 shadow-sm transition-shadow duration-300 hover:text-gray-900 hover:shadow-md ${className}`}
    >
      <div className="relative flex items-center justify-center gap-2">
        {props.children}
      </div>
    </Link>
  );
}

export function BaseRoundedLink({ href, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className="group relative flex h-11 cursor-pointer items-center rounded-full bg-emerald-800/90 px-8 font-medium text-white transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Overlay gradiente para hover con transición suave */}
      <div className="absolute inset-0 rounded-full bg-linear-to-bl from-emerald-600 via-emerald-700 to-emerald-800 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center justify-center gap-2">
        {props.children}
      </div>
    </Link>
  );
}

export function BaseRoundedMutedLink({ href, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className="group text-muted-foreground border-border relative flex h-11 cursor-pointer items-center rounded-full border bg-gray-100 px-8 font-medium transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Overlay gradiente para hover con transición suave */}
      <div className="absolute inset-0 rounded-full bg-linear-to-bl from-white via-gray-100 to-gray-200 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center justify-center gap-2">
        {props.children}
      </div>
    </Link>
  );
}

export function SmallBaseMutedLink({ href, className, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className="relative flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-xs font-medium text-gray-700 shadow-sm transition-shadow duration-300 hover:text-gray-900 hover:shadow-md"
    >
      <div className="relative flex items-center justify-center gap-2">
        {props.children}
      </div>
    </Link>
  );
}

export function LargeMutedBorderLink({ href, className, ...props }: LinkProps) {
  return (
    <Link
      href={href}
      className={`flex h-12 cursor-pointer items-center gap-2 rounded-xl bg-gray-100 px-7 font-medium text-gray-600 ring-2 ring-gray-300/90 transition-all duration-300 hover:bg-gray-50 hover:shadow-lg ${className}`}
    >
      {props.children}
    </Link>
  );
}

// ======
