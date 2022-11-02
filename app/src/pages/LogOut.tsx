import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Section from "@/components/Section";
import { logout } from "@/api/account";
import { GlobalState } from "@/App";

const LogOut = () => {
  const { setLoggedIn } = useContext(GlobalState);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      await logout();
      setLoggedIn(null);
      navigate("/");
    })();
  });

  return <Section>Logging Out</Section>;
};

export default LogOut;
