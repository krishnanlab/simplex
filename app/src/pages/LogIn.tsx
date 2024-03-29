import { useCallback, useContext, useEffect } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/account";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import { clearNotification, notification } from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";
import { scrollToTop } from "@/util/dom";

/** login page */
const LogIn = () => {
  const { currentUser, refreshCurrentUser } = useContext(State);
  const navigate = useNavigate();

  /** redirect if already logged in */
  useEffect(() => {
    if (currentUser) navigate("/");
  });

  /** mutation for logging in */
  const { mutate: loginMutate } = useMutation({
    mutationFn: login,
    onMutate: () => notification("loading", "Logging in"),
    onSuccess: async () => {
      clearNotification();
      await navigate("/");
      scrollToTop();
      refreshCurrentUser();
    },
    onError: (error) => notification("error", ["Error logging in", error]),
  });

  /** when login form submitted */
  const onLogin = useCallback(
    async (data: FormValues) => {
      const { email, password, remember } = data;
      loginMutate({ email, password, remember: Boolean(remember) });
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
        <Checkbox
          name="remember"
          label="Keep me logged in"
          defaultChecked={false}
          form="login"
        />
        <Button text="Log In" icon={<FaSignInAlt />} form="login" />
        <Link to="/forgot-password">Forgot password</Link>
      </Flex>

      <Form id="login" onSubmit={onLogin} />
    </Section>
  );
};

export default LogIn;
