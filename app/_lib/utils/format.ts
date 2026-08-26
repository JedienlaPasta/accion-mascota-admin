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

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatDateWithTime = (dateString: string) => {
  if (!dateString) return '—';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

export const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
