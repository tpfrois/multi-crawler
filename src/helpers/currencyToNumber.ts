export function realToNumber(n: string): number {
  n = n.replace("R$ ", "");
  if (n === "") {
    n = "0";
  } else {
    n = n.split(".").join("");
    n = n.replace(",", ".");
  }
  return parseFloat(n);
}
