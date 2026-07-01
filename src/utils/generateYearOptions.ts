export const generateYearOptions = (startYear: number) => {
  const currentYear = new Date().getFullYear();

  const years: { label: string; value: string }[] = [];

  for (let i = currentYear; i >= startYear; i--) {
    years.push({
      label: i.toString(),
      value: i.toString(),
    });
  }
  return years;
};
