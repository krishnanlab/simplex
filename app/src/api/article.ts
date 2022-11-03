import { request } from ".";
import { ReadArticle } from "@/types";

export const getArticle = async (id: string): Promise<ReadArticle> =>
  request(`/article/${id}`);

export const getArticles = (ids?: Array<string>) =>
  request<Array<ReadArticle>>(
    "/articles" + (ids?.length ? "?ids=" + ids.join(",") : "")
  );
