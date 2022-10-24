import { ReadAuthor } from "@/types";

import { atomWithStorage } from "jotai/utils";

export const exampleLogin = {
  id: 123,
  name: "Jane Smith",
  email: "jane.smith@email.com",
  institution: "University of Colorado",
  password: "************",
  newsletter: true,
};

export const loggedInState = atomWithStorage<ReadAuthor | null>(
  "loggedIn",
  exampleLogin
);
