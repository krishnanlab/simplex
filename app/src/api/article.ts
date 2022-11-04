import { request } from ".";
import { ReadArticle } from "@/global/types";

export const getArticle = (id: string) =>
  request<ReadArticle>(`/article/${id}`);

export const getArticles = (ids?: Array<string>) =>
  request<Array<ReadArticle>>(
    "/articles" + (ids?.length ? "?ids=" + ids.join(",") : "")
  );

export const deleteArticle = (id: string) =>
  request(`/article/${id}`, { method: "DELETE" });

export const saveArticle = (id?: string) =>
  request("/article" + (id ? "/" + id : ""), {
    method: id ? "PUT" : "POST",
  });
