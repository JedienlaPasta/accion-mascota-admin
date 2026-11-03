import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  BORDER,
  GRAY_TEXT,
  HEADER_BG,
  LIGHT_ROW,
  SECONDARY_HEADER_BG,
  ALT_ROW,
  certStyles,
  CornerTriangle,
  HCheckBox,
  TableCell,
  TableRow,
} from './PdfTheme';

export type TreatmentItem = {
  farmaco: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  via: string;
  observaciones?: string;
};

export type TreatmentSheetData = {
  fechaEntrega: string;
  tipoAtencion:
    | 'CONSULTA_MEDICA'
    | 'OPERATIVO_SANITARIO'
    | 'OPERATIVO_ESTERILIZACION';
  procedimiento: string;
  proximoControl: string;
  responsable: {
    nombre: string;
    rut: string;
    telefono: string;
    mail: string;
  };
  paciente: {
    nombre: string;
    especie: string;
    raza: string;
    sexo: string;
    edad: string;
    peso: string;
    color: string;
    patron: string;
    tipoTenencia: string;
    microchip: string;
  };
  profesional: {
    nombre: string;
    rut: string;
    cargo: string;
  };
  tratamientos: TreatmentItem[];
  examenes: string[];
  observacionesGenerales: string;
};

const styles = StyleSheet.create({
  page: {
    ...certStyles.page,
    paddingTop: 40,
    paddingHorizontal: 40,
  },
  headerMetaStack: {
    position: 'absolute',
    right: 0,
    top: 20,
    width: 230,
    gap: 1,
  },
  headerMetaBox: {
    flexDirection: 'row',
    border: `1 solid ${BORDER}`,
    minHeight: 24,
  },
  headerMetaLabel: {
    width: 80,
    flexBasis: 80,
    flexGrow: 0,
    flexShrink: 0,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#dbe4f0',
    borderRight: `1 solid ${BORDER}`,
  },
  headerMetaValue: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 4,
    backgroundColor: '#fff',
  },
  headerMetaLabelText: {
    fontSize: 7.3,
    color: HEADER_BG,
    fontWeight: 'bold',
    lineHeight: 1.1,
  },
  headerMetaValueText: {
    fontSize: 8.2,
    color: '#0f172a',
  },
  titleWrap: {
    width: '58%',
    paddingTop: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 9.5,
    color: GRAY_TEXT,
    lineHeight: 1.2,
    marginTop: 2,
  },
  treatmentHead: {
    flexDirection: 'row',
    backgroundColor: '#dbe4f0',
    borderBottom: `1 solid ${SECONDARY_HEADER_BG}`,
  },
  treatmentHeadCell: {
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRight: `1 solid ${SECONDARY_HEADER_BG}`,
    justifyContent: 'center',
  },
  treatmentHeadText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  treatmentRow: {
    flexDirection: 'row',
    minHeight: 30,
    backgroundColor: LIGHT_ROW,
    borderBottom: `1 solid ${SECONDARY_HEADER_BG}`,
  },
  treatmentRowAlt: {
    backgroundColor: ALT_ROW,
  },
  treatmentCell: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRight: `1 solid ${SECONDARY_HEADER_BG}`,
    justifyContent: 'center',
  },
  colFarmaco: { width: '25%' },
  colDosis: { width: '15%' },
  colFrecuencia: { width: '15%' },
  colDuracion: { width: '10%' },
  colVia: { width: '10%' },
  colObs: { width: '25%', borderRightWidth: 0 },
  treatmentText: {
    fontSize: 8,
    color: '#1e293b',
    lineHeight: 1.25,
  },
  sectionContent: {
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 12,
    paddingLeft: 2,
    fontSize: 8,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    color: '#1e293b',
    lineHeight: 1.35,
    textAlign: 'justify',
  },
  noteBox: {
    minHeight: 62,
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
  noteText: {
    fontSize: 8,
    color: '#1e293b',
    lineHeight: 1.35,
  },
  splitRow: {
    flexDirection: 'row',
    borderBottom: `1 solid ${SECONDARY_HEADER_BG}`,
  },
  splitCol: {
    flex: 1,
    minHeight: 110,
    borderRight: `1 solid ${SECONDARY_HEADER_BG}`,
  },
  splitColLast: {
    borderRightWidth: 0,
  },
  splitHeader: {
    backgroundColor: '#dbe4f0',
    paddingVertical: 5,
    paddingHorizontal: 7,
    borderBottom: `1 solid ${SECONDARY_HEADER_BG}`,
  },
  splitHeaderText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  splitBody: {
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  compactBulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  controlRow: {
    paddingVertical: 6,
    paddingHorizontal: 7,
  },
  controlText: {
    fontSize: 8,
    color: '#1e293b',
    lineHeight: 1.35,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 50,
    gap: 24,
  },
  signatureCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  signatureLine: {
    width: '40%',
    borderTop: `1 solid ${BORDER}`,
    marginBottom: 5,
  },
  signatureTitle: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  signatureSub: {
    fontSize: 7.4,
    color: GRAY_TEXT,
    textAlign: 'center',
    marginTop: 1,
  },
  legalFooter: {
    marginTop: 10,
    fontSize: 7,
    color: '#64748b',
    lineHeight: 1.25,
  },
  footerInfo: {
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 1.25,
  },
});

