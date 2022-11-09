import { createContext, Dispatch, SetStateAction } from "react";
import { LoggedIn, ReadAuthor } from "@/global/types";

export interface StateType {
  /** logged-in user/author  */
  loggedIn: ReadAuthor | undefined | null;
  /** set logged-in user/author */
  setLoggedIn: Dispatch<SetStateAction<LoggedIn>>;
}

/** global app-wide state */
export const State = createContext<StateType>({
  loggedIn: null,
  setLoggedIn: () => null,
});
