import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from '@react-pdf/renderer';
import {
  certStyles,
  CornerTriangle,
  EsDuenoCheckBox,
  HCheckBox,
  SiNoCheckBox,
  TableCell,
  TableCellItemTitle,
  TableRow,
  VaccineCheckBox,
} from '../PdfTheme';
import { OperativoSanitarioPayload } from '../Certificado';

const customStyles = StyleSheet.create({
  bulletText: {
    flex: 1,
    fontSize: 7.3,
    color: '#1e293b',
    lineHeight: 1.18,
    textAlign: 'justify',
  },
});

export default function CertificadoOperativoSanitario({
  datos,
}: {
  datos: OperativoSanitarioPayload;
}) {
  const d = datos;
  // const CIRCULAR_PAGE_SIZE: [number, number] = [612, 936];
  const CIRCULAR_PAGE_SIZE = 'LETTER';

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
            <Text style={certStyles.mainTitle}>Ficha Operativo Sanitario</Text>
            <Text style={certStyles.subTitle}>
              Documento de Identificación, Consentimiento y Declaración simple
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
              label="Atención:"
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
              label="Nombre:"
              value={d.responsable.nombre}
              span={2}
              isLight={false}
            />
            <TableCell
              label="Rol:"
              value={<EsDuenoCheckBox value={d.responsable.rol} />}
              span={1}
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

          {/* Row 1: Nombre mascota / Especie / Raza */}
          <TableRow>
            <TableCell label="Nombre:" value={d.paciente.nombre} />
            <TableCell label="Especie:" value={d.paciente.especie} />
            <TableCell label="Raza:" value={d.paciente.raza} isLast />
          </TableRow>

          {/* Row 2: Fecha Nac. / Sexo / Color */}
          <TableRow isAlt>
            <TableCell label="Fecha Nac.:" value={d.paciente.fechaNacimiento} />
            <TableCell
              label="Sexo:"
              value={<HCheckBox value={d.paciente.sexo} />}
            />
            <TableCell label="Color:" value={d.paciente.color} isLast />
          </TableRow>

          {/* Row 3: Tipo Tenencia / Patrón / Peso */}
          <TableRow>
            <TableCell label="Tipo Tenencia:" value={d.paciente.tipoTenencia} />
            <TableCell label="Patrón:" value={d.paciente.patron} />
            <TableCell label="Peso:" value={d.paciente.peso} isLast />
          </TableRow>

          {/* Row 4: Razón de tenencia / Modo de obtención / Mascotas en Casa */}
          <TableRow>
            <TableCell
              label="Razón de tenencia:"
              value={d.paciente.razonTenencia}
            />
            <TableCell
              label="Modo de obtención:"
              value={d.paciente.modoObtencion}
            />
            <TableCell label="Mascotas en Casa:" value="3" isLast />
          </TableRow>

          {/* Row 5: Primera Visita? / Microchip implantado hoy? / Esterilizado SI-NO */}
          <TableRow isLast>
            <TableCell
              label="¿Primera Visita Vet?:"
              value={<SiNoCheckBox value={d.paciente.esterilizado} />}
            />
            <TableCell
              label="¿Microchip implantado hoy?:"
              value={<SiNoCheckBox value={d.paciente.esterilizado} />}
            />
            <TableCell
              label="Esterilizado:"
              value={<SiNoCheckBox value={d.paciente.esterilizado} />}
              isLast
            />
          </TableRow>
        </View>

        {/* DATOS PROCEDIMIENTOS Y RESULTADOS */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={certStyles.sectionTitleSecondary}>
              PROCEDIMIENTOS Y RESULTADOS
            </Text>
          </View>

          {/* <TableRow>
            <TableCell
              label="Vacunas:"
              value={<VaccineCheckBox list={d.procedimientos} />}
              isLast
            />
          </TableRow> */}

          <TableRow>
            {/* <TableCellItemTitle label={vacunaLabel} span={1} /> */}
            {/* <TableCell
              label=""
              value={
                vacuna ? (
                  <View style={certStyles.vaccineItem}>
                    <View
                      style={[certStyles.squareBox, certStyles.squareBoxFilled]}
                    />
                    <Text style={certStyles.vaccineLabel}>
                      {vacuna.nombre}
                    </Text>
                  </View>
                ) : null
              }
              span={1}
            /> */}
            {/* <TableCell
              label="Vacuna:"
              value={
                d.procedimientos.find(
                  (item) =>
                    item.codigo === 'OCTUPLE' || item.codigo === 'TRIPLE_FELINA'
                )?.nombre || ''
              }
              span={5}
            /> */}
            <TableCell
              label="Vacuna:"
              value={<VaccineCheckBox list={d.procedimientos} />}
              span={5}
            />

            <TableCell
              label="Antirrábica:"
              value={
                d.procedimientos.find((item) => item.codigo === 'ANTIRRABICA')
                  ? 'Aplicada'
                  : 'No Aplicada'
              }
              span={3}
            />
            <TableCell label="N° Serie:" value="" span={3} isLast />
          </TableRow>

          <TableRow>
            <TableCellItemTitle label="Desparasitación Int" value="" span={2} />
            <TableCell label="Fármaco:" value="" span={3} />
            <TableCell label="Dosis:" value="" span={3} />
            <TableCell label="Presentación:" value="" span={3} isLast />
          </TableRow>

          <TableRow>
            <TableCellItemTitle label="Desparasitación Ext" value="" span={2} />
            <TableCell label="Fármaco:" value="" span={3} />
            <TableCell label="Dosis:" value="" span={3} />
            <TableCell label="Presentación:" value="" span={3} isLast />
          </TableRow>

          <TableRow isLast>
            <TableCell
              label="Nombre Veterinario:"
              value={d.veterinario.nombre}
              span={8}
            />
            <TableCell label="Rut:" value={d.veterinario.rut} span={3} isLast />
          </TableRow>
        </View>

        {/* AUTORIZACION */}
        <View style={certStyles.sectionBoxLight}>
          <View>
            <Text style={certStyles.sectionTitleSecondary}>AUTORIZACIÓN</Text>
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
            <Text style={certStyles.sectionTitleSecondary}>
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
            <Text style={certStyles.sectionTitleSecondary}>
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
            <Text style={certStyles.sectionTitleSecondary}>EGRESO</Text>
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
