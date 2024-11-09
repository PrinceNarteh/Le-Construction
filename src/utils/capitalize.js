export function capitalize(value, splitter = "_") {
  if (!value) return;
  return value
    .split(splitter)
    .map((word) => word[0].toUpperCase() + word.substring(1))
    .join(" ");
}
