import { useCallback, FormEventHandler, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/Button";
import Section from "@/components/Section";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Field from "@/components/Field";
import { login } from "@/api/account";
import { GlobalState } from "@/App";

const LogIn = () => {
  const { loggedIn, setLoggedIn } = useContext(GlobalState);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) navigate("/account");
  });

  const onLogin: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const { email, password } = Object.fromEntries(
        new FormData(event.target as HTMLFormElement)
      ) as Record<string, string>;

      try {
        const loggedIn = await login({ email, password });
        setLoggedIn(loggedIn);
        navigate("/");
      } catch (error) {
        window.alert("There was a problem logging in.");
        console.error(error);
      }
    },
    [navigate, setLoggedIn]
  );

  return (
    <Section>
      <h2>Log In</h2>
      <Grid>
        <Field
          label="Email"
          name="email"
          placeholder="jane.smith@email.com"
          form="login"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="**********"
          form="login"
        />
      </Grid>
      <Flex dir="col">
        <Link to="/forgot-password">Forgot password</Link>
        <Button text="Log In" icon="right-to-bracket" form="login" />
      </Flex>
      <form id="login" onSubmit={onLogin}></form>
    </Section>
  );
};

export default LogIn;
