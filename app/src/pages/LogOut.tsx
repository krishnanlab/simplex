import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Section from "@/components/Section";
import { loggedInState } from "@/state";

const LogOut = () => {
  const [, setLoggedIn] = useAtom(loggedInState);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(null);
    navigate("/");
  });

  return <Section>Logging Out</Section>;
};

export default LogOut;
