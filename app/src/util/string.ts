import { capitalize } from "lodash";
import { AuthorPublic } from "@/global/types";

/** MAKE SURE THIS MATCHES BACKEND EXACTLY FOR CONSISTENCY */
/** characters that are considered part of a word */
const token = /\p{L}|\p{N}|-/;

/** split string into words in particular way for analysis */
export const tokenize = (value: string) =>
  value.split(new RegExp("([" + token.source + "]+)", "u")).filter(Boolean);

/** is word */
export const isWord = (value: string) =>
  value.match(new RegExp("[" + token.source + "+", "u"));

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
  [
    [author.name, you ? "(You)" : ""].filter(Boolean).join(" "),
    author.institution,
  ]
    .filter(Boolean)
    .join(" | ");

/** get user-friendly error message from DRF errors object */
export const prettyError = (errors: unknown) =>
  [errors]
    .flat()
    .map((error: unknown) => {
      if (typeof error === "object" && error !== null)
        // @ts-expect-error TS not smart enough to realize error props will be safely filtered out
        return [error.attr, error.detail]
          .map(capitalize)
          .filter(Boolean)
          .join(": ");
      else return error;
    })
    .join("\n");
