'use client';
import { Calendar } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

type DropdownButtonProps = Omit<React.ComponentProps<'button'>, 'value'> & {
  className?: string;
  options: string[];
  onValueChange?: (value: string) => void;
  placeholder?: string;
};

export function FilterSelect({
  className,
  options,
  onValueChange,
}: DropdownButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const currentYear = searchParams.get('year') || options[0];
  const [optimisticValue, setOptimisticValue] = useState<string | null>(null);
  const displayValue = optimisticValue || currentYear;
  
  // Sincronizar optimisticValue cuando currentYear cambie (cuando la URL se actualice)
  useEffect(() => {
    if (optimisticValue === currentYear) {
      setOptimisticValue(null);
    }
  }, [currentYear, optimisticValue]);

  // Montaje del portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Calcular posición del dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedOnButton = buttonRef.current?.contains(target);
      const clickedOnMenu = menuRef.current?.contains(target);

      if (!clickedOnButton && !clickedOnMenu) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    // Usamos click (no mousedown) para que el evento de la opción se ejecute primero
    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelection = (nextValue: string) => {
    onValueChange?.(nextValue);
    if (!onValueChange) {
      setOptimisticValue(nextValue);
      const params = new URLSearchParams(searchParams);
      params.set('year', nextValue);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    setIsOpen(false);
  };

  const dropdownMenu =
    isOpen && mounted ? (
      <div
        ref={menuRef}
        role="menu"
        style={{
          position: 'absolute',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          zIndex: 9999,
        }}
        className="rounded-md border border-zinc-100 bg-white p-2 shadow-lg"
      >
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="menuitem"
            className={`w-full cursor-pointer rounded-md px-4 py-2 text-left text-xs text-zinc-600 tabular-nums hover:bg-zinc-100 ${
              option === currentYear
                ? 'bg-zinc-50 font-medium text-zinc-800'
                : ''
            }`}
            onClick={() => handleSelection(option)}
          >
            {option}
          </button>
        ))}
      </div>
    ) : null;

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => toggleDropdown()}
        className={`flex h-9 cursor-pointer items-center gap-2 border-y border-zinc-100 bg-white px-4 text-sm text-zinc-700 tabular-nums shadow-sm transition-shadow duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <Calendar className="h-4 w-4 shrink-0" />
        {displayValue}
      </button>

      {mounted && createPortal(dropdownMenu, document.body)}
    </div>
  );
}
