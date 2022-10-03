import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Section from "@/components/Section";
import { loggedInState } from "@/state";
import Flex from "@/components/Flex";

const Account = () => {
  const [loggedIn] = useAtom(loggedInState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate("/login");
  });

  return (
    <Section>
      <h2>Account</h2>
      <Flex dir="col" hAlign="left">
        <strong>Display Name</strong>
        <div>{loggedIn?.displayName}</div>
        <strong>Email</strong>
        <div>{loggedIn?.email}</div>
        <strong>Institution</strong>
        <div>{loggedIn?.institution}</div>
      </Flex>
    </Section>
  );
};

export default Account;
