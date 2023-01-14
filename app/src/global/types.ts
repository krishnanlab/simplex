/** types of audiences to analyze for */
export const audiences = [
  { label: "General", value: "general" },
  { label: "Biology", value: "biology" },
  { label: "Chemistry", value: "chemistry" },
  { label: "Physics", value: "physics" },
  { label: "Computer Science", value: "cs" },
  { label: "Mathematics", value: "math" },
] as const;

/** audience to analyze for */
export type Audience = (typeof audiences)[number];

/** result of complexity analysis */
export type Analysis = {
  scores: Record<string, number>;
  complexity: number;
  gradeLevel: number;
  gradeLevelText: string;
  sentences: number;
  syllables: number;
  words: number;
  chars: number;
};

/** initial/fallback analysis results */
export const blankAnalysis: Analysis = {
  scores: {},
  complexity: 0,
  gradeLevel: 0,
  gradeLevelText: "",
  sentences: 0,
  syllables: 0,
  words: 0,
  chars: 0,
};

/** result of simplification suggestion */
export type Simplify = {
  definition?: string;
  image?: string;
  synonyms?: Array<string>;
  link?: string;
};

/** id for author/article/collection */
export type Id = string;

/** iso date string */
export type DateString = string;

/** author (when reading details) */
export type Author = {
  id: Id;
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
};

/** author (when reading details, as a third party) */
export type AuthorPublic = Pick<Author, "id" | "name" | "institution">;

/** author (when writing details) */
export type AuthorWrite = Omit<Author, "id">;

/** initial/fallback article */
export const blankAuthor: AuthorPublic = {
  id: "",
  name: "",
  institution: "",
};

/** article (when reading details) */
export type Article = {
  id: Id;
  revision: Id;
  author: AuthorPublic["id"] | null;
  date: DateString;
  title: string;
  source: string;
  text: string;
  ignoreWords: Array<string>;
  collections: Array<Collection["id"]>;
};

/** article (when reading long lists) */
export type ArticleSummary = Pick<Article, "id" | "date" | "title"> & {
  textTruncated: string;
  collectionCount: string;
};

/** article (when writing details) */
export type ArticleWrite = Pick<
  Article,
  "title" | "source" | "ignoreWords" | "text"
>;

/** initial/fallback article */
export const blankArticle: Article = {
  id: "",
  revision: "",
  author: "",
  date: "",
  title: "",
  source: "",
  text: "",
  ignoreWords: [],
  collections: [],
};

/** collection (when reading details) */
export type Collection = {
  id: Id;
  author: AuthorPublic["id"];
  date: DateString;
  title: string;
  description: string;
  articles: Array<Article["id"]>;
};

/** collection (when reading long lists) */
export type CollectionSummary = Pick<
  Collection,
  "id" | "date" | "title" | "description"
> & { articleCount: number };

/** collection (when writing details) */
export type CollectionWrite = Pick<
  Collection,
  "title" | "description" | "articles"
>;

/** initial/fallback collection */
export const blankCollection: Collection = {
  id: "",
  author: "",
  date: "",
  title: "",
  description: "",
  articles: [],
};

/** generic json data */
export type JSON =
  | string
  | number
  | boolean
  | { [x: string]: JSON }
  | Array<JSON>;
