import dayjs from 'dayjs';

export const getDaysBetween = (start: string, end: string) => {
  const startDate = dayjs(start).startOf('day');
  const endDate = dayjs(end).startOf('day');

  const dates = [];
  let current = startDate;

  while (current.isBefore(endDate.add(1, 'day'))) {
    dates.push(current.clone());
    current = current.add(1, 'day');
  }

  return dates;
};

export const getYearsBetween = (start: string, end: string) => {
  const startYear = parseInt(start);
  const endYear = parseInt(end);
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year.toString());
  }

  return years;
};

export const getAge = (fechaNacimiento: string) => {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  const diff = hoy.getTime() - nacimiento.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30)
  );
  if (years === 0) return `${months} meses`;
  return `${years} año${years > 1 ? 's' : ''} y ${months} mes${months > 1 ? 'es' : ''}`;
};
