import dayjs from 'dayjs';
import { Cat, Dog, LucideIcon, PawPrint } from 'lucide-react';

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
  const startYear = Number(start);
  const endYear = Number(end);
  const years: string[] = [];

  for (let year = endYear; year >= startYear; year--) {
    years.push(year.toString());
  }

  return years;
};

export const getAge = (fechaNacimiento: string) => {
  const nacimiento = new Date(fechaNacimiento);
  if (Number.isNaN(nacimiento.getTime())) return 'Edad desconocida';
  const hoy = new Date();
  const diff = hoy.getTime() - nacimiento.getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  const months = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24 * 30)
  );
  if (years === 0) return `${months} meses`;
  return `${years} año${years > 1 ? 's' : ''} y ${months} mes${months > 1 ? 'es' : ''}`;
};

export const getPetIcon = (especieRaw: string): LucideIcon => {
  const especie = especieRaw.trim().toUpperCase();
  if (especie === 'CANINO') {
    return Dog;
  }
  if (especie === 'FELINO') {
    return Cat;
  }
  return PawPrint;
};

export const getInitials = (nombre: string): string => {
  const clean = nombre.trim();
  if (!clean) return '';
  const parts = clean.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
