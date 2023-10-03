export const stringToId = (string) => {
  let output = string.replaceAll(" ", "_");
  output = output.toLowerCase();
  output = output.replaceAll("é", "e");
  output = output.replaceAll("è", "e");
  output = output.replaceAll("ê", "e");
  output = output.replaceAll("à", "a");
  output = output.replaceAll("ù", "u");
  output = output.replaceAll("µ", "u");
  output = output.replaceAll("ç", "c");
  return output;
};

export const generateId = (inputString, existingObjects) => {

  let uniqueId = inputString;

  let count = 1;
  while (existingObjects.some(obj => obj.id === uniqueId)) {
    uniqueId = `${inputString}_${count}`;
    count++;
  }

  return uniqueId;

}