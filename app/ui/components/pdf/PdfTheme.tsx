import { Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// ================================================================
// CONSTANTES (Tema / Paleta de colores)
// ================================================================
export const HEADER_BG = '#1c2752'; // azul oscuro
export const BORDER = '#1e3a8a';
export const LIGHT_ROW = '#ffffff';
export const ALT_ROW = '#f8fafc';
export const GRAY_TEXT = '#334155';
export const SECONDARY_HEADER_BG = '#4c82c2'; // azul medio

// ================================================================
// FONT: Outfit (archivos static OBLIGATORIOS en /public/fonts/*.ttf)
// ================================================================
try {
  Font.register({
    family: 'Outfit',
    fonts: [
      {
        src: '/fonts/Outfit-Regular.ttf',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
      { src: '/fonts/Outfit-Medium.ttf', fontWeight: 500, fontStyle: 'normal' },
      {
        src: '/fonts/Outfit-Bold.ttf',
        fontWeight: 'bold',
        fontStyle: 'normal',
      },
    ],
  });
} catch (fontError) {
  console.warn(
    '[PdfTheme] No se cargó la fuente Outfit. Revisa public/fonts/. Fallback: Helvetica.',
    fontError instanceof Error ? fontError.message : fontError
  );
}

// ================================================================
// STYLE SHEET COMPARTIDO (usa TODO certificado sin repetir)
// ================================================================
export const certStyles = StyleSheet.create({
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
    backgroundColor: '#93c5fd',
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
    backgroundColor: '#bfdbfe',
  },
  cornerGhostWrap: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
  },

  // HEADER (titles + logos)
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 0,
    paddingBottom: 10,
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
    marginBottom: 4,
    overflow: 'hidden',
  },
  sectionBoxLight: {
    border: `1 solid ${SECONDARY_HEADER_BG}`,
    marginBottom: 4,
    overflow: 'hidden',
  },
  sectionTitle: {
    margin: -1,
    marginBottom: 0,
    backgroundColor: HEADER_BG,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    letterSpacing: 0.4,
  },
  sectionTitleSecondary: {
    margin: -1,
    marginBottom: 0,
    backgroundColor: SECONDARY_HEADER_BG,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
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
    fontSize: 8,
    marginRight: 4,
    paddingTop: 1,
  },
  cellValue: {
    flex: 1,
    color: '#1e293b',
    fontSize: 8,
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
    paddingHorizontal: 6,
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

// ============================================================
// HELPERS DE TABLA %
// ============================================================
export type CellSpan = 1 | 2 | 3;

export function spanWidth(span: CellSpan): `${number}%` {
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
  isLight?: boolean;
};

export function TableRow({
  children,
  isAlt = false,
  isLast = false,
  isLight = true,
}: TableRowProps) {
  const borderColor = isLight ? SECONDARY_HEADER_BG : BORDER;
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'stretch',
        minHeight: 19,
        backgroundColor: isAlt ? ALT_ROW : LIGHT_ROW,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: borderColor,
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
  span?: CellSpan;
  isLast?: boolean;
  isLight?: boolean;
};

export function TableCell({
  label,
  value,
  span = 1,
  isLast = false,
  isLight = true,
}: TableCellProps) {
  const borderColor = isLight ? SECONDARY_HEADER_BG : BORDER;
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
        borderRightWidth: isLast ? 0 : 1,
        borderRightColor: borderColor,
        borderStyle: 'solid',
      }}
    >
      <Text style={certStyles.cellLabel}>{label}</Text>
      <View style={{ flex: 1, justifyContent: 'flex-end' }}>
        {typeof value === 'string' ||
        typeof value === 'number' ||
        value == null ? (
          <Text style={certStyles.cellValue}>
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
export const Campo = ({
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
      certStyles.cell,
      isLast ? certStyles.cellLast : undefined,
      { flexGrow: flex, flexBasis: 0, flexShrink: 1 },
    ]}
  >
    <Text style={certStyles.cellLabel}>{label}</Text>
    <Text style={certStyles.cellValue}>{value || ''}</Text>
  </View>
);

export const CampoTextoAncho = ({
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
  <View style={[certStyles.row, isLast ? certStyles.rowLast : undefined]}>
    <View style={certStyles.fullCell}>
      <Text style={certStyles.fullCellLabel}>{label}</Text>
      <View style={[{ ...certStyles.fullCellValue, minHeight }]}>
        <Text>{value || ''}</Text>
      </View>
    </View>
  </View>
);

export const HCheckBox = ({ value }: { value: string }) => {
  const isH = value && value.toUpperCase().startsWith('H');
  const isM = value && value.toUpperCase().startsWith('M');
  return (
    <View style={certStyles.smallRadioBoxWrapper}>
      <View style={certStyles.smallRadioBox}>
        <View
          style={[
            certStyles.squareBox,
            isH ? certStyles.squareBoxFilled : undefined,
          ]}
        />
        <Text style={certStyles.squareLetter}>H</Text>
      </View>
      <View style={certStyles.smallRadioBox}>
        <View
          style={[
            certStyles.squareBox,
            isM ? certStyles.squareBoxFilled : undefined,
          ]}
        />
        <Text style={certStyles.squareLetter}>M</Text>
      </View>
    </View>
  );
};

export const SiNoCheckBox = ({ value }: { value: string }) => {
  const up = value?.toUpperCase?.() ?? '';
  const si = up === 'SI' || up === 'SÍ' || up === 'S';
  const no = up === 'NO' || up === 'N';
  return (
    <View style={certStyles.siNoBoxes}>
      <View style={certStyles.smallRadioBox}>
        <View
          style={[
            certStyles.squareBox,
            si ? certStyles.squareBoxFilled : undefined,
          ]}
        />
        <Text style={certStyles.squareLetter}>SI</Text>
      </View>
      <View style={certStyles.smallRadioBox}>
        <View
          style={[
            certStyles.squareBox,
            no ? certStyles.squareBoxFilled : undefined,
          ]}
        />
        <Text style={certStyles.squareLetter}>NO</Text>
      </View>
    </View>
  );
};
