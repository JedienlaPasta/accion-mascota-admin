import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';

// ================================================================
const HEADER_BG = '#1c2752'; // azul oscuro
const SECONDARY_HEADER_BG = '#4c82c2'; // azul
const BORDER = '#1e3a8a';
const LIGHT_ROW = '#ffffff';
const ALT_ROW = '#f8fafc';
const GRAY_TEXT = '#334155';

try {
  Font.register({
    family: 'Outfit',
    fonts: [
      {
        src: '/fonts/Outfit-Regular.ttf',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      {
        src: '/fonts/Outfit-Medium.ttf',
        fontWeight: 500,
        fontStyle: 'normal',
      },
      {
        src: '/fonts/Outfit-Bold.ttf',
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
    ],
  });
} catch (fontError) {
  console.warn(
    '[Certificado PDF] No se cargó la fuente Outfit. Revisa public/fonts/ (usa archivos static, no el Variable-Font). Usando Helvetica fallback.',
    fontError instanceof Error ? fontError.message : fontError
  );
}

const styles = StyleSheet.create({
  page: {
    padding: 32,
    paddingTop: 40,
    fontFamily: 'Outfit',
    fontSize: 9,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
  },

  // Esquinas decorativas azuladas
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 50,
    height: 22,
    backgroundColor: SECONDARY_HEADER_BG,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 22,
    backgroundColor: '#93c5fd', // azul-300
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: -50,
    right: -70,
    width: 100,
    height: 200,
    transform: 'rotate(35deg)',
    backgroundColor: SECONDARY_HEADER_BG,
  },
  cornerMidLeft: {
    position: 'absolute',
    top: 260,
    left: 0,
    width: 16,
    height: 18,
    backgroundColor: '#bfdbfe', // azul-200
  },
  // Wrapper fantasma para esquinas decorativas que sobresalen de la hoja.
  // ya no genera una segunda pagina en blanco por desbordamiento (si se usa).
  cornerGhostWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  },

  // HEADER ZONE (titles + logos)
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 0,
    paddingBottom: 16,
    // borderBottom: `1 solid #e2e8f0`,
  },
  titleContainer: {
    width: '62%',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: -0.4,
  },
  subTitle: {
    fontSize: 11,
    color: GRAY_TEXT,
    // marginTop: 2,
  },
  logosBox: {
    width: '38%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 16,
  },
  logoBoxUnit: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoAccionImg: {
    width: 80,
    height: 50,
    objectFit: 'contain',
  },
  logoEscudoImg: {
    width: 90,
    height: 60,
    objectFit: 'contain',
  },
  logoTextGroup: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  logoTitle: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 10,
    lineHeight: 1.15,
    textAlign: 'right',
  },
  logoSub: {
    fontSize: 7.5,
    color: GRAY_TEXT,
    textAlign: 'right',
    marginTop: 2,
  },

  // TABLE SECTION GENERIC (outer border + header blue)
  sectionBox: {
    border: `1 solid ${BORDER}`,
    marginBottom: 10,
    overflow: 'hidden',
    backgroundColor: LIGHT_ROW,
  },
  sectionTitle: {
    backgroundColor: HEADER_BG,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingVertical: 5,
    paddingHorizontal: 9,
    letterSpacing: 0.4,
  },
  sectionTitleSecondary: {
    backgroundColor: SECONDARY_HEADER_BG,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingVertical: 5,
    paddingHorizontal: 9,
    letterSpacing: 0.4,
  },

  // ROWS / COLS
  row: {
    flexDirection: 'row',
    minHeight: 19,
    borderBottom: `0.6 solid ${BORDER}`,
    backgroundColor: LIGHT_ROW,
  },
  rowAlt: {
    backgroundColor: ALT_ROW,
  },
  rowLast: {
    borderBottomWidth: 0,
  },

  cell: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    flexDirection: 'row',
    borderRight: `0.6 solid ${BORDER}`,
  },
  cellLast: {
    borderRightWidth: 0,
  },
  cellLabel: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 9,
    marginRight: 4,
    paddingTop: 1,
  },
  cellValue: {
    flex: 1,
    color: '#1e293b',
    fontSize: 9,
    paddingTop: 1,
  },

  // Wide cell spanning full width (textareas)
  fullCell: {
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRightWidth: 0,
    flexDirection: 'row',
  },
  fullCellLabel: {
    fontWeight: 'bold',
    color: '#0f172a',
    fontSize: 9,
    minWidth: 105,
    maxWidth: 120,
  },
  fullCellValue: {
    flex: 1,
    fontSize: 9,
    color: '#1e293b',
    lineHeight: 1.35,
  },

  // H / M checkboxes (Sexo Hembra/Macho)
  smallRadioBoxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
    gap: 8,
  },
  smallRadioBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
    gap: 3,
  },
  squareBox: {
    width: 9,
    height: 9,
    border: `0.6 solid ${BORDER}`,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareBoxFilled: {
    backgroundColor: '#1e3a8a',
  },
  squareLetter: {
    fontSize: 7,
    color: '#0f172a',
    fontWeight: 'bold',
    marginLeft: 2,
  },

  // SI / NO para esterilizado
  siNoBoxes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  // CONSENTIMIENTO (lista bullets)
  consentimientoBox: {
    padding: 5,
    paddingHorizontal: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  bullet: {
    width: 12,
    paddingLeft: 3,
    fontSize: 8,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  bulletText: {
    flex: 1,
    fontSize: 8,
    color: '#1e293b',
    lineHeight: 1.4,
    textAlign: 'justify',
  },

  // FIRMAS
  signatureBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 50,
    paddingHorizontal: 30,
  },
  signatureLine: {
    width: '40%',
    borderTop: `1 solid #4c82c2`,
    paddingTop: 6,
  },
  signatureLabel: {
    textAlign: 'center',
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
});

// ================================================================
// HELPERS DE RENDER
// ================================================================
type FichaDatos = {
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
    edad?: string;
    especie: string;
    raza: string;
    color: string;
    patron: string;
    sexo: string;
    peso: string;
    microchip: string;
    modoObtencion: string;
    razonTenencia: string;
    esterilizado: string; // 'SI' | 'NO' | ''
  };
  clinica: {
    motivo: string;
    anamnesis: string;
    examenFisico: string;
    preDx: string;
    examenes: string;
    tratamiento: string;
  };
  veterinario: {
    nombres: string;
    apellidos: string;
    rut: string;
    comuna: string;
  };
};

