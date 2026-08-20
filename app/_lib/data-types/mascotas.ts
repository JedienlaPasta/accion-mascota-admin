export type Pet = {
  id: string;
  microchip: string;
  inscrito_registro_nacional: boolean;
  codigo_registro_nacional: string;
  nombre_mascota: string;
  fecha_nacimiento: string;
  peso: number;
  raza: string;
  especie: string;
  color: string;
  patron: string;
  sexo: string;
  esterilizado: boolean;
  modo_obtencion: string;
  comuna_obtencion: string;
  tipo_tenencia: string;
  razon_tenencia: string;
  primera_visita_veterinario: boolean;
  estado_vital: string;
};

// type MascotasTableData = Pick<Mascota, 'id'>;

export type PetsTableData = {
  id: string; // public_id
  nombre_mascota: string;
  especie: string;
  fecha_nacimiento: string;
  raza: string;
  microchip: string;
  esterilizado: boolean | null;
  nombre_propietario: string;
  rut: string;
};

export type PetsSummaryData = {
  total_mascotas: number;
  total_perros: number;
  total_gatos: number;
};

export type PetDetails = {
  id: string;
  nombre_mascota: string;
  especie: string;
  fecha_nacimiento: string;
  raza: string;
  sexo: string;
  color: string;
  patron: string;
  peso: number;
  microchip: string;
  esterilizado: boolean | null;
  propietario_id: string;
  nombre_propietario: string;
  telefono: string | null;
  correo: string | null;
};

// Procedimiento individual aplicado en OPERATIVO_SANITARIO
export type AppliedProcedure = {
  codigo: string; // procedimientos.codigo varchar(50)
  nombre: string; // procedimientos.nombre varchar(100)
};

export type ClinicHistoryItem = {
  id: string;
  mascota_id: string;
  fecha_atencion: string;
  tipo_atencion: string;
  peso_actual: number | null;
  veterinario: string;

  // Campos solo cuando tipo_atencion = 'CONSULTA_MEDICA'
  motivo: string | null;
  anamnesis: string | null;
  pre_dx: string | null;
  examen_fisico: string | null;
  examenes_solicitados: string | null;
  tratamiento: string | null;
  derivacion_clinica_privada: boolean | null;

  // Campos solo cuando tipo_atencion = 'OPERATIVO_ESTERILIZACION'
  resultado_esterilizacion: string | null;

  // Campos solo cuando tipo_atencion = 'OPERATIVO_SANITARIO'
  // (array de 1..N procedimientos aplicados en la misma atención)
  procedimientos_aplicados: AppliedProcedure[] | null;
};
