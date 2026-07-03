// Datos simulados para el mockup de la veterinaria municipal

import {
  AlertCircle,
  Cat,
  CheckCircle,
  Dog,
  PawPrint,
  Scissors,
  Stethoscope,
  Syringe,
} from 'lucide-react';

export const especieIcon: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  perro: Dog,
  gato: Cat,
  otro: PawPrint,
};

export const tipoIcon: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  consulta: Stethoscope,
  vacuna: Syringe,
  cirugia: Scissors,
  control: CheckCircle,
  emergencia: AlertCircle,
};

export const tipoLabels: Record<string, string> = {
  consulta: 'Consulta',
  vacuna: 'Vacunación',
  cirugia: 'Cirugía',
  control: 'Control',
  emergencia: 'Emergencia',
};

export const tipoColors: Record<
  string,
  { bg: string; text: string; ring: string; dot: string }
> = {
  consulta: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    ring: 'ring-blue-100',
    dot: 'bg-blue-500',
  },
  vacuna: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    ring: 'ring-green-100',
    dot: 'bg-green-500',
  },
  cirugia: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    ring: 'ring-amber-100',
    dot: 'bg-amber-500',
  },
  control: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    ring: 'ring-purple-100',
    dot: 'bg-purple-500',
  },
  emergencia: {
    bg: 'bg-red-50',
    text: 'text-red-600',
    ring: 'ring-red-100',
    dot: 'bg-red-500',
  },
};

export interface Usuario {
  id: string;
  nombre: string;
  rut: string;
  email: string;
  telefono: string;
  direccion: string;
  rol: 'ciudadano' | 'funcionario' | 'veterinario' | 'admin';
}

export interface Mascota {
  id: string;
  nombre: string;
  especie: 'perro' | 'gato' | 'otro';
  raza: string;
  fechaNacimiento: string;
  sexo: 'macho' | 'hembra';
  color: string;
  peso: string;
  descripcion: string;
  chip: string | null;
  esterilizado: boolean;
  foto: string;
  propietarioId: string;
  propietarioNombre: string;
}

export interface MascotaAdopcion {
  id: string;
  nombre: string;
  especie: 'perro' | 'gato';
  edadAprox: string; // ej: "Cachorro (3 meses)"
  sexo: 'macho' | 'hembra';
  tamaño: 'pequeño' | 'mediano' | 'grande';
  historia: string;
  salud: string[]; // ej: ["Vacunado", "Desparasitado", "Microchip"]
  imagenes: string[]; // Un array de imágenes para el perfil detallado
  estado: 'disponible' | 'en_proceso' | 'adoptado';
  fechaIngreso: string;
}

export interface HistorialClinico {
  id: string;
  mascotaId: string;
  fecha: string;
  tipo: 'consulta' | 'vacuna' | 'cirugia' | 'control' | 'emergencia';
  descripcion: string;
  diagnostico: string;
  tratamiento: string | null;
  veterinario: string;
  proximaVisita: string | null;
}

export interface Cita {
  id: string;
  mascotaId: string;
  mascotaNombre: string;
  propietarioId: string;
  fecha: string;
  hora: string;
  tipo: 'consulta' | 'vacuna' | 'esterilizacion' | 'control' | 'emergencia';
  estado: 'pendiente' | 'confirmada' | 'completada' | 'cancelada';
  notas: string;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number | 'gratuito';
  duracion: string;
  categoria: 'consulta' | 'vacunacion' | 'cirugia' | 'prevencion';
}

export interface Campana {
  id: string;
  titulo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  tipo: 'vacunacion' | 'esterilizacion' | 'desparasitacion' | 'chip';
  cuposDisponibles: number;
  gratuito: boolean;
}

// Usuario actual simulado (ciudadano)
export const usuarioActual: Usuario = {
  id: 'usr-001',
  nombre: 'María González Pérez',
  rut: '12.345.678-9',
  email: 'maria.gonzalez@email.cl',
  telefono: '+56 9 1234 5678',
  direccion: 'Av. Principal 123, Villa Los Aromos',
  rol: 'ciudadano',
};

// Funcionario simulado
export const funcionarioActual: Usuario = {
  id: 'func-001',
  nombre: 'Dr. Carlos Muñoz',
  rut: '11.222.333-4',
  email: 'carlos.munoz@municipalidad.cl',
  telefono: '+56 9 8765 4321',
  direccion: 'Veterinaria Municipal',
  rol: 'veterinario',
};

