import { request } from ".";
import { ReadCollection } from "@/types";

export const getCollection = async (id: string): Promise<ReadCollection> =>
  request(`/collection/${id}`);

export const getCollections = (ids?: Array<string>) =>
  request<Array<ReadCollection>>(
    "/collections" + (ids?.length ? "?ids=" + ids.join(",") : "")
  );
