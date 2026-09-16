import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  ALT_ROW,
  BORDER,
  GRAY_TEXT,
  LIGHT_ROW,
  SECONDARY_HEADER_BG,
  HEADER_BG,
  Campo,
  certStyles,
  HCheckBox,
  SiNoCheckBox,
  TableCell,
  TableRow,
} from '../PdfTheme';
import { OperativoSanitarioPayload } from '../Certificado';

const customStyles = StyleSheet.create({
  page: {
    padding: 24,
    paddingTop: 30,
    fontFamily: 'Outfit',
    fontSize: 9,
    backgroundColor: '#fff',
    position: 'relative',
    overflow: 'hidden',
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

  sectionBox: {
    border: `1 solid ${BORDER}`,
    marginBottom: 10,
    overflow: 'hidden',
  },
  sectionBoxLight: {
    border: `1 solid ${SECONDARY_HEADER_BG}`,
    marginBottom: 10,
    overflow: 'hidden',
  },
  sectionTitle: {
    margin: -1,
    marginBottom: 0,
    backgroundColor: HEADER_BG,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingVertical: 5, // 5 original + 1 para compensar margin -1 top
    paddingHorizontal: 7, // 9 original + 1 para compensar margin -1 left/right
    letterSpacing: 0.4,
  },
  sectionTitleSecondary: {
    margin: -1,
    marginBottom: 0,
    backgroundColor: SECONDARY_HEADER_BG,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingVertical: 5,
    paddingHorizontal: 7,
    letterSpacing: 0.4,
  },

  // ROWS / COLS
  row: {
    flexDirection: 'row',
    minHeight: 19,
    borderBottom: `1 solid ${SECONDARY_HEADER_BG}`,
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
    borderRight: `1 solid ${SECONDARY_HEADER_BG}`,
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
    border: `1 solid ${BORDER}`,
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
    fontSize: 7.3,
    color: '#1e293b',
    lineHeight: 1.18,
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

export default function CertificadoOperativoSanitario({
  datos,
}: {
  datos: OperativoSanitarioPayload;
}) {
  const d = datos;
  const CIRCULAR_PAGE_SIZE: [number, number] = [612, 936];
  return (
    <Document
      author="Acción Mascota - Municipalidad de Algarrobo"
      title={`Ficha Consulta Médica · ${d.paciente.nombre}`}
    >
      <Page size={CIRCULAR_PAGE_SIZE} style={customStyles.page}>
        {/* Esquinas decorativas */}
        <View style={certStyles.cornerTopRight} />
        <View style={certStyles.cornerMidLeft} />
        <View style={certStyles.cornerBottomLeft} />
        {/* Wrapper para evitar overflow fantasma */}
        <View style={certStyles.cornerGhostWrap}>
          <View style={certStyles.cornerBottomRight} />
        </View>

        {/* HEADER (titulo + logos) */}
        <View style={certStyles.headerRow}>
          <View style={certStyles.titleContainer}>
            <Text style={certStyles.mainTitle}>Ficha Operativo Sanitario</Text>
            <Text style={certStyles.subTitle}>
              Documento de Identificación, Consentimiento Informado y
              Declaración simple
            </Text>
          </View>
          <View style={certStyles.logosBox}>
            <View style={certStyles.logoBoxUnit}>
              <Image
                style={certStyles.logoAccionImg}
                src="/accion-mascota-logo-blue.png"
                cache={false}
              />
            </View>
            <View style={certStyles.logoBoxUnit}>
              <Image style={certStyles.logoEscudoImg} src="/escudo-nuevo.png" />
            </View>
          </View>
        </View>

        {/* DATOS RESPONSABLE */}
        <View style={certStyles.sectionBox}>
          <View>
            <Text style={customStyles.sectionTitle}>DATOS RESPONSABLE</Text>
          </View>

          {/* Row 1: Fecha / Fecha Nac / Rut */}
          <TableRow isLight={false}>
            <TableCell
              label="Fecha:"
              value={d.fecha}
              span={1}
              isLight={false}
            />
            <TableCell
              label="Fecha Nac.:"
              value={d.responsable.fechaNacimiento}
              span={1}
              isLight={false}
            />
            <TableCell
              label="Rut:"
              value={d.responsable.rut}
              span={1}
              isLight={false}
              isLast
            />
          </TableRow>

          {/* Row 2: Nombre dueño */}
          <TableRow isLight={false}>
            <TableCell
              label="Nombre Dueño:"
              value={d.responsable.nombre}
              span={3}
              isLight={false}
              isLast
            />
          </TableRow>

          {/* Row 3: Direccion / Comuna */}
          <TableRow isLight={false}>
            <TableCell
              label="Dirección:"
              value={d.responsable.direccion}
              span={2}
              isLight={false}
            />
            <TableCell
              label="Comuna:"
              value={d.responsable.comuna}
              isLight={false}
              isLast
            />
          </TableRow>

          {/* Row 4: Mail / Telefono */}
          <TableRow isLight={false} isLast>
            <TableCell
              label="Mail:"
              value={d.responsable.mail}
              span={2}
              isLight={false}
            />
            <TableCell
              label="Teléfono:"
              value={d.responsable.telefono}
              isLight={false}
              isLast
            />
          </TableRow>
        </View>

        {/* DATOS DEL PACIENTE */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>
              DATOS DEL PACIENTE
            </Text>
          </View>

          {/* Row 1: Nombre mascota + Especie */}
          <TableRow>
            <TableCell label="Nombre:" value={d.paciente.nombre} />
            <TableCell label="Especie:" value={d.paciente.especie} />
            <TableCell label="Raza:" value={d.paciente.raza} isLast />
          </TableRow>

          {/* Row 2: Raza / Color / Sexo H-M */}
          <TableRow isAlt>
            <TableCell label="Fecha Nac.:" value={d.paciente.fechaNacimiento} />
            <TableCell
              label="Sexo:"
              value={<HCheckBox value={d.paciente.sexo} />}
            />
            <TableCell label="Color:" value={d.paciente.color} isLast />
          </TableRow>

          {/* Row 3: Fecha nac. / Patrón / Peso */}
          <TableRow>
            <TableCell label="Tipo Tenencia:" value={d.paciente.tipoTenencia} />
            <TableCell label="Patrón:" value={d.paciente.patron} />
            <TableCell label="Peso:" value={d.paciente.peso} isLast />
          </TableRow>

          {/* Row 4: Tipo Tenencia + Modo de obtención */}
          <TableRow>
            <TableCell
              label="Modo de obtención:"
              value={d.paciente.modoObtencion}
              span={2}
            />
            <TableCell
              label="Esterilizado:"
              value={<SiNoCheckBox value={d.paciente.esterilizado} />}
              span={1}
              isLast
            />
          </TableRow>

          {/* Row 4: Modo de obtención + Microchip */}
          {/* <TableRow isAlt>
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
          </TableRow> */}

          {/* Row 5: Razón tenencia + Esterilizado SI-NO */}
          <TableRow>
            <TableCell
              label="Razón de tenencia:"
              value={d.paciente.razonTenencia}
              span={2}
            />
            <TableCell label="Mascotas en Casa:" value="3" span={1} isLast />
          </TableRow>

          <TableRow isLast>
            <TableCell
              label="¿Primera Visita Vet?:"
              value={<SiNoCheckBox value={d.paciente.esterilizado} />}
            />
            <TableCell
              label="¿Microchip implantado hoy?:"
              value={<SiNoCheckBox value={d.paciente.esterilizado} />}
            />
            <TableCell label="Microchip:" value={d.paciente.microchip} isLast />
          </TableRow>
        </View>

        {/* DATOS MEDICO VETERINARIO */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>
              PROCEDIMIENTOS Y RESULTADOS
            </Text>
          </View>
          <View style={certStyles.row}>
            <Campo
              label="Nombre completo:"
              value={d.veterinario.nombre}
              isLast
            />
          </View>
          <View style={[certStyles.row, certStyles.rowLast]}>
            <Campo label="Rut:" value={d.veterinario.rut} />
            <Campo label="Comuna:" value={d.veterinario.comuna} isLast />
          </View>
        </View>

        {/* AUTORIZACION */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>AUTORIZACIÓN</Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Por el presente documento autorizo la realización de los
                procedimientos señalados en esta ficha al paciente
                individualizado, del cual soy propietario/a o bien asumo su
                cuidado y responsabilidad para los efectos de esta atención.
                Declaro que toda la información entregada para la confección de
                esta ficha es verdadera y fidedigna.
              </Text>
            </View>
          </View>
        </View>

        {/* ASISTENCIA SANITARIA */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>
              ASISTENCIA SANITARIA
            </Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro que se me ha explicado en qué consiste la atención
                sanitaria a mi mascota, entre ellas: vacunación antirrábica,
                vacunación perro/gato y desparasitación interna y externa, según
                corresponda.
              </Text>
            </View>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro que se me han explicado los calendarios de vacunación y
                desparasitación que la mascota requiere después de esta
                atención, comprometiéndome a cumplirlos. Entiendo que estos
                insumos y refuerzos NO necesariamente serán entregados por la
                Municipalidad con posterioridad y que son de mi exclusiva
                responsabilidad.
              </Text>
            </View>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro que la información entregada sobre la salud de mi
                mascota es veraz. Informo en particular si en los últimos 10
                días ha presentado: vómitos, diarrea, tos, secreciones oculares
                o nasales, decaimiento, anorexia, traumas u otros signos; así
                como si recibe tratamiento, padece alguna enfermedad o condición
                médica crónica.
              </Text>
            </View>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Entiendo que, luego de la evaluación clínica del médico
                veterinario, el procedimiento puede ser rechazado o diferido por
                motivos de salud del animal, sin derecho a reclamo.
              </Text>
            </View>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Si la mascota atendida no tuviera dueño identificable, entiendo
                que el solo hecho de traerla no me atribuye la propiedad sobre
                ella, sin embargo, asumo íntegramente la responsabilidad de sus
                cuidados y del cumplimiento de todas las indicaciones entregadas
                por el médico veterinario tratante.
              </Text>
            </View>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro que NO me encuentro afecto a la inhabilidad absoluta y
                perpetua para la tenencia de animales, establecida en el
                artículo 21 del Código Penal para personas condenadas por el
                delito de maltrato o crueldad animal tipificado en los artículos
                291 bis y 291 ter del mismo cuerpo legal.
              </Text>
            </View>
          </View>
        </View>

        {/* REGISTRO E IDENTIFICACIÓN */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>
              REGISTRO E IDENTIFICACIÓN
            </Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro entender que, si corresponde, a mi mascota se le
                implanta un microchip de identificación: dispositivo electrónico
                subcutáneo con un número único, que quedará vinculado a mis
                datos personales. En consecuencia, autorizo a la Municipalidad a
                inscribir a la mascota en el Registro Nacional de Mascotas y
                Animales de Compañía y a exhibir mis datos de contacto —
                teléfono fijo, teléfono móvil y correo electrónico —
                exclusivamente en caso de extravío del animal.
              </Text>
            </View>
          </View>
        </View>

        {/* EGRESO */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>EGRESO</Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro haber recibido a mi mascota conforme y que se me han
                explicado las eventuales complicaciones del procedimiento, en
                caso de existir. Me comprometo a dar cumplimiento estricto a la
                receta médica, los controles, los cuidados en el hogar y
                cualquier otra indicación que me haya entregado el equipo de
                salud veterinaria.
              </Text>
            </View>
          </View>
        </View>

        {/* ---------------- FIRMAS ---------------- */}
        <View style={certStyles.signatureBox}>
          <View style={certStyles.signatureLine}>
            <Text style={certStyles.signatureLabel}>
              Firma de Tutor Responsable
            </Text>
          </View>
          <View style={certStyles.signatureLine}>
            <Text style={certStyles.signatureLabel}>
              Firma y timbre Médico Veterinario
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
