import { request } from "./";
import { Id, ReadCollection } from "@/global/types";

/** lookup collection details by id */
export const getCollection = (id: string) =>
  request<ReadCollection>(`/collections/${id}`);

/** get user's collections */
export const getCollections = () =>
  request<Array<ReadCollection>>("/collections");

export const saveCollection = (id?: string) =>
  request<{ id: Id }>("/collections" + (id ? "/" + id : ""), {
    method: id ? "PUT" : "POST",
  });

export const deleteCollection = (id: string) =>
  request(`/collections/${id}`, { method: "DELETE" });
