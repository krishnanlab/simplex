/** types of versions to track for saved article */
export const versions = ["original", "simplified"] as const;

/** version to track for saved article */
export type Version = typeof versions[number];

/** types of audiences to analyze for */
export const audiences = [
  "general",
  "biology",
  "chemistry",
  "physics",
  "computer science",
  "mathematics",
] as const;

/** audience to analyze for */
export type Audience = typeof audiences[number];

/** id for author/article/collection */
export type Id = string;

/** iso date string */
export type DateString = string;

/** author (when reading details) */
export interface ReadAuthor {
  id: Id;
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
}

/** author (when reading details, as a third party) */
export type PublicReadAuthor = Pick<ReadAuthor, "id" | "name" | "institution">;

/** author (when writing details) */
export type WriteAuthor = Omit<ReadAuthor, "id">;

/** article (when reading details) */
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

/** article (when writing details) */
export type WriteArticle = Pick<
  ReadArticle,
  "title" | "source" | "ignoreWords" | "originalText" | "simplifiedText"
>;

/** collection (when reading details) */
export interface ReadCollection {
  id: Id;
  author: PublicReadAuthor["id"];
  date: DateString;
  title: string;
  description: string;
  articles: Array<ReadArticle["id"]>;
}

/** collection (when writing details) */
export type WriteCollection = Pick<
  ReadCollection,
  "title" | "description" | "articles"
>;
