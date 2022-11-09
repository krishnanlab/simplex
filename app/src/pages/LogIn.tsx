import { useCallback, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/account";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import Notification from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";

/** login page */
const LogIn = () => {
  const { loggedIn, setLoggedIn } = useContext(State);
  const navigate = useNavigate();

  /** redirect if already logged in */
  useEffect(() => {
    if (loggedIn) navigate("/");
  });

  /** mutation for logging in */
  const {
    mutate: loginMutate,
    isLoading: loginLoading,
    isError: loginError,
  } = useMutation({
    mutationFn: login,
    onSuccess: async (data) => {
      setLoggedIn(data);
      navigate("/");
    },
  });

  /** when login form submitted */
  const onLogin = useCallback(
    async (data: FormValues) => {
      const { email, password } = data;
      loginMutate({ email, password });
    },
    [loginMutate]
  );

  return (
    <Section>
      <Meta title="Log In" />
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

      {/* statuses */}
      {loginLoading && <Notification type="loading" text="Logging in" />}
      {loginError && <Notification type="error" text="Error logging in" />}

      <Form id="login" onSubmit={onLogin} />
    </Section>
  );
};

export default LogIn;
