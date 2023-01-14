import { request } from "./";
import { Author, AuthorPublic, AuthorWrite, Id } from "@/global/types";

/** get current logged in user */
export const getCurrentUser = async () => {
  try {
    return await request<Author>("/current-user");
  } catch (error) {
    console.error(error);
    return null;
  }
};

type Signup = AuthorWrite & {
  password: string;
  remember: boolean;
};

/** sign up for account */
export const signup = (params: Signup) =>
  request<Author>("/signup", {
    method: "POST",
    body: JSON.stringify(params),
  });

type Login = {
  email: string;
  password: string;
  remember: boolean;
};

/** log in to existing account */
export const login = (params: Login) =>
  request<Author>("/login", {
    method: "POST",
    body: JSON.stringify(params),
  });

/** log out of account */
export const logout = () => request<undefined>("/logout", { method: "POST" });

/** lookup public info of third-party author */
export const getAuthor = (id: Id) => request<AuthorPublic>(`/authors/${id}`);

/** save user's account info */
export const saveInfo = (props: AuthorWrite) =>
  request<Author>("/save-info", {
    method: "PUT",
    body: JSON.stringify(props),
  });

type ChangePassword = {
  current: string;
  fresh: string;
};

/** change password of logged in user */
export const changePassword = (props: ChangePassword) =>
  request<undefined>("/change-password", {
    method: "PUT",
    body: JSON.stringify(props),
  });

/** request password reset */
export const forgotPassword = (props: Pick<Author, "email">) =>
  request<undefined>("/forgot-password", {
    method: "POST",
    body: JSON.stringify(props),
  });

type ResetPassword = {
  code: string;
  email: string;
  password: string;
};

/** submit password reset */
export const resetPassword = (props: ResetPassword) =>
  request<undefined>("/forgot-password", {
    method: "POST",
    body: JSON.stringify(props),
  });
