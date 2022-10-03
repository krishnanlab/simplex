import { atom } from "jotai";

interface LoggedIn {
  displayName: string;
  email: string;
  institution: string;
}

export const loggedInState = atom<LoggedIn | null>(null);
