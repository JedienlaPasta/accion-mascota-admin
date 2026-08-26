export function validateMicrochip(microchip: string) {
  if (!microchip) return [];
  const warnings: string[] = [];
  const cleanChip = microchip.trim();

  // Estructura básica
  const isoRegex = /^\d{15}$/;
  if (!isoRegex.test(cleanChip)) {
    warnings.push('El código no sigue el estándar de 15 dígitos numéricos.');
  }

  // Validación de prefijos (Reglas de negocio)
  const prefix = parseInt(cleanChip.substring(0, 3), 10);
  const isChileCountryCode = prefix === 152;
  const isManufacturerCode = prefix >= 900 && prefix <= 998;

  if (!isChileCountryCode && !isManufacturerCode) {
    warnings.push(`El prefijo ${prefix} es atípico. Posible error de tipeo.`);
  }

  return warnings;
}

export const validateRutDv = (rut: string) => {
  const clean = rut.replace(/[.\-\s]/g, '').toUpperCase();
  if (clean.length < 2)
    return { valid: null as null | boolean, expectedDv: '-', actualDv: '-' };
  const dv = clean.slice(-1);
  const body = clean.slice(0, -1);
  if (!/^\d+$/.test(body))
    return { valid: false, expectedDv: '-', actualDv: dv };

  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const remainder = 11 - (sum % 11);
  const expected =
    remainder === 11 ? '0' : remainder === 10 ? 'K' : String(remainder);
  return { valid: expected === dv, expectedDv: expected, actualDv: dv };
};

export function queryFilterChecker(query: string): {
  hasFilter: boolean;
  term: string;
} {
  const q = query?.trim() ?? '';
  if (q.length === 0) return { hasFilter: false, term: '' };
  return { hasFilter: true, term: `%${q}%` };
}