// ============================================================
// HELPERS DE TABLA %
// ============================================================
type CellSpan = 1 | 2 | 3;

// Convierte un span (1/2/3 cols) a width% sobre 3 cols base.
function spanWidth(span: CellSpan): `${number}%` {
  // 3 cols base: 1 col = 33.33%, 2 cols = 66.66%, 3 cols = 100%
  const widths: Record<CellSpan, `${number}%`> = {
    1: '33.33%',
    2: '66.66%',
    3: '100%',
  };
  return widths[span];
}

type TableRowProps = {
  children: React.ReactNode;
  isAlt?: boolean;
  isLast?: boolean;
};

function TableRow({ children, isAlt = false, isLast = false }: TableRowProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: 19,
        backgroundColor: isAlt ? ALT_ROW : LIGHT_ROW,
        borderBottomWidth: isLast ? 0 : 0.6,
        borderBottomColor: BORDER,
        borderStyle: 'solid',
      }}
    >
      {children}
    </View>
  );
}

type TableCellProps = {
  label: string;
  value?: React.ReactNode;
  span?: CellSpan; // Cuántas columnas base ocupa (1, 2 o 3). Default = 1.
  isLast?: boolean; // Si es true, NO pinta border-right.
};

function TableCell({ label, value, span = 1, isLast = false }: TableCellProps) {
  return (
    <View
      style={{
        width: spanWidth(span),
        flexBasis: spanWidth(span),
        flexGrow: 0,
        flexShrink: 0,
        paddingVertical: 3,
        paddingHorizontal: 6,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        borderRightWidth: isLast ? 0 : 0.6,
        borderRightColor: BORDER,
        borderStyle: 'solid',
      }}
    >
      <Text style={styles.cellLabel}>{label}</Text>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {typeof value === 'string' ||
        typeof value === 'number' ||
        value == null ? (
          <Text style={styles.cellValue}>
            {value == null ? '' : String(value)}
          </Text>
        ) : (
          <View
            style={{
              flex: 1,
              minHeight: 12,
              justifyContent: 'center',
              alignItems: 'flex-start',
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginTop: 2,
            }}
          >
            {value}
          </View>
        )}
      </View>
    </View>
  );
}

// ============================================================
// HELPERS DE TABLA FLEX
// ============================================================
const Campo = ({
  label,
  value,
  isLast = false,
  flex = 1,
}: {
  label: string;
  value: string;
  isLast?: boolean;
  flex?: number;
}) => (
  <View
    style={[
      styles.cell,
      isLast ? styles.cellLast : undefined,
      { flexGrow: flex, flexBasis: 0, flexShrink: 1 },
    ]}
  >
    <Text style={styles.cellLabel}>{label}</Text>
    <Text style={styles.cellValue}>{value || ''}</Text>
  </View>
);

