import { FormEventHandler, useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "@/api/account";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Section from "@/components/Section";
import { State } from "@/global/state";

const SignUp = () => {
  const { loggedIn, setLoggedIn } = useContext(State);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedIn) navigate("/account");
  });

  const onSignup: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const { name, email, institution, password, confirm, newsletter } =
        Object.fromEntries(
          new FormData(event.target as HTMLFormElement)
        ) as Record<string, string>;

      if (confirm !== password) {
        window.alert("Passwords do not match.");
        return;
      }

      try {
        const loggedIn = await signup({
          name,
          email,
          institution,
          newsletter: !!newsletter,
          password,
        });
        setLoggedIn(loggedIn);
        navigate("/");
      } catch (error) {
        window.alert("There was a problem signing up.");
        console.error(error);
      }
    },
    [navigate, setLoggedIn]
  );

  return (
    <Section>
      <h2>Sign Up</h2>
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
          label="Display Name"
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
        <Button text="Sign Up" icon="user-plus" form="signup" />
      </Flex>
      <form id="signup" onSubmit={onSignup}></form>
    </Section>
  );
};

export default SignUp;
