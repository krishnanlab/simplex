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

// dummy func
const scoreStore: Record<string, number> = {};
const getWordScore = (word: string) =>
  scoreStore[word] || (scoreStore[word] = Math.random() * 100);

export const analyze = async (
  text = "",
  audience: Audience = "general",
  ignoreList = ""
) => {
  const ignore = ignoreList
    .split(",")
    .map((word) => word.trim())
    .filter((word) => word);

  const highlights = text
    .split(/(\S+)/)
    .filter((text) => text)
    .map((text) => ({
      text,
      score: ignore.includes(text)
        ? 0
        : getWordScore(text) / (audiences.indexOf(audience) + 1),
    }));

  const complexity = Math.random() * 100;
  const gradeLevel = "collegiate";

  await sleep(300);

  return { highlights, complexity, gradeLevel };
};
