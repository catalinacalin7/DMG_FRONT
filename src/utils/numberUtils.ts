export const toDecimal = (value: number): string => {
  return (value / 100).toFixed(2);
};

export const toInteger = (value: string): number => {
  const parsed = parseFloat(value);
  if (isNaN(parsed)) return 0;
  return Math.round(parsed * 100);
};
