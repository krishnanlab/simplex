import { sleep } from "@/util/debug";

export const audiences = [
  "general",
  "biology",
  "chemistry",
  "physics",
  "computer science",
  "mathematics",
] as const;

export type Audience = typeof audiences[number];

// dummy api
const scoreStore: Record<string, number> = {};
const getWordScore = (word: string) =>
  scoreStore[word] || (scoreStore[word] = Math.random() * 100);

export const analyze = async (
  words: Array<string>,
  audience: Audience,
  ignoreWords: Array<string>
) => {
  const scores: Record<string, number> = {};
  for (const word of words)
    scores[word] = ignoreWords.includes(word)
      ? 0
      : getWordScore(word) / (audiences.indexOf(audience) + 1);

  const calc =
    Object.values(scores).reduce((sum, val) => sum + val, 0) /
      Object.values(scores).length || 0;

  const complexity = calc;
  const gradeLevel = calc;

  await sleep(1000);

  return { scores, complexity, gradeLevel };
};
