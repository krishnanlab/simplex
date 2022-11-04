import { sleep } from "@/util/debug";

const api = "https://api.simplex.io";

export const request = async <T>(
  url = "",
  options: RequestInit = {}
): Promise<T> => {
  await sleep(500);

  const response = await fetch(api + url, options);
  if (!response.ok) throw new Error("Response not OK");
  const parsed = await response.json();

  return parsed;
};
