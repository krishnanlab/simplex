import { LoggedIn } from "@/state";

export const audiences = [
  "general",
  "biology",
  "chemistry",
  "physics",
  "computer science",
  "mathematics",
] as const;

export type Audience = typeof audiences[number];

export interface Article {
  id: string;
  author: LoggedIn;
  date: Date;
  title: string;
  source: string;
  originalText: string;
  simplifiedText: string;
  ignoreWords: Array<string>;
}