const CampoTextoAncho = ({
  label,
  value,
  minHeight = 12,
  isLast = false,
}: {
  label: string;
  value: string;
  minHeight?: number;
  isLast?: boolean;
}) => (
  // <View style={[styles.row, styles.rowLast]}>
  <View style={[styles.row, isLast ? styles.rowLast : undefined]}>
    <View style={styles.fullCell}>
      <Text style={styles.fullCellLabel}>{label}</Text>
      <View style={[{ ...styles.fullCellValue, minHeight }]}>
        <Text>{value || ''}</Text>
      </View>
    </View>
  </View>
);

const HCheckBox = ({ value }: { value: string }) => {
  const isH = value && value.toUpperCase().startsWith('H');
  const isM = value && value.toUpperCase().startsWith('M');
  return (
    <View style={styles.smallRadioBoxWrapper}>
      <View style={styles.smallRadioBox}>
        <View
          style={[styles.squareBox, isH ? styles.squareBoxFilled : undefined]}
        />
        <Text style={styles.squareLetter}>H</Text>
      </View>
      <View style={styles.smallRadioBox}>
        <View
          style={[styles.squareBox, isM ? styles.squareBoxFilled : undefined]}
        />
        <Text style={styles.squareLetter}>M</Text>
      </View>
    </View>
  );
};

const SiNoCheckBox = ({ value }: { value: string }) => {
  const up = value?.toUpperCase?.() ?? '';
  const si = up === 'SI' || up === 'SÍ' || up === 'S';
  const no = up === 'NO' || up === 'N';
  return (
    <View style={styles.siNoBoxes}>
      <View style={styles.smallRadioBox}>
        <View
          style={[styles.squareBox, si ? styles.squareBoxFilled : undefined]}
        />
        <Text style={styles.squareLetter}>SI</Text>
      </View>
      <View style={styles.smallRadioBox}>
        <View
          style={[styles.squareBox, no ? styles.squareBoxFilled : undefined]}
        />
        <Text style={styles.squareLetter}>NO</Text>
      </View>
    </View>
  );
};

