'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

type InputProps = {
  label?: string;
  nombre: string;
  type?: string;
  pattern?: string;
  value?: string;
  min?: string;
  readonly?: boolean;
  required?: boolean;
  showIsRequired?: boolean;
  placeHolder?: string;
  labelStyle?: string;
  maxLength?: number;
  setData?: (prevState: string) => void;
};

export default function Input({
  label,
  nombre,
  type,
  pattern,
  value,
  readonly,
  placeHolder,
  labelStyle = 'ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase',
  maxLength,
  required,
  showIsRequired = true,
  setData,
}: InputProps) {
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
        required={required}
        id={label}
        name={nombre}
        type={type}
        readOnly={readonly}
        pattern={pattern}
        autoComplete="off"
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
        onWheel={(e) => e.preventDefault()}
        maxLength={
          maxLength ? maxLength : label === 'Código Campaña' ? 2 : undefined
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-gray-700 shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
      />
    </div>
  );
}

export function SafeNumberInput({
  label,
  nombre,
  pattern,
  value,
  min,
  readonly,
  placeHolder,
  labelStyle = 'ml-1 mb-1 flex justify-between text-[10px] font-bold text-slate-500 uppercase',
  maxLength,
  required,
  showIsRequired = true,
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
        min={min}
        // onWheel={(e) => e.preventDefault()}
        maxLength={
          maxLength ? maxLength : label === 'Código Campaña' ? 2 : undefined
        }
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-gray-700 shadow-sm transition-all outline-none placeholder:text-[13px] placeholder:text-gray-400 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100"
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
        className="h-20 w-full rounded-xl border border-slate-200 bg-white pt-2 pr-10 pl-4 text-sm text-gray-700 shadow-sm transition-all outline-none placeholder:text-gray-400"
      />
    </div>
  );
}
