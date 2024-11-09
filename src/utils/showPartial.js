const showPartial = (value) => {
  if (!value) return "";
  return `${value.substring(0, 20)}••••••••••••••••••••••`;
};

export default showPartial;
