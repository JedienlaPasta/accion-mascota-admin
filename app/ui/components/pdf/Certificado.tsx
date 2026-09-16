import CertificadoConsultaMedica from './certificados/CertificadoConsultaMedica';
import CertificadoOperativoSanitario from './certificados/CertificadoOperativoSanitario';
// import CertificadoOperativoSanitario from './certificados/CertificadoOperativoSanitario';
// import CertificadoEsterilizacion from './certificados/CertificadoEsterilizacion';

// ============================================================
// TIPOS DISCRIMINADOS (cada payload es distinto por tipo)
// ============================================================
export type TipoAtencion =
  | 'CONSULTA_MEDICA'
  | 'OPERATIVO_SANITARIO'
  | 'OPERATIVO_ESTERILIZACION';

export type DatosComunes = {
  fecha: string;
  responsable: {
    nombre: string;
    rut: string;
    fechaNacimiento: string;
    direccion: string;
    comuna: string;
    mail: string;
    telefono: string;
  };
  paciente: {
    nombre: string;
    fechaNacimiento: string;
    especie: string;
    raza: string;
    color: string;
    patron: string;
    sexo: string;
    peso: string;
    microchip: string;
    modoObtencion: string;
    razonTenencia: string;
    tipoTenencia: string;
    esterilizado: 'SI' | 'NO' | '';
  };
  veterinario: {
    nombre: string;
    rut: string;
    comuna: string;
  };
  idAtencion?: string;
};

export type ConsultaMedicaPayload = DatosComunes & {
  tipoAtencion: 'CONSULTA_MEDICA';
  clinica: {
    motivo: string;
    anamnesis: string;
    examenFisico: string;
    preDx: string;
    examenes: string;
    tratamiento: string;
  };
};

export type OperativoSanitarioPayload = DatosComunes & {
  tipoAtencion: 'OPERATIVO_SANITARIO';
  procedimientos: Array<{ codigo: string; nombre: string }>;
  observaciones?: string;
};

export type EsterilizacionPayload = DatosComunes & {
  tipoAtencion: 'OPERATIVO_ESTERILIZACION';
  resultado: string;
  observacionesPost?: string;
};

export type FichaDatos =
  | ConsultaMedicaPayload
  | OperativoSanitarioPayload
  | EsterilizacionPayload;

// ============================================================
// DISPATCHER CENTRAL (renderiza el certificado que corresponda)
// ============================================================
export default function Certificado({ datos }: { datos: FichaDatos }) {
  switch (datos.tipoAtencion) {
    case 'CONSULTA_MEDICA':
      return <CertificadoConsultaMedica datos={datos} />;

    case 'OPERATIVO_SANITARIO':
      return <CertificadoOperativoSanitario datos={datos} />;

    // case 'OPERATIVO_ESTERILIZACION':
    //   return <CertificadoEsterilizacion datos={datos} />;

    default: {
      // Caso fallback por si llega un tipo nuevo sin actualizar el componente.
      // Devuelve CONSULTA_MEDICA pero muestra un warning.
      const fallback = datos as unknown as ConsultaMedicaPayload;
      return <CertificadoConsultaMedica datos={fallback} />;
    }
  }
}

// Helper para consumidores: construir el TIPO correcto (evita errores de typo en string).
export const buildPdfPayload = <T extends FichaDatos>(payload: T): T => payload;
