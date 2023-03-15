// import { sleep } from "@/util/debug";
import { prettyError } from "@/util/string";

const api = import.meta.env.VITE_API;

/** high level request method */
export const request = async <T>(
  url = "",
  options: RequestInit = {}
): Promise<T> => {
  /** debug */
  // await sleep(1000);
  // throw new Error("Test error");

  /** set request headers */
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  /** set extra request options */
  options.credentials = "include";

  /** construct request with options */
  const request = new Request(api + url, { ...options, headers });

  console.groupCollapsed("📞 Request", url);
  console.info(request);
  console.info(options.body);
  console.groupEnd();

  /** perform request */
  const response = await fetch(request);

  /** on auth expired error, dispatch event */
  if (response.status === 401 && !url.includes("current-user"))
    window.dispatchEvent(new Event("auth-expired"));

  /** try to parse response as json */
  let parsed: any = {}; // eslint-disable-line
  try {
    parsed = await response.json();
    console.groupCollapsed("📣 Response", url);
    console.info(parsed);
    console.groupEnd();
  } catch (error) {
    console.groupCollapsed("Response", url);
    console.error("Couldn't parse as JSON");
    console.error(response);
    console.groupEnd();
  }

  /** on any request error, throw error with detailed error message */
  if (!response.ok) {
    console.error(parsed);
    throw parsed.errors ? prettyError(parsed.errors) : "";
  }

  return parsed;
};
