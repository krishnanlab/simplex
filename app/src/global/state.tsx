import { createContext, ReactNode, useEffect } from "react";
import { useEvent, useLocalStorage } from "react-use";
import { checkLogin } from "@/api/account";
import { notification } from "@/components/Notification";
import { Author } from "@/global/types";

export type StateType = {
  /** logged-in user/author  */
  loggedIn: Author | null;
  /** set logged-in user/author */
  logIn: (author: Author) => void;
  /** clear logged-in user/author */
  logOut: () => void;
};

/** global app-wide state */
export const State = createContext<StateType>({
  loggedIn: null,
  logIn: () => null,
  logOut: () => null,
});

type Props = {
  children: ReactNode;
};

/** provider for global state */
const StateProvider = ({ children }: Props) => {
  const [loggedIn = null, setLoggedIn] = useLocalStorage<StateType["loggedIn"]>(
    "logged-in",
    null
  );
  const logIn = (author: Author) => setLoggedIn(author);
  const logOut = () => setLoggedIn(null);

  /** check if auth expired on app load */
  useEffect(() => {
    (async () => {
      if (!(await checkLogin())) logOut();
    })();
  });

  /** on auth expired event, logout */
  useEvent("auth-expired", () => {
    logOut();
    notification("error", "User login expired");
  });

  return (
    <State.Provider value={{ loggedIn, logIn, logOut }}>
      {children}
    </State.Provider>
  );
};

export default StateProvider;
