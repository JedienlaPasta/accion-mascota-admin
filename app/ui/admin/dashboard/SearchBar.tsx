'use client';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useRef } from 'react';
import { Loader, Search } from 'lucide-react';

type SearchBarProps = {
  placeholder: string;
};

export default function SearchBar({ placeholder }: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [isPending, startTransition] = useTransition();
  const [isDebouncing, setIsDebouncing] = useState(false);

  const handleSearch = useDebouncedCallback((query: string) => {
    setIsDebouncing(false);
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }, 500);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsDebouncing(true);
    handleSearch(e.target.value);
  };

  const showLoader = isDebouncing || isPending;

  return (
    <div
      className="flex h-10 min-w-52 flex-1 cursor-text items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 shadow-sm transition-all focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100"
      onClick={handleContainerClick}
    >
      <span className="relative flex size-4 items-center justify-center">
        <Search
          className={`absolute inset-0 size-4 text-zinc-400 transition-all duration-300 ${
            showLoader ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
          }`}
        />
        <Loader
          className={`${showLoader ? 'animate-loadspin' : ''} absolute inset-0 size-4 text-zinc-400 transition-all duration-300 ${
            showLoader ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />
      </span>
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        onChange={handleChange}
        defaultValue={searchParams.get('query')?.toString()}
        className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
      />
    </div>
  );
}
