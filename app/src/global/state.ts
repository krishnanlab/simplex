import { createContext, Dispatch, SetStateAction } from "react";
import { LoggedIn } from "@/global/types";

interface StateType {
  loggedIn: LoggedIn;
  setLoggedIn: Dispatch<SetStateAction<LoggedIn>>;
}

export const State = createContext<StateType>({
  loggedIn: null,
  setLoggedIn: () => null,
});
