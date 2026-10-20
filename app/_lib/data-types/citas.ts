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

export type AppointmentPet = {
  id: string;
  microchip: string;
  inscrito_registro_nacional: boolean;
  codigo_registro_nacional: string;
  nombre_mascota: string;
  fecha_nacimiento: string;
  raza: string;
  especie: string;
  esterilizado: boolean;

  nombre_propietario: string;
  id_propietario: string;
  rut: string;
};

export type AppointmentListItem = {
  id: string;
  hora_agendada: string;
  nombre_mascota: string;
  especie: string;
  public_id_mascota: string;
  microchip: string | null;
  nombre_propietario: string | null;
  rut_propietario: string | null;
  public_id_propietario: string | null;
  motivo: string | null;
  estado: string | null;
};

export type Appointment = {
  public_id_cita: string;
  funcionario_id: string;
  mascota_id: string;
  hora_agendada: string;
  motivo: string | null;
  estado: string | null;
  tipo_atencion: string;
  created_at: string;
  // responsable_id: string;
  nombre_mascota: string;
  especie: string;
  microchip: string | null;
  fecha_nacimiento: string;
  sexo: string;
  // peso: number;
  nombre_propietario: string;
  rut_propietario: string;
  public_id_propietario: string;
};
