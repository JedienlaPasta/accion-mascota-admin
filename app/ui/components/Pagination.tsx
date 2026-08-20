'use client';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

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

  const navigateToPage = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber?.toString());
    const url = `${pathname}?${params.toString()}`;

    if (preserveScroll) {
      router.replace(url, { scroll: false });
    } else {
      router.push(url);
    }
  };

  const pageNumber: number[] = [];
  for (let i = 1; i <= pages; i++) {
    pageNumber.push(i);
  }

  const visiblePagesArray = pageNumber.filter((numero) => {
    if ((currentPage === 1 || currentPage === 2) && numero < 6) {
      return true;
    }
    if (
      (currentPage === pages - 1 || currentPage === pages) &&
      numero > pages - 5
    ) {
      return true;
    }
    if (
      numero === currentPage ||
      (numero < currentPage && numero > currentPage - 3) ||
      (numero > currentPage && numero < currentPage + 3)
    ) {
      return true;
    } else {
      return false;
    }
  });

  const arrayPaginas = visiblePagesArray.map((numero, index) => (
    <li key={index}>
      <button
        onClick={() => navigateToPage(numero)}
        className={`${numero === currentPage ? 'bg-linear-to-r from-slate-700 to-slate-800 text-white' : 'bg-white hover:bg-slate-200'} text-slate-600" flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-xs`}
      >
        {numero}
      </button>
    </li>
  ));

  const calcularCambioPagina = (direction: 'right' | 'left') => {
    if (direction === 'left') {
      if (currentPage > 1) {
        return currentPage - 1;
      } else {
        return 1;
      }
    } else {
      if (currentPage < pages) {
        return currentPage + 1;
      } else {
        return pages || 1;
      }
    }
  };

  return (
    <nav
      className="flex items-center justify-end border-t border-gray-200/70 bg-white px-4 sm:px-0"
      aria-label="Pagination"
    >
      <ul className="flex gap-2 p-2">
        {/* First Page */}
        <li>
          <button
            onClick={() => navigateToPage(1)}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-600"
          >
            <ChevronsLeft className="size-4" />
          </button>
        </li>
        {/* Arrow Left */}
        <li>
          <button
            onClick={() => navigateToPage(calcularCambioPagina('left'))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-600"
          >
            <ChevronLeft className="size-4" />
          </button>
        </li>
        {/* Visible Pages */}
        {arrayPaginas}

        {/* Arrow Right */}
        <li>
          <button
            onClick={() => navigateToPage(calcularCambioPagina('right'))}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-600"
          >
            <ChevronRight className="size-4" />
          </button>
        </li>
        {/* Last Page */}
        <li>
          <button
            onClick={() =>
              navigateToPage(pageNumber[pageNumber.length - 1] || 1)
            }
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-200 hover:text-slate-600"
          >
            <ChevronsRight className="size-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
