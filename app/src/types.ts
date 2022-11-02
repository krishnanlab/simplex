export const audiences = [
  "general",
  "biology",
  "chemistry",
  "physics",
  "computer science",
  "mathematics",
] as const;

export type Audience = typeof audiences[number];

export type LoggedIn = ReadAuthor | undefined | null;

export interface ReadAuthor {
  id: string;
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
}

export type PublicReadAuthor = Pick<ReadAuthor, "id" | "name" | "institution">;

export type WriteAuthor = Omit<ReadAuthor, "id">;

export interface ReadArticle {
  id: string;
  author: PublicReadAuthor;
  date: Date;
  title: string;
  source: string;
  originalText: string;
  simplifiedText: string;
  ignoreWords: Array<string>;
  collections: Array<ReadCollection["id"]>;
}

export type WriteAritcle = Pick<
  ReadArticle,
  "title" | "source" | "ignoreWords"
> & {
  text: string;
};

export interface ReadCollection {
  id: string;
  date: Date;
  title: string;
  description: string;
  articles: Array<ReadArticle["id"]>;
}

export type WriteCollection = Pick<
  ReadCollection,
  "title" | "description" | "articles"
>;