// Mascotas del usuario
export const mascotas: Mascota[] = [
  {
    id: 'pet-001',
    nombre: 'Luna',
    especie: 'perro',
    raza: 'Mestizo mediano',
    fechaNacimiento: '2021-03-15',
    sexo: 'hembra',
    color: 'Negro con manchas blancas',
    peso: '12kg',
    descripcion: 'Negro con manchas blancas',
    chip: '956000012345678',
    esterilizado: true,
    foto: '/pets/luna.jpg',
    propietarioId: 'usr-001',
    propietarioNombre: 'María González Pérez',
  },
  {
    id: 'pet-002',
    nombre: 'Michi',
    especie: 'gato',
    raza: 'Común europeo',
    fechaNacimiento: '2022-08-20',
    sexo: 'macho',
    color: 'Atigrado gris',
    peso: '1.5kg',
    descripcion: 'Atigrado gris',
    chip: '956000012345679',
    esterilizado: true,
    foto: '/pets/michi.jpg',
    propietarioId: 'usr-001',
    propietarioNombre: 'María González Pérez',
  },
  {
    id: 'pet-003',
    nombre: 'Rocky',
    especie: 'perro',
    raza: 'Labrador',
    fechaNacimiento: '2023-01-10',
    sexo: 'macho',
    color: 'Dorado',
    peso: '8kg',
    descripcion: 'Dorado',
    chip: null,
    esterilizado: false,
    foto: '/pets/rocky.jpg',
    propietarioId: 'usr-001',
    propietarioNombre: 'María González Pérez',
  },
];

// Historial clínico
export const historialClinico: HistorialClinico[] = [
  {
    id: 'hist-001',
    mascotaId: 'pet-001',
    fecha: '2025-12-15',
    tipo: 'consulta',
    descripcion: 'Consulta por decaimiento y pérdida de apetito',
    diagnostico: 'Gastritis leve',
    tratamiento: 'Omeprazol 10mg cada 12 horas por 7 días. Dieta blanda.',
    veterinario: 'Dr. Carlos Muñoz',
    proximaVisita: '2025-12-22',
  },
  {
    id: 'hist-002',
    mascotaId: 'pet-001',
    fecha: '2025-10-01',
    tipo: 'vacuna',
    descripcion: 'Vacunación antirrábica anual',
    diagnostico: 'Paciente sano, apto para vacunación',
    tratamiento: null,
    veterinario: 'Dra. Ana Soto',
    proximaVisita: '2026-10-01',
  },
  {
    id: 'hist-003',
    mascotaId: 'pet-001',
    fecha: '2024-06-20',
    tipo: 'cirugia',
    descripcion: 'Esterilización quirúrgica',
    diagnostico: 'Procedimiento exitoso sin complicaciones',
    tratamiento: 'Antibiótico por 5 días, reposo por 10 días, collar isabelino',
    veterinario: 'Dr. Carlos Muñoz',
    proximaVisita: '2024-06-30',
  },
  {
    id: 'hist-004',
    mascotaId: 'pet-002',
    fecha: '2025-11-10',
    tipo: 'control',
    descripcion: 'Control de rutina anual',
    diagnostico: 'Paciente en excelente estado de salud',
    tratamiento: null,
    veterinario: 'Dra. Ana Soto',
    proximaVisita: '2026-11-10',
  },
  {
    id: 'hist-005',
    mascotaId: 'pet-002',
    fecha: '2025-08-15',
    tipo: 'vacuna',
    descripcion: 'Vacuna triple felina',
    diagnostico: 'Paciente sano, apto para vacunación',
    tratamiento: null,
    veterinario: 'Dr. Carlos Muñoz',
    proximaVisita: '2026-08-15',
  },
  {
    id: 'hist-006',
    mascotaId: 'pet-003',
    fecha: '2025-09-05',
    tipo: 'vacuna',
    descripcion: 'Primera vacuna óctuple',
    diagnostico: 'Cachorro sano',
    tratamiento: 'Desparasitación interna',
    veterinario: 'Dra. Ana Soto',
    proximaVisita: '2025-10-05',
  },
];

