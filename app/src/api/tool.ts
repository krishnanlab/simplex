import { request } from "./";
import { Audience } from "@/global/types";

export interface Analysis {
  scores: Record<string, number>;
  complexity: number;
  grade: number;
}

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

export const simplify = (word: string) =>
  request<Simplify>(`/simplify/${word}`);
