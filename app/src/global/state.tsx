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
  /** flag to ensure current user event only dispatched once */
  const [dispatch, setDispatch] = useState(false);

  const [currentUser, setCurrentUser] = useState<
    StateType["currentUser"] | null
  >(null);
  const clearCurrentUser = () => setCurrentUser(null);

  /** check if user logged in on app load */
  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .then(() => setDispatch(true));
  }, []);

  /** dispatch global event that current user has been checked */
  useEffect(() => {
    if (dispatch) {
      window.dispatchEvent(new Event("current-user"));
      setDispatch(false);
    }
  }, [dispatch]);

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
