export type Owner = {
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

export type OwnersTableData = {
  id: string; // public_id
  nombre_propietario: string;
  rut: string;
  correo_personal: string;
  correo_contacto: string;
  direccion: string | null;
  comuna: string | null;
  region: string | null;
  telefono: string | null;
  total_mascotas: number;
};

export type OwnersSummaryData = {
  total_propietarios: number;
  total_propietarios_verificados: number;
};
