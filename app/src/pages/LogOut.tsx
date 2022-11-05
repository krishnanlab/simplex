import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/account";
import Section from "@/components/Section";
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

  return <Section>Logging Out</Section>;
};

export default LogOut;
