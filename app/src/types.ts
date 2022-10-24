export const audiences = [
  "general",
  "biology",
  "chemistry",
  "physics",
  "computer science",
  "mathematics",
] as const;

export type Audience = typeof audiences[number];

export interface ReadAuthor {
  id: number;
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
}

export interface WriteAuthor {
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
}

export interface ReadArticle {
  id: number;
  author: ReadAuthor;
  date: Date;
  title: string;
  source: string;
  originalText: string;
  simplifiedText: string;
  ignoreWords: string[];
}

export interface WriteArticle {
  title: string;
  source: string;
  text: string;
  ignoreWords: string[];
}

export interface ReadCollection {
  id: number;
  date: Date;
  title: string;
  description: string;
  articles: number[];
}

export interface WriteCollection {
  title: string;
  description: string;
  articles: number[];
}
