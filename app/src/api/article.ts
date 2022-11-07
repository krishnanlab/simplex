import { request } from "./";
import { Id, ReadArticle, WriteArticle } from "@/global/types";

export const getArticle = (id: string) =>
  request<ReadArticle>(`/article/${id}`);

export const getArticles = (ids?: Array<string>) =>
  request<Array<ReadArticle>>("/articles", {
    method: ids ? "POST" : "GET",
    body: ids ? JSON.stringify({ ids }) : undefined,
  });

export const saveArticle = (id?: string) =>
  request<{ id: Id }>("/article" + (id ? "/" + id : ""), {
    method: id ? "PUT" : "POST",
  });

export const deleteArticle = (id: string) =>
  request(`/article/${id}`, { method: "DELETE" });

export interface ShareOptions {
  audience: string;
  highlights: boolean;
}

export const shareArticle = (article: WriteArticle, options: ShareOptions) =>
  request<{ link: string }>("/share", {
    method: "POST",
    body: JSON.stringify({ article, options }),
  });
