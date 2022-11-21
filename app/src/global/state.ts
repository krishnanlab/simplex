import { createContext, Dispatch, SetStateAction } from "react";
import { ReadAuthor } from "@/global/types";

export interface StateType {
  /** logged-in user/author  */
  loggedIn: ReadAuthor | undefined | null;
  /** set logged-in user/author */
  setLoggedIn: Dispatch<SetStateAction<ReadAuthor | undefined | null>>;
}

/** global app-wide state */
export const State = createContext<StateType>({
  loggedIn: null,
  setLoggedIn: () => null,
});
