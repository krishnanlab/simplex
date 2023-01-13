import { createContext, ReactNode, useEffect, useState } from "react";
import { useEvent } from "react-use";
import { getCurrentUser } from "@/api/account";
import { notification } from "@/components/Notification";
import { Author } from "@/global/types";

export type StateType = {
  /** current (logged-in) user/author  */
  currentUser: Author | null;
  setCurrentUser: (author: Author) => void;
  clearCurrentUser: () => void;
};

/** global app-wide state */
export const State = createContext<StateType>({
  currentUser: null,
  setCurrentUser: () => null,
  clearCurrentUser: () => null,
});

type Props = {
  children: ReactNode;
};

/** provider for global state */
const StateProvider = ({ children }: Props) => {
  const [currentUser = null, setLoggedIn] =
    useState<StateType["currentUser"]>(null);
  const setCurrentUser = (author: Author) => setLoggedIn(author);
  const clearCurrentUser = () => setLoggedIn(null);

  /** check if user logged in on app load */
  useEffect(() => {
    (async () => {
      const user = await getCurrentUser();
      if (user) setLoggedIn(user);
    })();
  }, []);

  /** on auth expired event, logout */
  useEvent("auth-expired", () => {
    clearCurrentUser();
    notification("error", "User login expired");
  });

  return (
    <State.Provider value={{ currentUser, setCurrentUser, clearCurrentUser }}>
      {children}
    </State.Provider>
  );
};

export default StateProvider;