// Citas
export const citas: Cita[] = [
  {
    id: 'cita-001',
    mascotaId: 'pet-001',
    mascotaNombre: 'Luna',
    propietarioId: 'usr-001',
    fecha: '2026-01-25',
    hora: '10:30',
    tipo: 'control',
    estado: 'confirmada',
    notas: 'Control post tratamiento gastritis',
  },
  {
    id: 'cita-002',
    mascotaId: 'pet-003',
    mascotaNombre: 'Rocky',
    propietarioId: 'usr-001',
    fecha: '2026-02-15',
    hora: '09:00',
    tipo: 'esterilizacion',
    estado: 'pendiente',
    notas: 'Campaña de esterilización gratuita - Requiere ayuno de 12 horas',
  },
];

// Servicios disponibles
export const servicios: Servicio[] = [
  {
    id: 'serv-001',
    nombre: 'Consulta General',
    descripcion:
      'Evaluación médica completa de tu mascota, diagnóstico y tratamiento',
    precio: 5000,
    duracion: '30 min',
    categoria: 'consulta',
  },
  {
    id: 'serv-002',
    nombre: 'Vacuna Antirrábica',
    descripcion: 'Vacunación obligatoria anual contra la rabia',
    precio: 'gratuito',
    duracion: '15 min',
    categoria: 'vacunacion',
  },
  {
    id: 'serv-003',
    nombre: 'Vacuna Óctuple Canina',
    descripcion: 'Protección contra moquillo, parvovirus, hepatitis y más',
    precio: 8000,
    duracion: '15 min',
    categoria: 'vacunacion',
  },
  {
    id: 'serv-004',
    nombre: 'Vacuna Triple Felina',
    descripcion:
      'Protección contra panleucopenia, rinotraqueítis y calicivirus',
    precio: 7000,
    duracion: '15 min',
    categoria: 'vacunacion',
  },
  {
    id: 'serv-005',
    nombre: 'Esterilización Canina',
    descripcion:
      'Cirugía de esterilización para perros. Incluye anestesia y medicamentos',
    precio: 25000,
    duracion: '1-2 horas',
    categoria: 'cirugia',
  },
  {
    id: 'serv-006',
    nombre: 'Esterilización Felina',
    descripcion:
      'Cirugía de esterilización para gatos. Incluye anestesia y medicamentos',
    precio: 20000,
    duracion: '1 hora',
    categoria: 'cirugia',
  },
  {
    id: 'serv-007',
    nombre: 'Desparasitación',
    descripcion: 'Tratamiento antiparasitario interno y externo',
    precio: 3000,
    duracion: '15 min',
    categoria: 'prevencion',
  },
  {
    id: 'serv-008',
    nombre: 'Implante de Microchip',
    descripcion:
      'Identificación permanente con registro en base de datos nacional',
    precio: 10000,
    duracion: '10 min',
    categoria: 'prevencion',
  },
];

// Campañas activas
export const campanas: Campana[] = [
  {
    id: 'camp-001',
    titulo: 'Esterilización Gratuita Febrero 2026',
    descripcion:
      'Campaña de esterilización gratuita para todos los vecinos de la comuna. Incluye cirugía, anestesia, medicamentos y control post operatorio.',
    fechaInicio: '2026-02-01',
    fechaFin: '2026-02-28',
    tipo: 'esterilizacion',
    cuposDisponibles: 150,
    gratuito: true,
  },
  {
    id: 'camp-002',
    titulo: 'Vacunación Antirrábica 2026',
    descripcion:
      'Campaña anual de vacunación antirrábica gratuita. Obligatoria para todos los perros y gatos de la comuna.',
    fechaInicio: '2026-03-01',
    fechaFin: '2026-03-31',
    tipo: 'vacunacion',
    cuposDisponibles: 500,
    gratuito: true,
  },
  {
    id: 'camp-003',
    titulo: 'Chip de Identificación',
    descripcion:
      'Campaña de implantación de microchip con precio preferencial para vecinos de la comuna.',
    fechaInicio: '2026-01-15',
    fechaFin: '2026-04-30',
    tipo: 'chip',
    cuposDisponibles: 200,
    gratuito: false,
  },
];

