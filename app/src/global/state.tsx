import { createContext, Dispatch, ReactNode, SetStateAction } from "react";
import { useLocalStorage } from "react-use";
import { Author } from "@/global/types";

export type StateType = {
  /** logged-in user/author  */
  loggedIn: Author | undefined | null;
  /** set logged-in user/author */
  setLoggedIn: Dispatch<SetStateAction<Author | undefined | null>>;
};

/** global app-wide state */
export const State = createContext<StateType>({
  loggedIn: null,
  setLoggedIn: () => null,
});

type Props = {
  children: ReactNode;
};

/** provider for global state */
const StateProvider = ({ children }: Props) => {
  const [loggedIn, setLoggedIn] = useLocalStorage<StateType["loggedIn"]>(
    "logged-in",
    null
  );

  return (
    <State.Provider value={{ loggedIn, setLoggedIn }}>
      {children}
    </State.Provider>
  );
};

export default StateProvider;
