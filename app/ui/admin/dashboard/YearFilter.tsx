'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Calendar, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function YearFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const yearParam = searchParams.get('year');
  // Por defecto toma el año actual
  const activeYear = yearParam || currentYear.toString();

  const startYear = 2019;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) =>
    (currentYear - i).toString()
  );

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams);
    if (year === currentYear.toString()) {
      params.delete('year');
    } else {
      params.set('year', year);
    }

    replace(`${pathname}?${params.toString()}`, { scroll: false });
    setIsOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mouseup', handleClickOutside);
    return () => {
      document.removeEventListener('mouseup', handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-50 flex items-center">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 shadow-sm transition-colors hover:border-blue-200"
      >
        <Calendar className="h-4 w-4 text-slate-500" />
        <span className="text-xs font-medium text-blue-600">{activeYear}</span>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="ring-opacity-5 absolute top-full left-0 z-100 mt-2 max-h-40 w-36 overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <div className="mb-2 px-2 py-1 text-xs font-semibold text-slate-400 uppercase">
            Año Entrega
          </div>

          <div className="my-1 border-t border-slate-100" />

          <div className="max-h-28 overflow-auto">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-2 text-left text-sm text-slate-700 tabular-nums hover:bg-slate-50"
              >
                <span>{year}</span>
                {year === activeYear && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
