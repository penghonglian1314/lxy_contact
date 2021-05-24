export const formatDate = (val) => {
  if (!val) {
    return;
  }
  let date = new Date(val);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join("-");
};