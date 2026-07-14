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