// Horarios de atención
export const horariosAtencion = {
  lunesJueves: { apertura: '08:30', cierre: '17:30' },
  viernes: { apertura: '08:30', cierre: '16:30' },
  sabado: null,
  domingo: null,
  festivos: null,
};

// Veterinarias de emergencia cercanas
export const veterinariasEmergencia = [
  {
    nombre: 'Clínica Veterinaria 24 Horas',
    direccion: 'Av. Central 456',
    telefono: '+56 2 2345 6789',
    horario: '24 horas',
    distancia: '2.3 km',
  },
  {
    nombre: 'Hospital Veterinario Regional',
    direccion: 'Calle Norte 789',
    telefono: '+56 2 3456 7890',
    horario: '24 horas',
    distancia: '4.1 km',
  },
  {
    nombre: 'Urgencias Veterinarias Sur',
    direccion: 'Av. Sur 321',
    telefono: '+56 2 4567 8901',
    horario: 'Lun-Dom 08:00-22:00',
    distancia: '3.5 km',
  },
];

export type PropietarioAdmin = Usuario & {
  contacto: string;
  correo: string;
  mascotas: number;
  registro: string;
};

export const propietariosAdmin: PropietarioAdmin[] = [
  {
    id: 'usr-001',
    nombre: 'María González Pérez',
    rut: '12345678-9',
    email: 'maria.gonzalez@example.com',
    telefono: '+56912345678',
    direccion: 'Av. Las Condes 123, Las Condes',
    rol: 'ciudadano',
    contacto: '+56912345678',
    correo: 'maria.gonzalez@example.com',
    mascotas: 2,
    registro: '14-03-2025',
  },
  {
    id: 'usr-002',
    nombre: 'Juan Pérez Silva',
    rut: '14567890-1',
    email: 'juan.perez@example.com',
    telefono: '+56987654321',
    direccion: 'Calle Los Olivos 456, Providencia',
    rol: 'ciudadano',
    contacto: '+56987654321',
    correo: 'juan.perez@example.com',
    mascotas: 1,
    registro: '19-05-2025',
  },
  {
    id: 'usr-003',
    nombre: 'Pedro Martínez Rojas',
    rut: '16789012-3',
    email: 'pedro.martinez@example.com',
    telefono: '+56912345678',
    direccion: 'Los Aromos 789, La Florida',
    rol: 'ciudadano',
    contacto: '+56912345678',
    correo: 'pedro.martinez@example.com',
    mascotas: 1,
    registro: '09-08-2025',
  },
  {
    id: 'usr-004',
    nombre: 'Carlos Rojas Díaz',
    rut: '11234567-8',
    email: 'carlos.rojas@example.com',
    telefono: '+56944444444',
    direccion: 'Av. Principal 101, Nunoa',
    rol: 'ciudadano',
    contacto: '+56944444444',
    correo: 'carlos.rojas@example.com',
    mascotas: 1,
    registro: '04-09-2025',
  },
  {
    id: 'usr-005',
    nombre: 'Lucia Fernandez Castro',
    rut: '15678901-2',
    email: 'lucia.fernandez@example.com',
    telefono: '+56922222222',
    direccion: 'Calle Nueva 222, Providencia',
    rol: 'ciudadano',
    contacto: '+56922222222',
    correo: 'lucia.fernandez@example.com',
    mascotas: 2,
    registro: '11-10-2025',
  },
  {
    id: 'usr-006',
    nombre: 'Ana Silva Moreno',
    rut: '13456789-0',
    email: 'ana.silva@example.com',
    telefono: '+56955555555',
    direccion: 'Pasaje El Sol 333, Macul',
    rol: 'ciudadano',
    contacto: '+56955555555',
    correo: 'ana.silva@example.com',
    mascotas: 1,
    registro: '31-10-2025',
  },
  {
    id: 'usr-007',
    nombre: 'Roberto Díaz Fuentes',
    rut: '17890123-4',
    email: 'robert.diaz@example.com',
    telefono: '+56911111111',
    direccion: 'Av. Libertador 444, Santiago Centro',
    rol: 'ciudadano',
    contacto: '+56911111111',
    correo: 'robert.diaz@example.com',
    mascotas: 3,
    registro: '07-11-2025',
  },
];

export type AdminAppointmentStatus =
  | 'Agendado'
  | 'Completado'
  | 'Cancelado'
  | 'Pendiente';

