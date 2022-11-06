import { FormEventHandler, useCallback, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/api/account";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form from "@/components/Form";
import Grid from "@/components/Grid";
import Section from "@/components/Section";
import { State } from "@/global/state";

const LogIn = () => {
  const { loggedIn, setLoggedIn } = useContext(State);
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
      <Grid cols={2}>
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

      <Form id="login" onSubmit={onLogin} />
    </Section>
  );
};

export default LogIn;
