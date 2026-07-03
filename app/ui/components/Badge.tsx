'use client';
import { useState } from 'react';

type BadgeProps = {
  className?: string;
  children: React.ReactNode;
};

export default function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={`inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

type ToggleBadgeProps = {
  children: React.ReactNode;
  alternative: React.ReactNode;
};

export function ToggleBadge({
  children,
  alternative,
  ...props
}: ToggleBadgeProps) {
  const [isActive, setIsActive] = useState(false);
  return (
    <span
      data-slot="badge"
      onClick={() => setIsActive((prev) => !prev)}
      className={`inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all ${isActive ? 'bg-emerald text-white' : 'bg-background text-foreground'}`}
      {...props}
    >
      {isActive ? children : alternative}
    </span>
  );
}
