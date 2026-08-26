'use client';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';

export default function Pagination({
  pages,
  preserveScroll = true,
}: {
  pages: number;
  preserveScroll?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number(searchParams.get('page')) || 1;

  const totalPages = Math.max(1, pages || 1);
  const atFirst = currentPage <= 1;
  const atLast = currentPage >= totalPages;

  const navigateToPage = (pageNumber: number | string) => {
    const target = Number(pageNumber);
    if (Number.isNaN(target) || target < 1 || target > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', String(target));
    const url = `${pathname}?${params.toString()}`;

    if (preserveScroll) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url);
    }
  };

  // Calcular paginas visibles + ellipsis
  type PageDisplayItem =
    | { type: 'page'; value: number }
    | { type: 'ellipsis'; value?: never };

  const displayItems = useMemo<PageDisplayItem[]>(() => {
    const delta = 1; // paginas vecinas a cada lado de current (1 = 3 visible)
    const range: number[] = [];

    // Siempre se muestra 1 y la ultima pagina.
    const withLeftEllipsis = currentPage - delta > 3;
    const withRightEllipsis = currentPage + delta < totalPages - 2;

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    const items: PageDisplayItem[] = [{ type: 'page', value: 1 }];
    if (withLeftEllipsis) items.push({ type: 'ellipsis' });

    for (const n of range) {
      if (n > 1 && n < totalPages) items.push({ type: 'page', value: n });
    }

    if (withRightEllipsis) items.push({ type: 'ellipsis' });
    if (totalPages > 1) items.push({ type: 'page', value: totalPages });
    return items;
  }, [currentPage, totalPages]);

  // Helpers (evita duplicar className strings)
  const btnBase =
    'flex h-9 w-9 items-center justify-center rounded-lg border text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-1';
  const btnEnabled =
    'cursor-pointer border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900';
  const btnDisabled =
    'pointer-events-none cursor-not-allowed border-slate-100 bg-slate-50/50 text-slate-300 opacity-60';
  const btnActive =
    'cursor-pointer border-slate-700 bg-gradient-to-r from-slate-700 to-slate-800 text-white shadow-sm';

  return (
    <nav
      className="flex items-center justify-center bg-white"
      aria-label="Pagination"
    >
      <ul className="flex flex-wrap items-center gap-1.5 py-2 sm:gap-2">
        {/* << */}
        <li>
          <button
            type="button"
            onClick={() => navigateToPage(1)}
            disabled={atFirst}
            aria-disabled={atFirst}
            aria-label="Ir a la primera página"
            className={`${btnBase} ${atFirst ? btnDisabled : btnEnabled}`}
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
        </li>

        {/* < */}
        <li>
          <button
            type="button"
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={atFirst}
            aria-disabled={atFirst}
            aria-label="Ir a la página anterior"
            className={`${btnBase} ${atFirst ? btnDisabled : btnEnabled}`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </li>

        {/* 📄 Paginas visibles + … ellipsis */}
        {displayItems.map((item, idx) =>
          item.type === 'ellipsis' ? (
            <li key={`ellipsis-${idx}`} aria-hidden="true">
              <span
                className={`${btnBase} ${btnDisabled} border-transparent bg-transparent`}
              >
                <MoreHorizontal className="h-4 w-4" />
              </span>
            </li>
          ) : (
            <li key={`page-${item.value}`}>
              <button
                type="button"
                onClick={() => navigateToPage(item.value!)}
                aria-current={item.value === currentPage ? 'page' : undefined}
                aria-label={`Ir a la página ${item.value}`}
                className={`${btnBase} ${
                  item.value === currentPage ? btnActive : btnEnabled
                }`}
              >
                {item.value}
              </button>
            </li>
          )
        )}

        {/* > */}
        <li>
          <button
            type="button"
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={atLast}
            aria-disabled={atLast}
            aria-label="Ir a la página siguiente"
            className={`${btnBase} ${atLast ? btnDisabled : btnEnabled}`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </li>

        {/* >> */}
        <li>
          <button
            type="button"
            onClick={() => navigateToPage(totalPages)}
            disabled={atLast}
            aria-disabled={atLast}
            aria-label="Ir a la última página"
            className={`${btnBase} ${atLast ? btnDisabled : btnEnabled}`}
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
