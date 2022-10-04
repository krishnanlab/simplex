import { useNavigate, Link } from "react-router-dom";
import { useAtom } from "jotai";
import Button from "@/components/Button";
import Section from "@/components/Section";
import { exampleLogin, loggedInState } from "@/state";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Field from "@/components/Field";

const LogIn = () => {
  const [, setLoggedIn] = useAtom(loggedInState);
  const navigate = useNavigate();

  return (
    <Section>
      <h2>Log In</h2>
      <Grid>
        <Field label="Email" placeholder={exampleLogin.email} />
        <Field
          label="Password"
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
        <Field label="Display Name" placeholder={exampleLogin.name} />
        <Field label="Email" optional={true} placeholder={exampleLogin.email} />
        <Field
          label="Institution"
          optional={true}
          placeholder={exampleLogin.institution}
        />
        <Field
          label="Password"
          type="password"
          placeholder={exampleLogin.password}
        />
        <Field
          label="Confirm Password"
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
