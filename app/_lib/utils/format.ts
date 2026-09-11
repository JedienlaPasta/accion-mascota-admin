export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeAll = (str: string) => {
  if (!str) return '';

  const ignoredWords = [
    'el',
    'la',
    'los',
    'las',
    'de',
    'del',
    'y',
    'o',
    'en',
    'con',
  ];

  return str
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
    .split(' ')
    .map((word, index) => {
      if (index === 0) return capitalize(word);
      if (word.length < 3 || ignoredWords.includes(word)) {
        return word;
      }
      return capitalize(word);
    })
    .join(' ');
};

export const formatFileSize = (size: number) => {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const unitIndex = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, unitIndex)).toFixed(2)} ${units[unitIndex]}`;
};

export const formatPhone = (phone: string | null) => {
  if (!phone) return '';
  // Eliminar cualquier caracter no numérico excepto el +
  phone = phone.replace(/[^+\d]/g, '');
  // Formatear con espacios
  return phone.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
};

export const formatNumber = (num: number | string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatRUT = (raw: string | number) => {
  if (!raw) return '';

  const clean = raw
    .toString()
    .replace(/[^0-9kK]/g, '')
    .toUpperCase();
  if (!clean) return '';
  if (clean.length <= 1) return clean;

  const dv = clean.slice(-1);
  const sub = clean.slice(0, -1);
  return formatNumber(sub) + '-' + dv;
};

// ========= Helpers internos para fechas =========
const ONLY_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TZ_CL = 'America/Santiago';

// Parser seguro que NUNCA desfasa el día.
const safeParseDate = (
  input: string | Date | null | undefined
): Date | null => {
  if (!input) return null;
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : input;
  }
  const str = String(input).trim();
  if (!str) return null;

  // Caso Date: YYYY-MM-DD
  if (ONLY_DATE_RE.test(str)) {
    // Construye la fecha a LAS 12:00 horas
    const [yearS, monthS, dayS] = str.split('-');
    const y = Number(yearS);
    const m = Number(monthS) - 1;
    const d = Number(dayS);
    const out = new Date(y, m, d, 12, 0, 0, 0);
    return Number.isNaN(out.getTime()) ? null : out;
  }

  // Caso Timestamptz
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? null : d;
};

// ========= Funciones especificas para tipo Date/Timestamptz =========

// Para formatear solo fecha, sin hora
export const formatOnlyDate = (
  dateInput: string | Date | null | undefined,
  opts: { style?: 'long' | 'short' } = {}
) => {
  const d = safeParseDate(dateInput);
  if (!d) return '—';
  const style = opts.style ?? 'long';
  return d.toLocaleDateString('es-CL', {
    timeZone: TZ_CL,
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
};

// Para formatear fecha con hora, en America/Santiago (TZ)
export const formatDateTimeTz = (
  dateInput: string | Date | null | undefined
) => {
  const d = safeParseDate(dateInput);
  if (!d) return '—';
  return d.toLocaleString('es-CL', {
    timeZone: TZ_CL,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

// Para formatear solo fecha, sin hora en America/Santiago (TZ)
export const formatTzAsDate = (
  dateInput: string | Date | null | undefined,
  opts: { style?: 'long' | 'short' } = {}
) => {
  const d = safeParseDate(dateInput);
  if (!d) return '—';
  const style = opts.style ?? 'short';
  return d.toLocaleDateString('es-CL', {
    timeZone: TZ_CL,
    day: 'numeric',
    month: style === 'long' ? 'long' : 'short',
    year: 'numeric',
  });
};

// ========= Funciones pendientes de quitar (o evaluar si quitar) =========

export const formatDate = (dateString: string | Date | null | undefined) => {
  const d = safeParseDate(dateString);
  if (!d) return '—';
  return d.toLocaleDateString('es-CL', {
    timeZone: ONLY_DATE_RE.test(String(dateString ?? '')) ? TZ_CL : undefined,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateWithTime = (
  dateString: string | Date | null | undefined
) => {
  const d = safeParseDate(dateString);
  if (!d) return '—';
  return d.toLocaleString('es-CL', {
    timeZone: TZ_CL,
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatShortDate = (
  dateString: string | Date | null | undefined
) => {
  const d = safeParseDate(dateString);
  if (!d) return '—';
  return d.toLocaleDateString('es-CL', {
    timeZone: ONLY_DATE_RE.test(String(dateString ?? '')) ? TZ_CL : undefined,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
