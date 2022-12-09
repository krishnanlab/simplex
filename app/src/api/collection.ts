import { request } from "./";
import {
  Collection,
  CollectionSummary,
  CollectionWrite,
  Id,
} from "@/global/types";

/** lookup collection details by id */
export const getCollection = (id: Id) =>
  request<Collection>(`/collections/${id}`);

/** get user's collections */
export const getUserCollections = () =>
  request<Array<CollectionSummary>>("/collections");

/** save new collection */
export const saveNewCollection = (collection: CollectionWrite) =>
  request<{ id: Id }>("/collections", {
    method: "POST",
    body: JSON.stringify(collection),
  });

/** update existing collection */
export const saveCollection = (collection: CollectionWrite, id: Id) =>
  request<undefined>(`/collections/${id}`, {
    method: "PUT",
    body: JSON.stringify(collection),
  });

/** delete collection */
export const deleteCollection = (id: Id) =>
  request<undefined>(`/collections/${id}`, { method: "DELETE" });
