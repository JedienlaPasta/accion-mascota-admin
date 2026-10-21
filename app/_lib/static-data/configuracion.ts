export type ScheduleDay = { value: number; label: string; short: string };

export const SCHEDULE_DAYS: ScheduleDay[] = [
  { value: 1, label: 'Lunes', short: 'Lun' },
  { value: 2, label: 'Martes', short: 'Mar' },
  { value: 3, label: 'Miércoles', short: 'Mié' },
  { value: 4, label: 'Jueves', short: 'Jue' },
  { value: 5, label: 'Viernes', short: 'Vie' },
  { value: 6, label: 'Sábado', short: 'Sáb' },
  { value: 0, label: 'Domingo', short: 'Dom' },
];

export const ORG_INFO = {
  nombre: 'Municipalidad de Algarrobo',
  unidad: 'Acción Mascota',
  comuna: 'Algarrobo',
  region: 'Región de Valparaíso',
  direccion: 'Av. Peñablanca 250, Algarrobo',
  telefono: '+56 35 2 480 000',
  correo: 'accionmascota@algarrobo.cl',
  sitioWeb: 'www.algarrobo.cl',
  zonaHoraria: 'America/Santiago',
};

export const APPOINTMENT_SCHEDULE_MOCK = {
  days: [1, 2, 3, 4, 5],
  startTime: '09:00',
  endTime: '17:00',
  slotMinutes: 30,
  maxPerSlot: 2,
};

export const PREFERENCES_MOCK = {
  theme: 'system',
  dateFormat: 'DD-MM-YYYY',
  density: 'comfortable',
  timezone: 'America/Santiago',
  emailNotifications: true,
  weeklySummary: false,
  autoReminders: true,
};

export const STAFF_MOCK = [
  {
    nombre: 'Soporte',
    rut: '11.111.111-1',
    cargo: 'Soporte',
    permisos: 'administrador',
    estado: true,
  },
  {
    nombre: 'Sergio Muñoz',
    rut: '22.222.222-2',
    cargo: 'Médico Veterinario',
    permisos: 'veterinario',
    estado: true,
  },
  {
    nombre: 'Carla González Godoy',
    rut: '33.333.333-3',
    cargo: 'Médico Veterinario',
    permisos: 'veterinario',
    estado: true,
  },
  {
    nombre: 'Ángela Moragues Muñoz',
    rut: '44.444.444-4',
    cargo: 'Médico Veterinario',
    permisos: 'veterinario',
    estado: false,
  },
];

export const PROCEDURES_MOCK = [
  { codigo: 'OCTUPLE', nombre: 'Óctuple' },
  { codigo: 'ANTIRRABICA', nombre: 'Antirrábica' },
  { codigo: 'TRIPLE_FELINA', nombre: 'Triple Felina' },
  { codigo: 'DE', nombre: 'Desparasitación Externa' },
  { codigo: 'DI', nombre: 'Desparasitación Interna' },
  { codigo: 'MICROCHIP', nombre: 'Implantación Microchip' },
  { codigo: 'VERIFICACION', nombre: 'Verificación' },
  { codigo: 'TRASPASO', nombre: 'Traspaso' },
];

export const SLOT_OPTIONS = [15, 20, 30, 45, 60];

export const TIME_OPTIONS: string[] = (() => {
  const out: string[] = [];
  for (let m = 8 * 60; m <= 20 * 60; m += 30) {
    const h = Math.floor(m / 60)
      .toString()
      .padStart(2, '0');
    const min = (m % 60).toString().padStart(2, '0');
    out.push(`${h}:${min}`);
  }
  return out;
})();
