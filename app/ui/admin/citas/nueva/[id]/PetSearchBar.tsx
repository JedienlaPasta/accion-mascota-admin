'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Loader, ScanSearch, Search } from 'lucide-react';

type SearchBarProps = {
  placeholder: string;
  searchBy: string;
  searchValue: string;
  setSearchValue: (value: string) => void;
  /** Notifica al parent cuando el search bar esta debouncing o esperando server response. */
  onLoadingChange?: (isSearching: boolean) => void;
};

export function PetSearchBar({
  placeholder,
  searchBy,
  searchValue,
  setSearchValue,
  onLoadingChange,
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isDebouncing, setIsDebouncing] = useState(false);

  const handleSearch = useDebouncedCallback((search: string) => {
    setIsDebouncing(false);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (search.trim()) {
      params.set('query', search.trim());
    } else {
      params.delete('query');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 500);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDebouncing(true);
    setSearchValue(e.target.value);
    handleSearch(e.target.value);
  };

  const showLoader = isDebouncing || isPending;

  // Notificar al parent cada vez que cambia el estado de carga.
  useEffect(() => {
    onLoadingChange?.(showLoader);
  }, [showLoader, onLoadingChange]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
        {searchBy === 'owner' ? (
          <Search
            className={`absolute size-4 transition-all duration-300 ${showLoader ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
          />
        ) : (
          <ScanSearch
            className={`absolute size-4 transition-all duration-300 ${showLoader ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
          />
        )}
        <Loader
          className={`absolute size-4 transition-all duration-300 ${showLoader ? 'animate-loadspin' : ''} ${
            showLoader ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />
      </div>

      <input
        autoFocus
        type="search"
        value={searchValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="block w-full rounded-xl border border-gray-200 bg-white py-3 pr-4 pl-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:outline-none"
        aria-label={
          searchBy === 'owner' ? 'Buscar por dueño' : 'Buscar por microchip'
        }
      />
    </div>
  );
}
