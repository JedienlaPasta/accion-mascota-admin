'use client';

import {
  Calendar,
  Cat,
  ClipboardList,
  Dog,
  FileCheck,
  MapPin,
  PawPrint,
  User,
} from 'lucide-react';
import type { ComponentType } from 'react';

const cardIcons: Record<string, ComponentType<{ className?: string }>> = {
  calendar: Calendar,
  paw: PawPrint,
  user: User,
  month: FileCheck,
  cat: Cat,
  dog: Dog,
  mapPin: MapPin,
  report: ClipboardList,
};

type SummaryCardProps = {
  title: string;
  value: number;
  icon: keyof typeof cardIcons;
};

export default function SummaryCard({ title, value, icon }: SummaryCardProps) {
  const Icon = cardIcons[icon];

  return (
    <div className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
      <div className="flex min-w-0 flex-col justify-center">
        <h3 className="text-muted-foreground truncate text-xs font-semibold tracking-wide">
          {title}
        </h3>
        <p className="text-3xl font-bold tracking-tight text-zinc-700">
          {value.toLocaleString('es-CL')}
        </p>
      </div>

      <div className="bg-linear-to-brs from-emerald-400s to-emerald-600s text-emerald-50s flex size-11 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
        <Icon className="size-7" />
      </div>
    </div>
  );
}
