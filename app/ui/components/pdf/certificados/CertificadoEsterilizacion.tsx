import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  SECONDARY_HEADER_BG,
  HEADER_BG,
  certStyles,
  CornerTriangle,
  HCheckBox,
  SiNoCheckBox,
  TableCell,
  TableRow,
  Campo,
} from '../PdfTheme';
import { EsterilizacionPayload } from '../Certificado';

const customStyles = StyleSheet.create({
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

  bulletText: {
    flex: 1,
    fontSize: 7.3,
    color: '#1e293b',
    lineHeight: 1.18,
    textAlign: 'justify',
  },
});

export default function CertificadoEsterilizacion({
  datos,
}: {
  datos: EsterilizacionPayload;
}) {
  const d = datos;
  const CIRCULAR_PAGE_SIZE: [number, number] = [612, 936];
  return (
    <Document
      author="Acción Mascota - Municipalidad de Algarrobo"
      title={`Ficha Esterilización · ${d.paciente.nombre}`}
    >
      <Page size={CIRCULAR_PAGE_SIZE} style={certStyles.page}>
        {/* Esquinas decorativas */}
        <View style={certStyles.cornerTopRight} />
        <View style={certStyles.cornerMidLeft} />
        <View style={certStyles.cornerBottomLeft} />
        <View style={certStyles.cornerGhostWrap}>
          <CornerTriangle />
        </View>

        {/* HEADER (titulo + logos) */}
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

            <View style={certStyles.headerBoxesCol}>
              <View style={certStyles.headerMicrochipBox}>
                <View style={certStyles.headerCodeBoxTextContainer}>
                  <Text style={certStyles.headerCodeBoxText}>
                    Etiqueta o número de microchip
                  </Text>
                </View>
                <View style={certStyles.headerCodeBoxValue}>
                  <Text style={certStyles.headerMicrochipBoxText}>
                    {d.paciente.microchip || ''}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={certStyles.titleContainer}>
            <Text style={certStyles.mainTitle}>Ficha Esterilización</Text>
            <Text style={certStyles.subTitle}>
              Documento de Identificación, Consentimiento y Declaración simple
            </Text>
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
            <Text style={certStyles.sectionTitleSecondary}>
              DATOS MÉDICO VETERINARIO
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
                Por el presente documento autorizo el procedimiento de
                Esterilización al paciente indicado en esta ficha, el que es de
                mi propiedad y del cual me haré responsable para efectos de
                ciudado.
              </Text>
            </View>
          </View>
        </View>

        {/* ESTERILIZACIÓN */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>
              ESTERILIZACIÓN
            </Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            {/* 1 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro que se me ha explicado detalladamente el procedimiento
                quirúrgico de extracción definitiva de los órganos reproductivos
                de mi mascota.
              </Text>
            </View>
            {/* 2 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Entiendo que el procedimiento conlleva riesgos generales y
                complicaciones, que podrían incluso causar la muerte en un bajo
                porcentaje de casos.
              </Text>
            </View>
            {/* 3 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Acepto que la cirugía requiere sedación y anestecia general, lo
                que puede generar complicaciones.
              </Text>
            </View>
            {/* 4 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Entiendo que el cirujano puede suspender o modificar la técnica
                durante la intervención por el bienestar del paciente.
              </Text>
            </View>
            {/* 5 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Reconozco que, en algunos casos, pueden ser necesarios
                procedimientos adicionales, los cuales asumiré económicamente.
              </Text>
            </View>
            {/* 6 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Confirmo que he proporcionado información veraz sobre la salud
                de mi mascota, incluyendo síntomas recientes.
              </Text>
            </View>
            {/* 7 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Acepto cumplir con las indicaciones de ayuno y traer los
                implementos solicitados para la cirugía.
              </Text>
            </View>
            {/* 8 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Consiento que se le realice un tatuaje en una de sus orejas como
                registro de la esterilización.
              </Text>
            </View>
            {/* 9 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Entiendo que traer a un animal sin dueño no implica su
                propiedad, pero sí la responsabilidad de sus cuidados durante la
                recuperación.
              </Text>
            </View>
          </View>
        </View>

        {/* REGISTRO */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>REGISTRO</Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            {/* 1 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Entiendo que se ha implantado un microchip en mi mascota,
                vinculado a mis datos personales, y autorizo a su inscripción en
                el Registro Nacional de Mascotas.
              </Text>
            </View>
            {/* 2 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Autorizo la difusión de mis datos (teléfonos y correo) en caso
                de extravío de mi mascota.
              </Text>
            </View>
            {/* 1 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro no me encuentro afecto a la inhabilidad absoluta y
                perpetua para la Tenencia de Animales, pena por simple delito
                contemplada en el Artículo 21 del Código Penal, para las
                personas que sean condenadas por el Delito de Maltrato o
                Crueldad Animal, tipificado en el Artículo 291 Bis y Ter del
                Código Penal.
              </Text>
            </View>
          </View>
        </View>

        {/* CUIDADOS POST OPERATORIOS */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={customStyles.sectionTitleSecondary}>
              CUIDADOS POST OPERATORIOS
            </Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            {/* 1 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Declaro haber recibido y comprendido el documento de cuidados
                post-operatorios de mi mascota, asumiendo total responsabilidad
                por su seguimiento.
              </Text>
            </View>
            {/* 2 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Entiendo los riesgos para su bienestar si no sigo las
                indicaciones dadas.
              </Text>
            </View>
            {/* 3 */}
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={customStyles.bulletText}>
                Me han explicado las posibles complicaciones durante el
                procedimiento, y me haré cargo de la receta, controles y otros
                aspectos indicados.
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
