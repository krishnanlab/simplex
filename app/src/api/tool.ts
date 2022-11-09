import { request } from "./";
import { Audience } from "@/global/types";

export interface Analysis {
  scores: Record<string, number>;
  complexity: number;
  grade: number;
}

/** main analysis of complexity */
export const analyze = (
  words: Array<string>,
  audience: Audience,
  ignoreWords: Array<string>
) =>
  request<Analysis>("/analyze", {
    method: "POST",
    body: JSON.stringify({ words, audience, ignoreWords }),
  });

export interface Simplify {
  definition: string;
  image: string;
  synonyms: Array<string>;
  link: string;
}

/** get synonyms, definition, etc. */
export const simplify = (word: string) =>
  request<Simplify>(`/simplify/${word}`);
