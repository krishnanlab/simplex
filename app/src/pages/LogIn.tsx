import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import Button from "@/components/Button";
import Section from "@/components/Section";
import { exampleLogin, loggedInState } from "@/state";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Field from "@/components/Field";
import { Link } from "react-router-dom";

const LogIn = () => {
  const [, setLoggedIn] = useAtom(loggedInState);
  const navigate = useNavigate();

  return (
    <Section>
      <h2>Log In</h2>
      <Grid>
        <Field name="Email:" placeholder={exampleLogin.email} />
        <Field
          name="Password:"
          type="password"
          placeholder={exampleLogin.password}
        />
      </Grid>
      <Flex>
        <Link to="/">Forgot password</Link>
      </Flex>
      <Flex>
        <Button
          text="Log In"
          icon="right-to-bracket"
          onClick={() => {
            navigate("/");
            setLoggedIn(exampleLogin);
          }}
        />
      </Flex>

      <h3>Sign Up</h3>
      <p>
        <strong>Why sign up?</strong>
      </p>
      <ul>
        <li>Track revisions to your articles.</li>
        <li>Organize your articles into collections and share them.</li>
        <li>Get important updates via our newsletter.</li>
      </ul>
      <Grid>
        <Field name="Display Name:" placeholder={exampleLogin.name} />
        <Field name="Email:" optional={true} placeholder={exampleLogin.email} />
        <Field
          name="Institution:"
          optional={true}
          placeholder={exampleLogin.institution}
        />
        <Field
          name="Password:"
          type="password"
          placeholder={exampleLogin.password}
        />
        <Field
          name="Confirm Password:"
          type="password"
          placeholder={exampleLogin.password}
        />
      </Grid>
      <Flex>
        <Button
          text="Sign Up"
          icon="user-plus"
          onClick={() => {
            navigate("/");
            setLoggedIn(exampleLogin);
          }}
        />
      </Flex>
    </Section>
  );
};

export default LogIn;
