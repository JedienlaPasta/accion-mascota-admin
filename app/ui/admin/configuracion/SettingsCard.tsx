import type { ComponentType } from 'react';

type SettingsCardProps = {
  title: string;
  description?: string;
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
};

export function SettingsCard({
  title,
  description,
  icon: Icon,
  children,
  className,
}: SettingsCardProps) {
  return (
    <section
      className={`flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${className ?? ''}`}
    >
      <header className="mb-5 flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-600">
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}

type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  icon?: ComponentType<{ className?: string }>;
};

export function InfoRow({ label, value, icon: Icon }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="flex items-center gap-2 text-sm text-slate-500">
        {Icon && <Icon className="size-4 text-slate-400" />}
        {label}
      </span>
      <span className="truncate text-sm font-medium text-slate-800">
        {value}
      </span>
    </div>
  );
}
