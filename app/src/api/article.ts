import { request } from "./";
import {
  Article,
  ArticleSummary,
  ArticleWrite,
  Id,
  Revision,
} from "@/global/types";
import { setStorage } from "@/util/storage";

/** lookup latest revision of article */
export const getLatestArticle = (id: Id) => request<Article>(`/articles/${id}`);

/** get revisions of article */
export const getRevisions = (id: Id) =>
  request<Array<Pick<Article, "revision" | "date">>>(
    `/articles/${id}/revisions`
  );

/** lookup article by id and revision */
export const getArticle = (id: Id, revision: Revision) =>
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

/** save new article */
export const saveNewArticle = async (article: ArticleWrite) => {
  const response = await request<Article>("/articles", {
    method: "POST",
    body: JSON.stringify(article),
  });

  /** save anonymously created articles locally so they aren't lost */
  if (response.author === null)
    setStorage("anonymous-articles", (value) => value + "," + response.id);

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
