import { atom } from "jotai";

interface LoggedIn {
  displayName: string;
  email: string;
  institution: string;
}

export const dummyLogin = {
  displayName: "Jane Smith",
  email: "jane.smith@email.com",
  institution: "University of Colorado",
};

export const loggedInState = atom<LoggedIn | null>(dummyLogin);