// ================================================================
// COMPONENTE PRINCIPAL (Document PDF)
// ================================================================
export default function CertificadoConsultaMedica({
  datos,
}: {
  datos: FichaDatos;
}) {
  const d = datos;
  const CIRCULAR_PAGE_SIZE: [number, number] = [612, 936];
  return (
    <Document
      author="Acción Mascota - Municipalidad de Algarrobo"
      title={`Ficha Consulta Médica · ${d.paciente.nombre}`}
    >
      <Page size={CIRCULAR_PAGE_SIZE} style={styles.page}>
        {/* Esquinas decorativas */}
        <View style={styles.cornerTopRight} />
        <View style={styles.cornerMidLeft} />
        <View style={styles.cornerBottomLeft} />
        {/* Wrapper para evitar overflow fantasma */}
        <View style={styles.cornerGhostWrap}>
          <View style={styles.cornerBottomRight} />
        </View>

        {/* HEADER (titulo + logos) */}
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Ficha Consulta Médica</Text>
            <Text style={styles.subTitle}>
              Tenencia Responsable de Mascotas
            </Text>
          </View>
          <View style={styles.logosBox}>
            <View style={styles.logoBoxUnit}>
              <Image
                style={styles.logoAccionImg}
                src="/accion-mascota-logo-blue.png"
                cache={false}
              />
            </View>
            <View style={styles.logoBoxUnit}>
              <Image style={styles.logoEscudoImg} src="/escudo-nuevo.png" />
            </View>
          </View>
        </View>

        {/* DATOS RESPONSABLE */}
        <View style={styles.sectionBox}>
          <View>
            <Text style={styles.sectionTitle}>DATOS RESPONSABLE</Text>
          </View>

          {/* Row 1: Fecha / Fecha Nac / Rut */}
          <TableRow>
            <TableCell label="Fecha:" value={d.fecha} span={1} />
            <TableCell
              label="Fecha Nac.:"
              value={d.responsable.fechaNacimiento}
              span={1}
            />
            <TableCell label="Rut:" value={d.responsable.rut} span={1} isLast />
          </TableRow>

          {/* Row 2: Nombre dueño */}
          <TableRow>
            <TableCell
              label="Nombre dueño:"
              value={d.responsable.nombre}
              span={3}
              isLast
            />
          </TableRow>

          {/* Row 3: Direccion / Comuna */}
          <TableRow>
            <TableCell
              label="Dirección:"
              value={d.responsable.direccion}
              span={2}
            />
            <TableCell label="Comuna:" value={d.responsable.comuna} isLast />
          </TableRow>

          {/* Row 4: Mail / Telefono */}
          <TableRow isLast>
            <TableCell label="Mail:" value={d.responsable.mail} span={2} />
            <TableCell
              label="Teléfono:"
              value={d.responsable.telefono}
              isLast
            />
          </TableRow>
        </View>

        {/* DATOS DEL PACIENTE */}
        <View style={styles.sectionBox}>
          <View>
            <Text style={styles.sectionTitleSecondary}>DATOS DEL PACIENTE</Text>
          </View>

          {/* Row 1: Nombre mascota + Especie */}
          <TableRow>
            <TableCell
              label="Nombre mascota:"
              value={d.paciente.nombre}
              span={2}
            />
            <TableCell
              label="Especie:"
              value={d.paciente.especie}
              span={1}
              isLast
            />
          </TableRow>

          {/* Row 2: Raza / Color / Sexo H-M */}
          <TableRow isAlt>
            <TableCell label="Raza:" value={d.paciente.raza} />
            <TableCell label="Color:" value={d.paciente.color} />
            <TableCell
              label="Sexo:"
              value={<HCheckBox value={d.paciente.sexo} />}
              isLast
            />
          </TableRow>

          {/* Row 3: Fecha nac. / Patrón / Peso */}
          <TableRow>
            <TableCell label="Fecha Nac.:" value={d.paciente.fechaNacimiento} />
            <TableCell label="Patrón:" value={d.paciente.patron} />
            <TableCell label="Peso:" value={d.paciente.peso} isLast />
          </TableRow>

          {/* Row 4: Modo de obtención + Microchip */}
          <TableRow isAlt>
            <TableCell
              label="Modo de obtención:"
              value={d.paciente.modoObtencion}
              span={2}
            />
            <TableCell
              label="Microchip:"
              value={d.paciente.microchip}
              span={1}
              isLast
            />
          </TableRow>

          {/* Row 5: Razón tenencia + Esterilizado SI-NO */}
          <TableRow isLast>
            <TableCell
              label="Razón de tenencia:"
              value={d.paciente.razonTenencia}
              span={2}
            />
            <TableCell
              label="Esterilizado:"
              value={<SiNoCheckBox value={d.paciente.esterilizado} />}
              span={1}
              isLast
            />
          </TableRow>

          {/* ÁREA CLÍNICA (7 textareas anchas con rayas horizontales) */}
          <View
            style={{
              borderTop: `0.7 solid ${BORDER}`,
            }}
          >
            <CampoTextoAncho
              label="Motivo Consulta:"
              value={d.clinica.motivo}
            />
            <CampoTextoAncho
              label="Anamnesis:"
              value={d.clinica.anamnesis}
              minHeight={48}
            />
            <CampoTextoAncho
              label="Examen Físico:"
              value={d.clinica.examenFisico}
              minHeight={48}
            />
            <CampoTextoAncho label="Pre Dx:" value={d.clinica.preDx} />
            <CampoTextoAncho
              label="Exámenes a solicitar:"
              value={d.clinica.examenes}
            />
            <CampoTextoAncho
              label="Tratamiento:"
              isLast={true}
              value={d.clinica.tratamiento}
              minHeight={48}
            />
          </View>
        </View>

        {/* DATOS MEDICO VETERINARIO */}
        <View style={styles.sectionBox}>
          <View>
            <Text style={styles.sectionTitleSecondary}>
              DATOS MÉDICO VETERINARIO
            </Text>
          </View>
          <View style={styles.row}>
            <Campo label="Nombres:" value={d.veterinario.nombres} />
            <Campo label="Apellidos:" value={d.veterinario.apellidos} isLast />
          </View>
          <View style={[styles.row, styles.rowLast]}>
            <Campo label="Rut:" value={d.veterinario.rut} />
            <Campo label="Comuna:" value={d.veterinario.comuna} isLast />
          </View>
        </View>

        {/* CONSENTIMIENTO */}
        <View style={styles.sectionBox}>
          <View>
            <Text style={styles.sectionTitleSecondary}>
              CONSENTIMIENTO DE REGISTRO
            </Text>
          </View>
          <View style={styles.consentimientoBox}>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Entiendo que se ha implantado/verificado el microchip en mi
                mascota, vinculado a mis datos personales, y autorizo su
                inscripción en el Registro Nacional de Mascotas.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Autorizo la difusión de mis datos (teléfonos y correo) en caso
                de extravío de mi mascota.
              </Text>
            </View>
            <View style={styles.bulletRow}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.bulletText}>
                Declaro no me encuentro afecto a la Inhabilidad absoluta y
                perpetua para la Tenencia de Animales, pena por simple delito
                contemplada en el Artículo 21 del Código Penal, para las
                personas que sean condenadas por el Delito de Maltrato o
                Crueldad Animal tipificado en el Artículo 291 Bis y Ter del
                Código Penal.
              </Text>
            </View>
          </View>
        </View>

        {/* ---------------- FIRMAS ---------------- */}
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>
              Firma de Tutor Responsable
            </Text>
          </View>
          <View style={styles.signatureLine}>
            <Text style={styles.signatureLabel}>
              Firma y timbre Médico Veterinario
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
