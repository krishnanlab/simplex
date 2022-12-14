import { AuthorPublic } from "@/global/types";

/** is word */
export const isWord = (value: string) => value.match(/[\p{L}|\p{N}|-]+/u);

/** split string into words */
export const splitWords = (value: string) =>
  value.split(/([\p{L}|\p{N}|-]+)/u).filter(Boolean);

/** split comma-separated list */
export const splitComma = (value: string) =>
  value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

/** shorten url text */
export const shortenUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.hostname + url.pathname;
  } catch (error) {
    return value;
  }
};

/** array of strings to classname list */
export const classNames = (array: Array<string | undefined | null>) =>
  array.filter(Boolean).join(" ");

/** format date to string */
export const dateString = (date: string | Date) =>
  parseDate(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

/** parse date string with fallback */
export const parseDate = (date: string | Date) => {
  try {
    const parsed = new Date(date);
    if (isNaN(parsed.getTime())) throw Error("");
    return new Date(date);
  } catch (error) {
    return new Date();
  }
};

/** make "by" string from author object */
export const authorString = (author: AuthorPublic, you: boolean) =>
  [author.name, you ? "(You)" : "", author.institution]
    .filter(Boolean)
    .join(" | ");
