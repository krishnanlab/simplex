// capitalize string
export const capitalize = (string: string) =>
  string.substring(0, 1).toUpperCase() + string.substring(1);

// is word
export const isWord = (value: string) => !value.match(/\s+|,|\.|!|\?|\(|\)/);

// split string into words
export const splitWords = (value: string) =>
  value.split(/(\s+|,|\.|!|\?|\(|\))/).filter((part) => part);

// split comma-separated list
export const splitComma = (value: string) =>
  value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part);
