'use client';

import { REPORT_TYPES } from '@/app/_lib/static-data/reportes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function ReportTypeSelector({
  activeType,
}: {
  activeType: string;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tipo', value);
    replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {REPORT_TYPES.map(({ value, label, enabled, Icon }) => {
        const isActive = value === activeType;
        return (
          <button
            key={value}
            type="button"
            disabled={!enabled}
            onClick={() => handleChange(value)}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/60'
                : enabled
                  ? 'border-gray-200 bg-white text-slate-600 hover:border-gray-300 hover:bg-gray-50'
                  : 'cursor-not-allowed border-dashed border-gray-200 bg-gray-50 text-gray-300'
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}
