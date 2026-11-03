export const parseCurrency = (value) => {
  const normalized = String(value ?? '').trim().replace(/[^\d,.-]/g, '');
  const parsedValue = normalized.includes(',')
    ? normalized.replace(/\./g, '').replace(',', '.')
    : normalized;
  const amount = Number(parsedValue);

  return Number.isFinite(amount) ? amount : 0;
};

export const formatCurrency = (value) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
}).format(value);
