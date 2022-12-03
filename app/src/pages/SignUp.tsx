import { useCallback, useContext, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/api/account";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import Notification from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";

/** signup page */
const SignUp = () => {
  const { loggedIn, setLoggedIn } = useContext(State);
  const navigate = useNavigate();

  /** redirect if already logged in */
  useEffect(() => {
    if (loggedIn) navigate("/");
  });

  /** mutation to signup */
  const {
    mutate: signupMutate,
    isLoading: signupLoading,
    isError: signupError,
  } = useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      setLoggedIn(data);
      navigate("/");
    },
  });

  /** when signup form submitted */
  const onSignup = useCallback(
    async (data: FormValues) => {
      const { name, email, institution, password, confirm, newsletter } = data;
      if (confirm !== password) {
        window.alert("Passwords do not match.");
        return;
      }
      signupMutate({
        name,
        email,
        institution,
        newsletter: !!newsletter,
        password,
      });
    },
    [signupMutate]
  );

  return (
    <Section>
      <Meta title="Sign Up" />
      <h2>Sign Up</h2>

      {/* pitch */}
      <p>
        <strong>Why sign up?</strong>
      </p>
      <ul>
        <li>Track revisions to your articles.</li>
        <li>Organize your articles into collections and share them.</li>
        <li>Get important updates via our newsletter.</li>
      </ul>

      <Grid>
        <Field
          label="Name"
          name="name"
          placeholder="Jane Smith"
          form="signup"
        />
        <Field
          label="Email"
          name="email"
          placeholder="jane.smith@email.com"
          form="signup"
        />
        <Field
          label="Institution"
          name="institution"
          optional={true}
          placeholder="University of Colorado"
          form="signup"
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="**********"
          form="signup"
        />
        <Field
          label="Confirm Password"
          name="confirm"
          type="password"
          placeholder="**********"
          form="signup"
        />
      </Grid>
      <Flex dir="col">
        <Checkbox
          name="newsletter"
          label="Subscribe to our newsletter"
          defaultChecked={true}
          form="signup"
        />
        <Button text="Sign Up" icon={<FaUserPlus />} form="signup" />
      </Flex>

      {/* statuses */}
      {signupLoading && <Notification type="loading" text="Signing up" />}
      {signupError && <Notification type="error" text="Error signing up" />}

      <Form id="signup" onSubmit={onSignup} />
    </Section>
  );
};

export default SignUp;
