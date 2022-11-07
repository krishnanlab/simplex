import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/account";
import Notification from "@/components/Notification";
import { State } from "@/global/state";

const LogOut = () => {
  const { setLoggedIn } = useContext(State);
  const navigate = useNavigate();

  const {
    mutate: logoutMutate,
    isLoading: logoutLoading,
    isError: logoutError,
  } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      setLoggedIn(null);
      navigate("/");
    },
  });

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
