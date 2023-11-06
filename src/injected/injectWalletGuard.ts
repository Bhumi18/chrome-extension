// this function standardizes all values sent to the API into strings to prevent type errors
export function convertObjectValuesToString(inputObj: any): any {
  const keys = Object.keys(inputObj);
  const output: any = {};
  for (let x of keys) {
    if (Array.isArray(inputObj[x])) {
      const array: any[] = [];

      for (let y in inputObj[x]) {
        array.push(convertObjectValuesToString(inputObj[x][y]));
      }

      output[x] = array;
    } else if (inputObj[x] === null) {
      output[x] = null;
    } else if (typeof inputObj[x] === "object") {
      output[x] = convertObjectValuesToString(inputObj[x]);
    } else if (
      typeof inputObj[x] === "number" ||
      typeof inputObj[x] === "bigint"
    ) {
      output[x] = String(inputObj[x]);
    } else {
      output[x] = inputObj[x];
    }
  }

  return output;
}
