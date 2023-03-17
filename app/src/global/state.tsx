import { createContext, ReactNode, useEffect, useState } from "react";
import { useEvent } from "react-use";
import { getCurrentUser } from "@/api/account";
import { notification } from "@/components/Notification";
import { Author } from "@/global/types";

export type StateType = {
  /** current (logged-in) user/author. null = not logged in, undefined = not checked yet.  */
  currentUser: Author | null | undefined;
  refreshCurrentUser: () => void;
  clearCurrentUser: () => void;
};

/** global app-wide state */
export const State = createContext<StateType>({
  currentUser: null,
  refreshCurrentUser: () => null,
  clearCurrentUser: () => null,
});

type Props = {
  children: ReactNode;
};

/** provider for global state */
const StateProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] =
    useState<StateType["currentUser"]>(undefined);

  const refreshCurrentUser = () => getCurrentUser().then(setCurrentUser);
  const clearCurrentUser = () => setCurrentUser(null);

  /** check if user logged in on app load */
  useEffect(() => {
    refreshCurrentUser();
  }, []);

  /** on auth expired event, logout */
  useEvent("auth-expired", () => {
    clearCurrentUser();
    notification("error", "User login expired");
  });

  return (
    <State.Provider
      value={{ currentUser, refreshCurrentUser, clearCurrentUser }}
    >
      {children}
    </State.Provider>
  );
};

export default StateProvider;
