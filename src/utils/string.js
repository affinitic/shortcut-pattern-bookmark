export const stringToId = (string) => {
  let output = string.replaceAll(" ","_");
  output = output.toLowerCase();
  output = output.replaceAll("é","e");
  output = output.replaceAll("è","e");
  output = output.replaceAll("ê","e");
  output = output.replaceAll("à","a");
  output = output.replaceAll("ù","u");
  output = output.replaceAll("µ","u");
  output = output.replaceAll("ç","c");
  return output;
}