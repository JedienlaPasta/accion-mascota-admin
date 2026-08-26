'use client';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useRef } from 'react';

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
  /**
   * Función de formateo EN VIVO anti-saltos.
   * Recibe el valor raw sin formatear y la posición del cursor ANTES de cambiar.
   * Debe devolver { value: (string formateada), cursor: (posición del caret calculada) }.
   * Si se provee, el input preserva la posición relativa del caret para que no
   * haya "efecto de números que se corren" al insertar espacios/puntos/guiones.
   *
   * No usar para formatting pesado que agrega prefijos enteros mientras el usuario escribe;
   * eso debe quedar para blur/submit.
   */
  formatLiveValue?: (
    raw: string,
    cursorBefore: number
  ) => { value: string; cursor: number };
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
  formatLiveValue,
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // En la próxima pintura, forzamos esta posición de caret (anti-saltos)
  const pendingCursorRef = useRef<number | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!setData) return;
    const raw = e.target.value;

    // Sin formateador live: comportamiento clásico (100% backward compat)
    if (!formatLiveValue) {
      setData(raw);
      return;
    }

    // Con formateador: calculamos valor + cursor ANTES del setState.
    const cursorBefore =
      typeof e.target.selectionStart === 'number'
        ? e.target.selectionStart
        : raw.length;
    const { value: formatted, cursor } = formatLiveValue(raw, cursorBefore);
    pendingCursorRef.current = cursor;
    setData(formatted);
  };

  // Pintamos el cursor justo después de que React aplique el nuevo value.
  useLayoutEffect(() => {
    const el = inputRef.current;
    if (el && pendingCursorRef.current !== null) {
      const pos = Math.min(pendingCursorRef.current, el.value.length);
      try {
        el.setSelectionRange(pos, pos);
      } catch {
        // input types number/email no soportan setSelectionRange en algunos browsers; ignorar.
      }
      pendingCursorRef.current = null;
    }
  }, [value]);

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
