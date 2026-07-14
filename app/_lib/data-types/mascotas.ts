export type Mascota = {
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

export type MascotasTableData = {
  id: string; // public_id
  nombre_mascota: string;
  especie: string;
  fecha_nacimiento: string;
  raza: string;
  microchip: string;
  esterilizado: boolean | null;
  nombre_propietario: string;
  telefono: string;
};