export type AdminAppointment = {
  id: string;
  day: number;
  start: string;
  end: string;
  appointmentDate: string;
  petId: string;
  petName: string;
  ownerId: string;
  ownerName: string;
  vetName: string;
  type: Cita['tipo'];
  notes: string;
  status: AdminAppointmentStatus;
};

export const adminAppointments: AdminAppointment[] = [
  {
    id: 'a1',
    day: 0,
    start: '09:00',
    end: '10:00',
    appointmentDate: '2026-04-13',
    petId: 'pet-001',
    petName: 'Luna',
    ownerId: 'usr-001',
    ownerName: 'María González Pérez',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'consulta',
    notes: 'Control de rutina.',
    status: 'Completado',
  },
  {
    id: 'a2',
    day: 0,
    start: '10:30',
    end: '11:30',
    appointmentDate: '2026-04-13',
    petId: 'pet-008',
    petName: 'Koda',
    ownerId: 'usr-002',
    ownerName: 'Juan Pérez Silva',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'control',
    notes: 'Control general.',
    status: 'Cancelado',
  },
  {
    id: 'a3',
    day: 1,
    start: '09:30',
    end: '10:30',
    appointmentDate: '2026-04-14',
    petId: 'pet-009',
    petName: 'Roko',
    ownerId: 'usr-004',
    ownerName: 'Carlos Rojas Díaz',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'control',
    notes: 'Revisión programada.',
    status: 'Completado',
  },
  {
    id: 'a4',
    day: 1,
    start: '11:00',
    end: '12:00',
    appointmentDate: '2026-04-14',
    petId: 'pet-010',
    petName: 'Morita',
    ownerId: 'usr-003',
    ownerName: 'Pedro Martínez Rojas',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'consulta',
    notes: 'Evaluación por dolor.',
    status: 'Agendado',
  },
  {
    id: 'a5',
    day: 2,
    start: '10:30',
    end: '11:30',
    appointmentDate: '2026-04-15',
    petId: 'pet-011',
    petName: 'Manchitas',
    ownerId: 'usr-006',
    ownerName: 'Ana Silva Moreno',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'consulta',
    notes: 'Revisión por dolor.',
    status: 'Pendiente',
  },
  {
    id: 'a6',
    day: 2,
    start: '14:00',
    end: '15:00',
    appointmentDate: '2026-04-15',
    petId: 'pet-012',
    petName: 'Milo',
    ownerId: 'usr-005',
    ownerName: 'Lucia Fernandez Castro',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'vacuna',
    notes: 'Vacunación programada.',
    status: 'Pendiente',
  },
  {
    id: 'a7',
    day: 3,
    start: '08:30',
    end: '09:30',
    appointmentDate: '2026-04-16',
    petId: 'pet-013',
    petName: 'Leo',
    ownerId: 'usr-007',
    ownerName: 'Roberto Díaz Fuentes',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'control',
    notes: 'Chequeo general.',
    status: 'Agendado',
  },
  {
    id: 'a8',
    day: 4,
    start: '11:00',
    end: '12:00',
    appointmentDate: '2026-04-17',
    petId: 'pet-007',
    petName: 'Canela',
    ownerId: 'usr-004',
    ownerName: 'Carlos Rojas Díaz',
    vetName: 'Dr. Juan Pérez Silva',
    type: 'consulta',
    notes: 'Entrega de resultados.',
    status: 'Agendado',
  },
];

export type AdminTodayAppointment = {
  horaInicio: string;
  horaFin: string;
  nombreMascota: string;
  nombrePropietario: string;
  tipoConsulta: string;
  estado: 'confirmada' | 'pendiente';
};

export const adminTodayAppointments: AdminTodayAppointment[] = [
  {
    horaInicio: '10:00',
    horaFin: '10:30',
    nombreMascota: 'Luna',
    nombrePropietario: 'María González',
    tipoConsulta: 'Consulta General',
    estado: 'confirmada',
  },
  {
    horaInicio: '10:30',
    horaFin: '11:00',
    nombreMascota: 'Max',
    nombrePropietario: 'Juan Pérez',
    tipoConsulta: 'Vacunación',
    estado: 'pendiente',
  },
  {
    horaInicio: '11:00',
    horaFin: '11:30',
    nombreMascota: 'Toby',
    nombrePropietario: 'Ana Silva',
    tipoConsulta: 'Control Post-operatorio',
    estado: 'confirmada',
  },
  {
    horaInicio: '11:30',
    horaFin: '12:00',
    nombreMascota: 'Mochi',
    nombrePropietario: 'Carlos Rojas',
    tipoConsulta: 'Desparasitación',
    estado: 'confirmada',
  },
  {
    horaInicio: '12:00',
    horaFin: '12:30',
    nombreMascota: 'Rocky',
    nombrePropietario: 'Pedro Martínez',
    tipoConsulta: 'Consulta General',
    estado: 'pendiente',
  },
];

