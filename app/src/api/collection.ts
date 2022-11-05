import { request } from "./";
import { ReadCollection } from "@/global/types";

export const getCollection = (id: string) =>
  request<ReadCollection>(`/collection/${id}`);

export const getCollections = () =>
  request<Array<ReadCollection>>("/collections");

export const saveCollection = (id?: string) =>
  request("/collection" + (id ? "/" + id : ""), {
    method: id ? "PUT" : "POST",
  });

export const deleteCollection = (id: string) =>
  request(`/collection/${id}`, { method: "DELETE" });
