import { isWord } from "./../util/string";
import { Audience, audiences } from "@/types";
import { sleep } from "@/util/debug";

// dummy api
const scoreStore: Record<string, number> = {};
const getWordScore = (word: string) =>
  scoreStore[word] || (scoreStore[word] = Math.random() * 100);

export const analyze = async (
  words: Array<string>,
  audience: Audience,
  ignoreWords: Array<string>
): Promise<Analysis> => {
  const scores: Record<string, number> = {};
  for (const word of words)
    if (isWord(word))
      scores[word] = ignoreWords.includes(word)
        ? 0
        : getWordScore(word) / (audiences.indexOf(audience) + 1);

  const calc =
    Object.values(scores).reduce((sum, val) => sum + val, 0) /
      Object.values(scores).length || 0;

  const complexity = calc;
  const gradeLevel = calc;

  await sleep(100);

  return { scores, complexity, gradeLevel };
};

export interface Analysis {
  scores: Record<string, number>;
  complexity: number;
  gradeLevel: number;
}
