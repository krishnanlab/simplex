import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Button from "@/components/Button";
import Section from "@/components/Section";
import { loggedInState } from "@/state";

const LogIn = () => {
  const [, setLoggedIn] = useAtom(loggedInState);
  const navigate = useNavigate();

  return (
    <Section>
      <Button
        text="Log In"
        icon="right-to-bracket"
        onClick={() => {
          navigate("/");
          setLoggedIn({
            displayName: "Jane Smith",
            email: "jane@smith.com",
            institution: "University of Colorado",
          });
        }}
      />
    </Section>
  );
};

export default LogIn;
