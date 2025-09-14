const toISODateTime = (dateStr, timeStr) => {
  const isoString = new Date(`${dateStr}T${timeStr}:00+05:30`).toISOString();
  return isoString;
};

const formatToIST = (isoString) => {
  return new Date(isoString).toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export { toISODateTime, formatToIST };
