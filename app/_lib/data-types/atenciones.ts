export type Visits = {
  id: string;
  public_id_registro: string;
  fecha_atencion: string;
  nombre_mascota: string;
  especie: string;
  public_id_mascota: string;
  nombre_propietario: string;
  rut_propietario: string;
  public_id_propietario: string;
  tipo_atencion: string;
  motivo_atencion: string | null;
  pre_dx: string | null;
  veterinario: string;
  microchip: string | null;
  peso_actual: number | null;
  proxima_visita: string | null;
  tratamiento: string | null;
};

export type VisitsTableData = {
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

export type VisitsSummary = {
  total_atenciones: number;
  total_operativos_sanitarios: number;
  total_operativos_esterilizacion: number;
  total_consultas_medicas: number;
};
