'use client';
import { Check, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type ActionsMenuProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
};

// Sin usar?
export default function ActionsMenu({
  value,
  onChange,
  options,
}: ActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const inputValue = selectedOption ? selectedOption.label : value;

  //   const filteredOptions = options.filter((opt) =>
  //     opt.label.toLowerCase().includes(inputValue.toLowerCase())
  //   );

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex flex-col" ref={dropdownRef}>
      <Settings
        onClick={toggleDropdown}
        className="peer relative z-10 size-8 rounded-full p-1.5 text-zinc-500/80 transition-colors hover:bg-zinc-200/40 hover:text-zinc-600/90"
      />

      {isOpen && options.length > 0 && (
        <div className="absolute top-full right-1/2 z-50 mt-1 w-fit translate-x-1/2 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-y-auto px-1 py-1">
            {options.map((option) => (
              <li
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`flex cursor-pointer items-center justify-between rounded-md px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                  value === option.value
                    ? 'bg-blue-50 font-medium text-blue-700/90'
                    : 'text-gray-700'
                }`}
              >
                {option.label}
                {value === option.value && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
