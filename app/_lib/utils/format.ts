export const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
  return phone.toString().replace(/\B(?=(\d{4})+(?!\d))/g, ' ');
};

export const formatNumber = (num: number | string) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

export const formatRUT = (rut: string | number, dv: string) => {
  if (!rut) return '';
  return formatNumber(rut) + '-' + dv;
};