export type AdminVisitRegistry = {
  id: string;
  registro: string;
  nombreMascota: string;
  especie: 'Perro' | 'Gato' | 'Otro';
  tipoAtencion: 'consulta' | 'vacuna' | 'cirugia' | 'control' | 'emergencia';
  diagnostico: string;
  veterinario: string;
  microchip: string;
};

// Dataset centralizado de atenciones para panel admin (VisitsTable)
export const adminVisitRegistry: AdminVisitRegistry[] = [
  {
    id: 'hist-001',
    registro: '2026-04-04',
    nombreMascota: 'Luna',
    especie: 'Perro',
    tipoAtencion: 'consulta',
    diagnostico: 'Gastritis leve',
    veterinario: 'Dr. Carlos Muñoz',
    microchip: '956000012345678',
  },
  {
    id: 'hist-002',
    registro: '2026-04-11',
    nombreMascota: 'Luna',
    especie: 'Perro',
    tipoAtencion: 'vacuna',
    diagnostico: 'Paciente sano, apto para vacunación',
    veterinario: 'Dra. Ana Soto',
    microchip: '956000012345678',
  },
  {
    id: 'hist-003',
    registro: '2026-04-16',
    nombreMascota: 'Luna',
    especie: 'Perro',
    tipoAtencion: 'cirugia',
    diagnostico: 'Procedimiento exitoso sin complicaciones',
    veterinario: 'Dr. Carlos Muñoz',
    microchip: '956000012345678',
  },
  {
    id: 'hist-004',
    registro: '2026-04-21',
    nombreMascota: 'Michi',
    especie: 'Gato',
    tipoAtencion: 'control',
    diagnostico: 'Paciente en excelente estado de salud',
    veterinario: 'Dra. Ana Soto',
    microchip: '956000012345679',
  },
  {
    id: 'hist-005',
    registro: '2026-04-25',
    nombreMascota: 'Michi',
    especie: 'Gato',
    tipoAtencion: 'vacuna',
    diagnostico: 'Paciente sano, apto para vacunación',
    veterinario: 'Dr. Carlos Muñoz',
    microchip: '956000012345679',
  },
  {
    id: 'hist-006',
    registro: '2026-04-28',
    nombreMascota: 'Rocky',
    especie: 'Perro',
    tipoAtencion: 'vacuna',
    diagnostico: 'Cachorro sano',
    veterinario: 'Dra. Ana Soto',
    microchip: 'Sin chip',
  },
];

export type AdminOperationalCategory = 'operativo' | 'rescate' | 'educacion';

export type AdminOperationalLog = {
  id: string;
  fecha: string;
  categoria: AdminOperationalCategory;
  sector: string;
  descripcion: string;
  mascotasAtendidas: number;
  mascotasRescatadas: number;
  funcionarios: string[];
};

