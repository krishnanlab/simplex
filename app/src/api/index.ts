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

  /** make request with options */
  const response = await fetch(api + url, { ...options, headers });

  /** try to parse as json */
  const parsed = await response.json();

  /** on auth expired error, dispatch event */
  if (response.status === 401) window.dispatchEvent(new Event("auth-expired"));

  /** on any request error, throw error with detailed error message */
  if (!response.ok)
    throw Error(parsed.errors || parsed.detail || "Response not OK");

  return parsed;
};
