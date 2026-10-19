import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import {
  SECONDARY_HEADER_BG,
  Campo,
  CampoTextoAncho,
  certStyles,
  HCheckBox,
  SiNoCheckBox,
  TableCell,
  TableRow,
} from '../PdfTheme';
import { ConsultaMedicaPayload } from '../Certificado';

export default function CertificadoConsultaMedica({
  datos,
}: {
  datos: ConsultaMedicaPayload;
}) {
  const d = datos;
  const CIRCULAR_PAGE_SIZE: [number, number] = [612, 936];
  return (
    <Document
      author="Acción Mascota - Municipalidad de Algarrobo"
      title={`Ficha Consulta Médica · ${d.paciente.nombre}`}
    >
      <Page size={CIRCULAR_PAGE_SIZE} style={certStyles.page}>
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
            <Text style={certStyles.mainTitle}>Ficha Consulta Médica</Text>
            <Text style={certStyles.subTitle}>
              Tenencia Responsable de Mascotas
            </Text>
          </View>
        </View>

        {/* DATOS RESPONSABLE */}
        <View style={certStyles.sectionBox}>
          <View>
            <Text style={certStyles.sectionTitle}>DATOS RESPONSABLE</Text>
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
            <Text style={certStyles.sectionTitleSecondary}>
              DATOS DEL PACIENTE
            </Text>
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
              borderTop: `1 solid ${SECONDARY_HEADER_BG}`,
            }}
          >
            <CampoTextoAncho
              label="Motivo Consulta:"
              value={d.clinica.motivo}
            />
            <CampoTextoAncho label="Anamnesis:" value={d.clinica.anamnesis} />
            <CampoTextoAncho
              label="Examen Físico:"
              value={d.clinica.examenFisico}
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
            />
          </View>
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

        {/* CONSENTIMIENTO */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={certStyles.sectionTitleSecondary}>
              CONSENTIMIENTO DE REGISTRO
            </Text>
          </View>
          <View style={certStyles.consentimientoBox}>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={certStyles.bulletText}>
                Entiendo que se ha implantado/verificado el microchip en mi
                mascota, vinculado a mis datos personales, y autorizo su
                inscripción en el Registro Nacional de Mascotas.
              </Text>
            </View>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={certStyles.bulletText}>
                Autorizo la difusión de mis datos (teléfonos y correo) en caso
                de extravío de mi mascota.
              </Text>
            </View>
            <View style={certStyles.bulletRow}>
              <Text style={certStyles.bullet}>•</Text>
              <Text style={certStyles.bulletText}>
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
