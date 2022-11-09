/** capitalize string */
export const capitalize = (string: string) =>
  string.substring(0, 1).toUpperCase() + string.substring(1);

/** is word */
export const isWord = (value: string) => value.match(/[\p{L}|\p{N}|-]+/u);

/** split string into words */
export const splitWords = (value: string) =>
  value.split(/([\p{L}|\p{N}|-]+)/u).filter((part) => part);

/** split comma-separated list */
export const splitComma = (value: string) =>
  value
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part);

/** shorten url text */
export const shortenURl = (value: string) => {
  try {
    const url = new URL(value);
    return url.hostname + url.pathname;
  } catch (error) {
    return value;
  }
};
