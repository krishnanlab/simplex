import { prettyError } from "@/util/string";

const api = import.meta.env.VITE_API;

/** high level request method */
export const request = async <T>(
  url = "",
  options: RequestInit = {}
): Promise<T> => {
  /** set request headers */
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  /** set extra options */
  options.credentials = "include";

  console.info();

  /** construct request with options */
  const request = new Request(api + url, { ...options, headers });

  console.groupCollapsed("Request", url);
  console.info(request);
  console.groupEnd();

  /** perform request */
  const response = await fetch(request);

  /** try to parse as json */
  const parsed = await response.json();

  console.groupCollapsed("Response", url);
  console.info(parsed);
  console.groupEnd();

  /** on auth expired error, dispatch event */
  if (response.status === 401 && !url.includes("current-user"))
    window.dispatchEvent(new Event("auth-expired"));

  /** on any request error, throw error with detailed error message */
  if (!response.ok) {
    console.error(parsed);
    throw parsed.errors ? prettyError(parsed.errors) : "";
  }

  return parsed;
};
