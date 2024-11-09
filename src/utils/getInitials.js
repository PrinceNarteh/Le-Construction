export const getInitial = (name) => {
  if (!name) return "";
  const nameArr = name.split(" ");
  if (nameArr.length === 1) return nameArr[0].substring(0, 2);
  return `${nameArr[0][0].toUpperCase()}${nameArr[1][0].toUpperCase()}`;
};
