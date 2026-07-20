export type Propietario = {
  id: string;
  nombre_propietario: string;
  rut: string;
  correo: string;
  fecha_nacimiento: string;
  rsh: number;
  direccion: string | null;
  comuna: string | null;
  region: string | null;
  telefono: string | null;
  profesion: string;
};

export type PropietariosTableData = {
  id: string; // public_id
  nombre_propietario: string;
  rut: string;
  correo: string;
  direccion: string | null;
  comuna: string | null;
  region: string | null;
  telefono: string | null;
  total_mascotas: number;
};