export const adminOperationalLogs: AdminOperationalLog[] = [
  {
    id: 'op-001',
    fecha: '2026-04-05',
    categoria: 'operativo',
    sector: 'Centro',
    descripcion: 'Operativo de vacunación y desparasitación comunitaria.',
    mascotasAtendidas: 22,
    mascotasRescatadas: 0,
    funcionarios: ['Dr. Carlos Muñoz', 'Dra. Ana Soto'],
  },
  {
    id: 'op-002',
    fecha: '2026-04-12',
    categoria: 'educacion',
    sector: 'El Yeco',
    descripcion: 'Charla de tenencia responsable y entrega de material.',
    mascotasAtendidas: 0,
    mascotasRescatadas: 0,
    funcionarios: ['Dra. Ana Soto'],
  },
  {
    id: 'op-003',
    fecha: '2026-04-18',
    categoria: 'operativo',
    sector: 'San Alfonso',
    descripcion: 'Operativo de microchip y registro municipal.',
    mascotasAtendidas: 15,
    mascotasRescatadas: 0,
    funcionarios: ['Dr. Carlos Muñoz'],
  },
  {
    id: 'op-004',
    fecha: '2026-04-22',
    categoria: 'rescate',
    sector: 'Aguas Marinas',
    descripcion:
      'Rescate y evaluación clínica inicial de animal en vía pública.',
    mascotasAtendidas: 1,
    mascotasRescatadas: 1,
    funcionarios: ['Dr. Carlos Muñoz'],
  },
  {
    id: 'op-005',
    fecha: '2026-03-09',
    categoria: 'operativo',
    sector: 'Mirasol',
    descripcion: 'Operativo en sede vecinal: controles generales y vacunas.',
    mascotasAtendidas: 28,
    mascotasRescatadas: 0,
    funcionarios: ['Dra. Ana Soto'],
  },
  {
    id: 'op-006',
    fecha: '2026-02-20',
    categoria: 'rescate',
    sector: 'El Canelo',
    descripcion: 'Retiro y traslado a hogar temporal por denuncia vecinal.',
    mascotasAtendidas: 1,
    mascotasRescatadas: 1,
    funcionarios: ['Dra. Ana Soto'],
  },
];

// Todas las mascotas para el panel admin
export const todasLasMascotas: Mascota[] = [
  { ...mascotas[0] },
  { ...mascotas[1] },
  { ...mascotas[2] },
  {
    id: 'pet-004',
    nombre: 'Toby',
    especie: 'perro',
    raza: 'Schnauzer',
    fechaNacimiento: '2020-05-12',
    sexo: 'macho',
    color: 'Gris sal y pimienta',
    peso: '7kg',
    descripcion: 'Gris sal y pimienta',
    chip: '956000012345680',
    esterilizado: true,
    foto: '/pets/toby.jpg',
    propietarioId: 'usr-002',
    propietarioNombre: 'Juan Pérez Silva',
  },
  {
    id: 'pet-005',
    nombre: 'Nina',
    especie: 'gato',
    raza: 'Siamés',
    fechaNacimiento: '2023-02-28',
    sexo: 'hembra',
    color: 'Crema con puntos oscuros',
    peso: '3.5kg',
    descripcion: 'Crema con puntos oscuros',
    chip: '956000012345681',
    esterilizado: false,
    foto: '/pets/nina.jpg',
    propietarioId: 'usr-004',
    propietarioNombre: 'Carlos Rojas Díaz',
  },
  {
    id: 'pet-006',
    nombre: 'Max',
    especie: 'perro',
    raza: 'Mestizo mediano',
    fechaNacimiento: '2021-10-08',
    sexo: 'macho',
    color: 'Negro con manchas blancas',
    peso: '12kg',
    descripcion: 'Negro con manchas blancas',
    chip: null,
    esterilizado: false,
    foto: '/pets/max.jpg',
    propietarioId: 'usr-002',
    propietarioNombre: 'Juan Pérez Silva',
  },
  {
    id: 'pet-007',
    nombre: 'Mochi',
    especie: 'gato',
    raza: 'Común europeo',
    fechaNacimiento: '2023-06-18',
    sexo: 'hembra',
    color: 'Atigrado gris',
    peso: '1.5kg',
    descripcion: 'Atigrado gris',
    chip: '956000012345681',
    esterilizado: true,
    foto: '/pets/mochi.jpg',
    propietarioId: 'usr-004',
    propietarioNombre: 'Carlos Rojas Díaz',
  },
];

