// Currency and string formatters

export function formatCurrency(amount, currency = '$U') {
  if (amount === undefined || amount === null || isNaN(amount)) return `${currency} 0`;
  const formattedNumber = new Intl.NumberFormat('es-UY', {
    maximumFractionDigits: 0
  }).format(Math.round(amount));
  return `${currency} ${formattedNumber}`;
}

export function sanitizeText(text) {
  if (!text) return '';
  return text.trim();
}
