const api = import.meta.env.VITE_API;

/** high level request method */
export const request = async <T>(
  url = "",
  options: RequestInit = {}
): Promise<T> => {
  const headers = new Headers();
  headers.append("Content-Type", "application/json");

  const response = await fetch(api + url, { ...options, headers });
  if (!response.ok) throw Error("Response not OK");
  const parsed = await response.json();

  return parsed;
};
