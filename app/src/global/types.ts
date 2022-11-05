export const audiences = [
  "general",
  "biology",
  "chemistry",
  "physics",
  "computer science",
  "mathematics",
] as const;

export type Audience = typeof audiences[number];

type Id = string;

type DateString = string;

export type LoggedIn = ReadAuthor | undefined | null;

export interface ReadAuthor {
  id: Id;
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
}

export type PublicReadAuthor = Pick<ReadAuthor, "id" | "name" | "institution">;

export type WriteAuthor = Omit<ReadAuthor, "id">;

export interface ReadArticle {
  id: Id;
  author: PublicReadAuthor["id"];
  date: DateString;
  title: string;
  source: string;
  originalText: string;
  simplifiedText: string;
  ignoreWords: Array<string>;
  collections: Array<ReadCollection["id"]>;
}

export type WriteArticle = Pick<
  ReadArticle,
  "title" | "source" | "ignoreWords"
> & {
  text: string;
};

export interface ReadCollection {
  id: Id;
  author: PublicReadAuthor["id"];
  date: DateString;
  title: string;
  description: string;
  articles: Array<ReadArticle["id"]>;
}

export type WriteCollection = Pick<
  ReadCollection,
  "title" | "description" | "articles"
>;
