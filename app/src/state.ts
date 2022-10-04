import { atom } from "jotai";

interface LoggedIn {
  name: string;
  email: string;
  institution: string;
}

export const exampleLogin = {
  name: "Jane Smith",
  email: "jane.smith@email.com",
  institution: "University of Colorado",
  password: "************",
};

export const loggedInState = atom<LoggedIn | null>(exampleLogin);
