export const isValidDate = (date) => {
  // Assumes s is "mm/dd/yyyy"
  if (!/^\d\d\/\d\d\/\d\d\d\d$/.test(date)) {
    return false;
  }
  const parts = date.split('/').map((p) => parseInt(p, 10));
  parts[0] -= 1;
  const d = new Date(parts[2], parts[0], parts[1]);
  return (
    d.getMonth() === parts[0] &&
    d.getDate() === parts[1] &&
    d.getFullYear() === parts[2]
  );
};
