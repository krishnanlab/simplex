import { request } from ".";
import { ReadCollection } from "@/global/types";

export const getCollection = (id: string) =>
  request<ReadCollection>(`/collection/${id}`);

export const getCollections = (ids?: Array<string>) =>
  request<Array<ReadCollection>>(
    "/collections" + (ids?.length ? "?ids=" + ids.join(",") : "")
  );

export const deleteCollection = (id: string) =>
  request(`/collection/${id}`, { method: "DELETE" });

export const saveCollection = (id?: string) =>
  request("/collection" + (id ? "/" + id : ""), {
    method: id ? "PUT" : "POST",
  });
