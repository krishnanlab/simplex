import { request } from "./";
import { Analysis, Audience, Simplify } from "@/global/types";

/** main analysis of complexity */
export const analyze = async (
  text: string,
  audience: Audience["value"],
  ignoreWords: Array<string>
) => {
  const result = await request<Analysis>("/analyze", {
    method: "POST",
    body: JSON.stringify({ text, audience, ignoreWords }),
  });
  console.info({ ...result, text });
  return result;
};

/** get synonyms, definition, etc. */
export const simplify = (word: string) =>
  request<Simplify>(`/simplify/${word}`);
