import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/account";
import Notification from "@/components/Notification";
import { State } from "@/global/state";

const LogOut = () => {
  const { setLoggedIn } = useContext(State);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await logout();
      setLoggedIn(null);
      navigate("/");
    })();
  });

  return <Notification type="loading" text="Logging out" />;
};

export default LogOut;
