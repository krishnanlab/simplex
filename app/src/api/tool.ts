import { request } from ".";
import { Audience } from "@/global/types";

export const analyze = (
  words: Array<string>,
  audience: Audience,
  ignoreWords: Array<string>
) =>
  request<Analysis>("/analyze", {
    method: "POST",
    body: JSON.stringify({ words, audience, ignoreWords }),
  });

export interface Analysis {
  scores: Record<string, number>;
  complexity: number;
  gradeLevel: number;
}
