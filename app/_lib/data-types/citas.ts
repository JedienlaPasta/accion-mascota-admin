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
