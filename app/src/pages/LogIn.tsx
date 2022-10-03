import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Button from "@/components/Button";
import Section from "@/components/Section";
import { dummyLogin, loggedInState } from "@/state";
import Flex from "@/components/Flex";

const LogIn = () => {
  const [, setLoggedIn] = useAtom(loggedInState);
  const navigate = useNavigate();

  return (
    <Section>
      <h2>Log In</h2>
      <Flex>
        <Button
          text="Log In"
          icon="right-to-bracket"
          onClick={() => {
            navigate("/");
            setLoggedIn(dummyLogin);
          }}
        />
      </Flex>
    </Section>
  );
};

export default LogIn;
