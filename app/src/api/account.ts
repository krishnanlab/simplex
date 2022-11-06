import { request } from "./";
import { PublicReadAuthor, ReadAuthor, WriteAuthor } from "@/global/types";

type Signup = WriteAuthor & {
  password: string;
};

export const signup = (params: Signup) =>
  request<ReadAuthor>("/signup", {
    method: "POST",
    body: JSON.stringify(params),
  });

interface Login {
  email: string;
  password: string;
}

export const login = (params: Login) =>
  request<ReadAuthor>("/login", {
    method: "POST",
    body: JSON.stringify(params),
  });

export const logout = () => request("/logout", { method: "POST" });

export const getAuthor = (id: string) =>
  request<PublicReadAuthor>(`/author/${id}`);

type SaveInfo = WriteAuthor;

export const saveInfo = (props: SaveInfo) =>
  request<ReadAuthor>("/save-info", {
    method: "POST",
    body: JSON.stringify(props),
  });

interface ChangePassword {
  current: string;
  fresh: string;
}

export const changePassword = (props: ChangePassword) =>
  request("/change-password", {
    method: "POST",
    body: JSON.stringify(props),
  });

export const forgotPassword = (props: Pick<ReadAuthor, "email">) =>
  request("/forgot-password", {
    method: "POST",
    body: JSON.stringify(props),
  });
