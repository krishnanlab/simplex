import { atom } from "jotai";

interface LoggedIn {
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
}

export const exampleLogin = {
  name: "Jane Smith",
  email: "jane.smith@email.com",
  institution: "University of Colorado",
  password: "************",
  newsletter: true,
};

export const loggedInState = atom<LoggedIn | null>(exampleLogin);
