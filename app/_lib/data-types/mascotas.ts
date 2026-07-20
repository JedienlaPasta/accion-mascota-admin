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
  peso: number;
  microchip: string;
  esterilizado: boolean | null;
  propietario_id: string;
  nombre_propietario: string;
  telefono: string | null;
  correo: string | null;
};

export type AppliedProcedures = {
  octuple: boolean;
  antirrabica: boolean;
  verificacion: boolean;
  triple_felina: boolean;
  microchip_implantado: boolean;
  desparasitacion_externa: boolean;
  desparasitacion_interna: boolean;
};

export type ClinicHistoryItem = {
  id: string;
  mascota_id: string;
  fecha_atencion: string;
  tipo_atencion: string;
  pre_dx: string;
  procedimientos_aplicados: AppliedProcedures | null;
  tratamiento: string | null;
  veterinario: string;
  proximaVisita: string | null;
};
