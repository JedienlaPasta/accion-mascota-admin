'use client';
import { ChevronDown, Check } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Option = {
  value: string;
  label: string;
};

type DropdownProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  required?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  labelStyle?: string;
};

export default function Dropdown({
  label,
  value,
  onChange,
  options,
  required,
  readOnly,
  placeholder = 'Seleccionar o escribir...',
  labelStyle = 'ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase',
}: DropdownProps) {
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
    <div className="flex grow flex-col" ref={dropdownRef}>
      {label ? (
        <label className={labelStyle}>
          <span>
            {label}
            {/* {required ? (
            <span className="text-xs font-normal text-red-500"> *</span>
          ) : (
            <span className="text-[10px] font-normal text-slate-400">
              {' '}
              (opcional)
            </span>
          )} */}
            {required && (
              <span className="text-xs font-normal text-red-500"> *</span>
            )}
          </span>
        </label>
      ) : null}
      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onClick={() => setIsOpen(true)}
            placeholder={placeholder}
            readOnly={readOnly}
            className={`h-11 w-full rounded-xl border bg-white pr-10 pl-4 text-sm text-gray-700 shadow-sm transition-all outline-none placeholder:text-gray-400 ${
              isOpen
                ? 'border-blue-400 ring-2 ring-blue-100'
                : 'border-slate-200'
            } ${readOnly ? 'cursor-pointer' : ''}`}
          />
          <div
            onClick={toggleDropdown}
            className="absolute inset-y-0 right-0 flex cursor-pointer items-center px-3"
          >
            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </div>
        </div>

        {isOpen && options.length > 0 && (
          <div className="absolute top-full z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
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
    </div>
  );
}
