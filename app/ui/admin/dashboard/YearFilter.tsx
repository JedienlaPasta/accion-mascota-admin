'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SecondaryButton } from '../../components/Button';

export default function YearFilter({
  defaultYear,
  years,
}: {
  defaultYear?: string;
  years?: string[];
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentYear = new Date().getFullYear();
  const yearParam = searchParams.get('year');
  // Por defecto toma el año actual
  const activeYear = yearParam || defaultYear || currentYear.toString();

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams);
    if (year === (defaultYear || currentYear.toString())) {
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
      <SecondaryButton
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-slate-500"
      >
        <Calendar className="h-4 w-4" />
        <span className="text-xs font-medium text-slate-700 tabular-nums">
          {activeYear}
        </span>
      </SecondaryButton>

      {/* Dropdown */}
      {isOpen && (
        <div className="ring-opacity-5 absolute top-full left-1/2 z-100 mt-1 max-h-40 w-48 -translate-x-5/7 overflow-hidden rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <div className="mb-1 px-2 py-1 text-[10px] font-semibold text-slate-400 uppercase">
            Año Entrega
          </div>

          <div className="my-1 border-t border-slate-100" />

          <div className="overflow-autos grid max-h-28 grid-cols-3">
            {years?.map((year) => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className="px-2s flex w-full cursor-pointer items-center justify-center rounded-md py-2 text-center text-xs tabular-nums hover:bg-slate-100"
              >
                <span
                  className={`${year === activeYear ? 'font-medium text-blue-600' : 'text-slate-700'}`}
                >
                  {year}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