const getAttentionLabel = (tipo: TreatmentSheetData['tipoAtencion']) => {
  switch (tipo) {
    case 'CONSULTA_MEDICA':
      return 'Consulta Médica';
    case 'OPERATIVO_SANITARIO':
      return 'Operativo Sanitario';
    case 'OPERATIVO_ESTERILIZACION':
      return 'Operativo Esterilización';
    default:
      return tipo;
  }
};

export default function FichaTratamientoPosteriorPdf({
  datos,
}: {
  datos: TreatmentSheetData;
}) {
  const d = datos;

  return (
    <Document
      author="Acción Mascota - Municipalidad de Algarrobo"
      title={`Ficha de Tratamiento · ${d.paciente.nombre}`}
    >
      <Page size="LETTER" style={styles.page}>
        <View style={certStyles.cornerTopRight} />
        <View style={certStyles.cornerMidLeft} />
        <View style={certStyles.cornerBottomLeft} />
        <View style={certStyles.cornerGhostWrap}>
          <CornerTriangle />
        </View>

        <View style={certStyles.headerRow}>
          <View style={certStyles.headerItemsWrapper}>
            <View style={certStyles.logosBox}>
              <View style={certStyles.logoBoxUnit}>
                <Image
                  style={certStyles.logoEscudoImg}
                  src="/escudo-nuevo.png"
                />
              </View>
              <View style={certStyles.logoBoxUnitDivider} />
              <View style={certStyles.logoBoxUnit}>
                <Image
                  style={certStyles.logoAccionImg}
                  src="/accion-mascota-logo-blue.png"
                  cache={false}
                />
              </View>
            </View>

            <View style={styles.headerMetaStack}>
              <View style={styles.headerMetaBox}>
                <View style={styles.headerMetaLabel}>
                  <Text style={styles.headerMetaLabelText}>Tipo atención</Text>
                </View>
                <View style={styles.headerMetaValue}>
                  <Text style={styles.headerMetaValueText}>
                    {getAttentionLabel(d.tipoAtencion)}
                  </Text>
                </View>
              </View>

              <View style={styles.headerMetaBox}>
                <View style={styles.headerMetaLabel}>
                  <Text style={styles.headerMetaLabelText}>Microchip</Text>
                </View>
                <View style={styles.headerMetaValue}>
                  <Text style={styles.headerMetaValueText}>
                    {d.paciente.microchip || 'No registrado'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.titleWrap}>
            <Text style={styles.title}>Ficha de Tratamiento Posterior</Text>
            <Text style={styles.subtitle}>
              Indicaciones farmacológicas y cuidados posteriores al
              procedimiento
            </Text>
          </View>
        </View>

        {/* DATOS DEL RESPONSABLE */}
        <View style={certStyles.sectionBox}>
          <Text style={certStyles.sectionTitle}>DATOS RESPONSABLE</Text>

          <TableRow isLight={false}>
            <TableCell
              label="Entrega:"
              value={d.fechaEntrega}
              isLight={false}
            />
            <TableCell
              label="Teléfono:"
              value={d.responsable.telefono}
              isLight={false}
            />
            <TableCell
              label="Mail:"
              value={d.responsable.mail}
              isLight={false}
              isLast
            />
          </TableRow>

          <TableRow isLight={false} isLast>
            <TableCell
              label="Nombre:"
              value={d.responsable.nombre}
              span={2}
              isLight={false}
            />
            <TableCell
              label="Rut:"
              value={d.responsable.rut}
              isLight={false}
              isLast
            />
          </TableRow>
        </View>

        {/* DATOS DEL PACIENTE */}
        <View style={certStyles.sectionBoxLight}>
          <Text style={certStyles.sectionTitleSecondary}>
            DATOS DEL PACIENTE
          </Text>

          <TableRow>
            <TableCell label="Nombre:" value={d.paciente.nombre} />
            <TableCell label="Especie:" value={d.paciente.especie} />
            <TableCell label="Raza:" value={d.paciente.raza} isLast />
          </TableRow>

          <TableRow isAlt>
            <TableCell label="Edad:" value={d.paciente.edad} />
            <TableCell
              label="Sexo:"
              value={<HCheckBox value={d.paciente.sexo} />}
            />

            <TableCell label="Peso:" value={d.paciente.peso} isLast />
          </TableRow>

          <TableRow isLast>
            <TableCell label="Color:" value={d.paciente.color} />
            <TableCell label="Patrón:" value={d.paciente.patron} />
            <TableCell
              label="Tipo Tenencia:"
              value={d.paciente.tipoTenencia}
              isLast
            />
          </TableRow>
        </View>

        {/* TRATAMIENTO INDICADO */}
        <View style={certStyles.sectionBoxLight}>
          <Text style={certStyles.sectionTitleSecondary}>
            TRATAMIENTO INDICADO
          </Text>

          <View>
            <View style={styles.treatmentHead}>
              <View style={[styles.treatmentHeadCell, styles.colFarmaco]}>
                <Text style={styles.treatmentHeadText}>
                  Tratamiento / Fármaco
                </Text>
              </View>
              <View style={[styles.treatmentHeadCell, styles.colDosis]}>
                <Text style={styles.treatmentHeadText}>Dosis</Text>
              </View>
              <View style={[styles.treatmentHeadCell, styles.colFrecuencia]}>
                <Text style={styles.treatmentHeadText}>Frecuencia</Text>
              </View>
              <View style={[styles.treatmentHeadCell, styles.colDuracion]}>
                <Text style={styles.treatmentHeadText}>Días</Text>
              </View>
              <View style={[styles.treatmentHeadCell, styles.colVia]}>
                <Text style={styles.treatmentHeadText}>Vía</Text>
              </View>
              <View style={[styles.treatmentHeadCell, styles.colObs]}>
                <Text style={styles.treatmentHeadText}>Observaciones</Text>
              </View>
            </View>

            {d.tratamientos.map((item, index) => (
              <View
                key={`${item.farmaco}-${index}`}
                style={[
                  styles.treatmentRow,
                  index % 2 === 1 ? styles.treatmentRowAlt : undefined,
                  index === d.tratamientos.length - 1
                    ? { borderBottomWidth: 0 }
                    : undefined,
                ]}
              >
                <View style={[styles.treatmentCell, styles.colFarmaco]}>
                  <Text style={styles.treatmentText}>{item.farmaco}</Text>
                </View>
                <View style={[styles.treatmentCell, styles.colDosis]}>
                  <Text style={styles.treatmentText}>{item.dosis}</Text>
                </View>
                <View style={[styles.treatmentCell, styles.colFrecuencia]}>
                  <Text style={styles.treatmentText}>{item.frecuencia}</Text>
                </View>
                <View style={[styles.treatmentCell, styles.colDuracion]}>
                  <Text style={styles.treatmentText}>{item.duracion}</Text>
                </View>
                <View style={[styles.treatmentCell, styles.colVia]}>
                  <Text style={styles.treatmentText}>{item.via}</Text>
                </View>
                <View style={[styles.treatmentCell, styles.colObs]}>
                  <Text style={styles.treatmentText}>
                    {item.observaciones || '—'}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* SEGUIMIENTO E INDICACIONES */}
        <View style={certStyles.sectionBoxLight}>
          <Text style={certStyles.sectionTitleSecondary}>
            SEGUIMIENTO E INDICACIONES
          </Text>

          <View style={styles.splitRow}>
            <View style={styles.splitCol}>
              <View style={styles.splitHeader}>
                <Text style={styles.splitHeaderText}>EXÁMENES SOLICITADOS</Text>
              </View>
              <View style={styles.splitBody}>
                {d.examenes.length > 0 ? (
                  d.examenes.map((item, index) => (
                    <View
                      key={`${item}-${index}`}
                      style={styles.compactBulletRow}
                    >
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.bulletText}>{item}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noteText}>Sin exámenes solicitados.</Text>
                )}
              </View>
            </View>

            <View style={[styles.splitCol, styles.splitColLast]}>
              <View style={styles.splitHeader}>
                <Text style={styles.splitHeaderText}>
                  OBSERVACIONES Y CUIDADOS
                </Text>
              </View>
              <View style={styles.splitBody}>
                <Text style={styles.noteText}>
                  {d.observacionesGenerales || 'Sin observaciones adicionales.'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.controlRow}>
            <Text style={styles.controlText}>
              <Text style={{ fontWeight: 'bold' }}>Próximo control:</Text>{' '}
              {d.proximoControl}
            </Text>
          </View>
        </View>

        <Text style={styles.legalFooter}>
          Esta ficha entrega indicaciones de tratamiento y seguimiento
          domiciliario. Ante cualquier empeoramiento clínico, contactar al
          equipo veterinario o acudir a control.
        </Text>

        <View style={styles.footerRow}>
          <View style={styles.signatureCol}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureTitle}>{d.profesional.nombre}</Text>
            <Text style={styles.signatureSub}>
              {d.profesional.cargo} · {d.profesional.rut}
            </Text>

            <Text style={[styles.footerInfo, { marginTop: 5 }]}>
              Departamento de Tenencia Responsable, Ilustre Municipalidad de
              Algarrobo.
            </Text>
            <Text style={styles.footerInfo}>Cel: +569 7135 7976</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
