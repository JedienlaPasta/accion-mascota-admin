export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeAll = (str?: string) => {
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

export const formatPhone = (phone?: string | number) => {
  if (!phone) return '';
  let phoneStr = phone.toString();
  // Eliminar cualquier caracter no numérico excepto el +
  phoneStr = phoneStr.replace(/[^+\d]/g, '');
  // Agregar +56 si no tiene código de país
  if (!phoneStr.startsWith('+')) {
    // Si empieza con 0, quitarlo primero
    if (phoneStr.startsWith('0')) {
      phoneStr = phoneStr.slice(1);
    }
    phoneStr = '+56' + phoneStr;
  }
  // Formatear con espacios
  return phoneStr.replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
};

export const formatNumber = (num: number | string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatRUT = (rut: string | number) => {
  if (!rut) return '';
  const dv = rut.toString().slice(-1);
  const sub = rut.toString().slice(0, -1);
  return formatNumber(sub) + '-' + dv;
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatShortDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};
