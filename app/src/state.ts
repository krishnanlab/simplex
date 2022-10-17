import { atomWithStorage } from "jotai/utils";

export interface LoggedIn {
  id: number;
  name: string;
  email: string;
  institution: string;
  newsletter: boolean;
}

export const exampleLogin = {
  id: 123,
  name: "Jane Smith",
  email: "jane.smith@email.com",
  institution: "University of Colorado",
  password: "************",
  newsletter: true,
};

export const loggedInState = atomWithStorage<LoggedIn | null>(
  "loggedIn",
  exampleLogin
);
