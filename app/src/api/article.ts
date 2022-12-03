import { request } from "./";
import { Id, ReadArticle, WriteArticle } from "@/global/types";

/** lookup article details by id */
export const getArticle = (id: string) =>
  request<ReadArticle>(`/articles/${id}`);

/** get user's articles, or batch lookup by id */
export const getArticles = (ids?: Array<string>) =>
  request<Array<ReadArticle>>("/articles", {
    method: ids ? "POST" : "GET",
    body: ids ? JSON.stringify({ ids }) : undefined,
  });

export const saveArticle = (id?: string) =>
  request<{ id: Id }>("/articles" + (id ? "/" + id : ""), {
    method: id ? "PUT" : "POST",
  });

export const deleteArticle = (id: string) =>
  request(`/articles/${id}`, { method: "DELETE" });

export interface ShareOptions {
  audience: string;
  highlights: boolean;
}

/** share article when not logged in */
export const shareArticle = (article: WriteArticle, options: ShareOptions) =>
  request<{ link: string }>("/share", {
    method: "POST",
    body: JSON.stringify({ article, options }),
  });
