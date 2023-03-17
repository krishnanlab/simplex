import { sortBy } from "lodash";
import { request } from "./";
import { Article, ArticleSummary, ArticleWrite, Id } from "@/global/types";
import { getStorage, setStorage } from "@/util/storage";

/** lookup latest revision of article */
export const getLatestArticle = (id: Id) => request<Article>(`/articles/${id}`);

/** get revisions of article */
export const getRevisions = async (id: Id) =>
  sortBy(
    await request<Array<Pick<Article, "revision" | "date">>>(
      `/articles/${id}/revisions`
    ),
    "date"
  );

/** lookup article by id and revision */
export const getArticle = (id: Id, revision: Id) =>
  request<Article>(`/articles/${id}/revisions/${revision}`);

/** batch lookup articles by id */
export const getArticles = (ids: Array<Id>) =>
  request<Array<ArticleSummary>>("/articles/batch", {
    method: "POST",
    body: JSON.stringify({ ids }),
  });

/** get user's articles*/
export const getUserArticles = () =>
  request<Array<ArticleSummary>>("/articles");

/** local storage key for saving anonymous articles */
export const anonArticleKey = "anonymous-articles";
/** schema of saved anon articles */
export type AnonArticles = Array<Article>;

/** save new article */
export const saveNewArticle = async (article: ArticleWrite) => {
  const response = await request<Article>("/articles", {
    method: "POST",
    body: JSON.stringify(article),
  });

  /** save anonymously created articles locally so they aren't lost */
  if (response.author === null) {
    const anon = (getStorage(anonArticleKey) || []) as Array<Article>;
    anon.push(response);
    setStorage("anonymous-articles", anon);
  }

  return response;
};

/** update existing article */
export const saveArticle = (article: ArticleWrite, id: Id) =>
  request<undefined>(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(article),
  });

/** delete article */
export const deleteArticle = (id: Id) =>
  request<undefined>(`/articles/${id}`, { method: "DELETE" });
