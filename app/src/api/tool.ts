import { request } from "./";
import { Analysis, Audience, Simplify } from "@/global/types";

/** main analysis of complexity */
export const analyze = (
  words: Array<string>,
  audience: Audience["value"],
  ignoreWords: Array<string>
) =>
  request<Analysis>("/analyze", {
    method: "POST",
    body: JSON.stringify({ words, audience, ignoreWords }),
  });

/** get synonyms, definition, etc. */
export const simplify = (word: string) =>
  request<Simplify>(`/simplify/${word}`);
