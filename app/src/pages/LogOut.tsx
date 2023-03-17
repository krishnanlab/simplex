import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/api/account";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";
import { sleep } from "@/util/debug";
import { scrollToTop } from "@/util/dom";

/** logout page */
const LogOut = () => {
  const { clearCurrentUser } = useContext(State);
  const navigate = useNavigate();

  /** mutation to logout */
  const {
    mutate: logoutMutate,
    isLoading: logoutLoading,
    isError: logoutError,
    error: logoutErrorMessage,
  } = useMutation({
    mutationFn: logout,
    onSuccess: async () => {
      notification("success", "Logged out");
      await sleep(1000);
      clearCurrentUser();
      await navigate("/");
      scrollToTop();
    },
  });

  /** try to logout immediately */
  useEffect(() => {
    logoutMutate();
  }, [logoutMutate]);

  return (
    <Section>
      {logoutLoading && <Notification type="loading" text="Logging out" />}
      {logoutError && (
        <Notification
          type="error"
          text={["Error logging out", logoutErrorMessage]}
        />
      )}
    </Section>
  );
};

export default LogOut;
