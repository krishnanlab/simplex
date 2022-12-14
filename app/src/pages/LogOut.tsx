import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/account";
import Notification from "@/components/Notification";
import { State } from "@/global/state";

/** logout page */
const LogOut = () => {
  const { logOut } = useContext(State);
  const navigate = useNavigate();

  /** mutation to logout */
  const {
    mutate: logoutMutate,
    isLoading: logoutLoading,
    isError: logoutError,
  } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      logOut();
      await navigate("/");
    },
  });

  /** try to logout immediately */
  useEffect(() => {
    logoutMutate();
  }, [logoutMutate]);

  return (
    <>
      {logoutLoading && <Notification type="loading" text="Logging out" />}
      {logoutError && <Notification type="error" text="Error logging out" />}
    </>
  );
};

export default LogOut;