// Todas las citas para el panel admin
export const todasLasCitas: (Cita & { propietarioNombre: string })[] = [
  { ...citas[0], propietarioNombre: 'María González Pérez' },
  { ...citas[1], propietarioNombre: 'María González Pérez' },
  {
    id: 'cita-003',
    mascotaId: 'pet-006',
    mascotaNombre: 'Max',
    propietarioId: 'usr-002',
    propietarioNombre: 'Juan Pérez Silva',
    fecha: '2026-04-21',
    hora: '10:30',
    tipo: 'vacuna',
    estado: 'pendiente',
    notas: 'Vacunación anual',
  },
  {
    id: 'cita-004',
    mascotaId: 'pet-004',
    mascotaNombre: 'Toby',
    propietarioId: 'usr-006',
    propietarioNombre: 'Ana Silva Moreno',
    fecha: '2026-04-21',
    hora: '11:00',
    tipo: 'control',
    estado: 'confirmada',
    notas: 'Control post-operatorio',
  },
  {
    id: 'cita-005',
    mascotaId: 'pet-007',
    mascotaNombre: 'Mochi',
    propietarioId: 'usr-004',
    propietarioNombre: 'Carlos Rojas Díaz',
    fecha: '2026-04-21',
    hora: '11:30',
    tipo: 'consulta',
    estado: 'confirmada',
    notas: 'Desparasitación',
  },
  {
    id: 'cita-006',
    mascotaId: 'pet-003',
    mascotaNombre: 'Rocky',
    propietarioId: 'usr-003',
    propietarioNombre: 'Pedro Martínez Rojas',
    fecha: '2026-04-21',
    hora: '12:00',
    tipo: 'consulta',
    estado: 'pendiente',
    notas: 'Consulta general',
  },
  {
    id: 'cita-007',
    mascotaId: 'pet-001',
    mascotaNombre: 'Luna',
    propietarioId: 'usr-001',
    propietarioNombre: 'María González Pérez',
    fecha: '2026-04-24',
    hora: '09:00',
    tipo: 'control',
    estado: 'completada',
    notas: 'Chequeo general',
  },
  {
    id: 'cita-008',
    mascotaId: 'pet-007',
    mascotaNombre: 'Mochi',
    propietarioId: 'usr-004',
    propietarioNombre: 'Carlos Rojas Díaz',
    fecha: '2026-04-24',
    hora: '11:00',
    tipo: 'consulta',
    estado: 'confirmada',
    notas: 'Resultados de laboratorio',
  },
];

// Mascotas disponibles para adopción
export const mascotasAdopcion: MascotaAdopcion[] = [
  {
    id: 'adop-001',
    nombre: 'Milo',
    especie: 'perro',
    edadAprox: 'Adulto (2 años)',
    sexo: 'macho',
    tamaño: 'grande',
    historia:
      'Un perro muy leal y protector. Le encanta salir a correr, ideal para una familia con patio grande y tiempo para paseos largos.',
    salud: ['Primera vacuna', 'Desparasitado'],
    imagenes: ['/dog_07.jpg'],
    estado: 'disponible',
    fechaIngreso: '2026-03-01',
  },
  {
    id: 'adop-002',
    nombre: 'Atom',
    especie: 'gato',
    edadAprox: 'Adulto (1 años)',
    sexo: 'macho',
    tamaño: 'pequeño',
    historia:
      'Atom es un gato muy tranquilo que disfruta dormir al sol. Fue rescatado de un techo donde no podía bajar.',
    salud: ['Vacuna Triple', 'Esterilizado', 'Microchip'],
    imagenes: ['/cat_09.jpg'],
    estado: 'disponible',
    fechaIngreso: '2026-02-15',
  },
  {
    id: 'adop-003',
    nombre: 'Rocky',
    especie: 'perro',
    edadAprox: 'Adulto (4 años)',
    sexo: 'macho',
    tamaño: 'mediano',
    historia:
      'Fue encontrado junto a sus hermanos en una caja cerca de la plaza. Es muy juguetón y le encanta morder zapatos.',
    salud: ['Vacuna Óctuple', 'Antirrábica', 'Esterilizado', 'Microchip'],
    imagenes: ['/dog_09.jpg', '/dog_09.jpg', '/dog_09.jpg', '/dog_09.jpg'],
    estado: 'disponible',
    fechaIngreso: '2025-12-10',
  },
  {
    id: 'adop-004',
    nombre: 'Mochi',
    especie: 'gato',
    edadAprox: 'Cachorro (4 meses)',
    sexo: 'hembra',
    tamaño: 'pequeño',
    historia:
      'Una gatita curiosa y exploradora. Todavía está aprendiendo a usar el rascador, pero es muy cariñosa.',
    salud: ['Desparasitada'],
    imagenes: ['/cat_04.jpg'],
    estado: 'en_proceso',
    fechaIngreso: '2026-03-05',
  },
];
