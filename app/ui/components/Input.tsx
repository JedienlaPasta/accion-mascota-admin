'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

type InputProps = {
  label?: string;
  nombre: string;
  type?: string;
  pattern?: string;
  value?: string;
  readonly?: boolean;
  required?: boolean;
  showIsRequired?: boolean;
  placeHolder?: string;
  labelStyle?: string;
  min?: string;
  minLength?: number;
  maxLength?: number;
  onBlurCapture?: () => void;
  setData?: (prevState: string) => void;
};

export default function Input({
  label,
  nombre,
  type,
  pattern,
  value,
  readonly,
  required,
  showIsRequired = true,
  placeHolder,
  labelStyle = 'ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase',
  minLength,
  maxLength,
  onBlurCapture,
  setData,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setData) {
      setData(e.target.value);
    }
  };

  return (
    <div className="flex grow flex-col">
      {label && (
        <label className={labelStyle}>
          <span>
            {label}
            {showIsRequired &&
              (required ? (
                <span className="text-xs font-normal text-red-500"> *</span>
              ) : (
                <span className="text-[10px] font-normal text-slate-400">
                  {' '}
                  (opcional)
                </span>
              ))}
          </span>
          {type === 'password' && (
            <Link href="#" className="text-primary text-[10px] hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          )}
        </label>
      )}
      <input
        ref={inputRef}
        required={required}
        id={label}
        name={nombre}
        type={type}
        readOnly={readonly}
        pattern={pattern}
        onBlurCapture={onBlurCapture}
        autoComplete="off"
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
        onWheel={(e) => e.preventDefault()}
        minLength={minLength}
        maxLength={maxLength}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-gray-700 shadow-sm shadow-gray-200 transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
      />
    </div>
  );
}

export function SafeNumberInput({
  label,
  nombre,
  pattern,
  value,
  readonly,
  required,
  showIsRequired = true,
  placeHolder,
  labelStyle = 'ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase',
  minLength,
  maxLength,
  setData,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // SI el input tiene el foco, prevenir que el scroll cambie el valor
      if (document.activeElement === inputRef.current) {
        e.preventDefault();
      }
    };

    const currentInput = inputRef.current;
    if (currentInput) {
      // passive: false es la clave para que preventDefault funcione siempre
      currentInput.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (currentInput) {
        currentInput.removeEventListener('wheel', handleWheel);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (setData) {
      setData(e.target.value);
    }
  };

  return (
    <div className="flex grow flex-col">
      {label && (
        <label className={labelStyle}>
          <span>
            {label}
            {showIsRequired &&
              (required ? (
                <span className="text-xs font-normal text-red-500"> *</span>
              ) : (
                <span className="text-[10px] font-normal text-slate-400">
                  {' '}
                  (opcional)
                </span>
              ))}
          </span>
        </label>
      )}
      <input
        ref={inputRef}
        required={required}
        id={label}
        name={nombre}
        type="number"
        readOnly={readonly}
        pattern={pattern}
        autoComplete="off"
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
        // min={min}
        // onWheel={(e) => e.preventDefault()}
        maxLength={maxLength}
        className="h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-gray-700 shadow-sm shadow-gray-200 transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
      />
    </div>
  );
}

export function TextArea({
  label,
  nombre,
  value,
  readonly,
  placeHolder,
  labelStyle = 'ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase',
  maxLength,
  required,
  showIsRequired = true,
  setData,
}: InputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (setData) {
      setData(e.target.value);
    }
  };

  return (
    <div className="flex grow flex-col">
      {label && (
        <label className={labelStyle}>
          <span>
            {label}
            {showIsRequired &&
              (required ? (
                <span className="text-xs font-normal text-red-500"> *</span>
              ) : (
                <span className="text-[10px] font-normal text-slate-400">
                  {' '}
                  (opcional)
                </span>
              ))}
          </span>
        </label>
      )}
      <textarea
        required={required}
        id={label}
        name={nombre}
        readOnly={readonly}
        autoComplete="off"
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
        onWheel={(e) => e.preventDefault()}
        maxLength={
          maxLength ? maxLength : label === 'Código Campaña' ? 2 : undefined
        }
        className="h-20 w-full rounded-lg border border-slate-200 bg-white pt-2 pr-10 pl-4 text-sm text-gray-700 shadow-sm transition-all outline-none placeholder:text-gray-400"
      />
    </div>
  );
}

type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  label?: string;
  nombre: string;
  value?: string;
  readonly?: boolean;
  disabled?: boolean;
  required?: boolean;
  showIsRequired?: boolean;
  placeHolder?: string;
  labelStyle?: string;
  options?: SelectOption[];
  setData?: (value: string) => void;
};

export function Select({
  label,
  nombre,
  value,
  readonly,
  disabled,
  required,
  showIsRequired = true,
  placeHolder,
  labelStyle = 'ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase',
  options = [],
  setData,
}: SelectProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (setData) setData(e.target.value);
  };

  return (
    <div className="flex grow flex-col">
      {label && (
        <label className={labelStyle} htmlFor={label}>
          <span>
            {label}
            {showIsRequired &&
              (required ? (
                <span className="text-xs font-normal text-red-500"> *</span>
              ) : (
                <span className="text-[10px] font-normal text-slate-400">
                  {' '}
                  (opcional)
                </span>
              ))}
          </span>
        </label>
      )}
      <div className="relative">
        <select
          required={required}
          id={label}
          name={nombre}
          disabled={disabled || readonly}
          value={value ?? ''}
          onChange={handleChange}
          onWheel={(e) => e.preventDefault()}
          className="h-11 w-full appearance-none rounded-lg border border-slate-200 bg-white pr-10 pl-4 text-sm text-gray-700 shadow-sm shadow-gray-200 transition-all outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 [&_option]:bg-white [&_option:not([disabled])]:text-gray-800"
        >
          {options.length === 0 && placeHolder ? (
            <option value="" disabled>
              {placeHolder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option
              key={`${opt.value}-${opt.label}`}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label}
            </option>
          ))}
        </select>
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-slate-400"
        >
          <svg
            className="size-4"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export type CheckboxCardProps = {
  label: string;
  description?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
};

export function CheckboxCard({
  label,
  description,
  checked = false,
  disabled = false,
  onChange,
  className = '',
}: CheckboxCardProps) {
  return (
    <label
      className={[
        'group flex w-full cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-all',
        'border-slate-200 bg-white shadow-sm hover:border-slate-300 hover:bg-slate-50',
        checked
          ? 'border-emerald-200 !bg-emerald-50 ring-1 ring-emerald-100 hover:!bg-emerald-50/80'
          : '',
        disabled ? 'cursor-not-allowed opacity-60 hover:bg-white' : '',
        className,
      ].join(' ')}
    >
      <span
        className={[
          'mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md border transition-all',
          checked
            ? 'border-emerald-600 bg-emerald-600 text-white shadow-sm'
            : 'border-slate-300 bg-white group-hover:border-slate-400',
          disabled ? 'opacity-70' : '',
        ].join(' ')}
      >
        {checked ? (
          <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M16.704 5.29a1 1 0 010 1.42l-7.5 7.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.42L8.5 12.08l6.79-6.79a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        ) : null}
      </span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-bold text-gray-900 leading-snug">{label}</p>
        {description ? (
          <p className="text-xs text-gray-500 leading-relaxed">
            {description}
          </p>
        ) : null}
      </div>
    </label>
  );
}
