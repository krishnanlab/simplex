import { useCallback, useContext } from "react";
import { FaUserPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEvent } from "react-use";
import { useMutation } from "@tanstack/react-query";
import { signup } from "@/api/account";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Grid from "@/components/Grid";
import Help from "@/components/Help";
import Meta from "@/components/Meta";
import { notification } from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";
import { sleep } from "@/util/debug";

/** signup page */
const SignUp = () => {
  const { currentUser, setCurrentUser } = useContext(State);
  const navigate = useNavigate();

  /** redirect if already logged in */
  useEvent("current-user", () => {
    if (currentUser) navigate("/");
  });

  /** mutation to signup */
  const { mutate: signupMutate } = useMutation({
    mutationFn: signup,
    onMutate: () => notification("loading", "Signing up"),
    onSuccess: async (data) => {
      notification("success", "Signed up");
      await sleep(1000);
      setCurrentUser(data);
      await navigate("/");
    },
    onError: (error) => notification("error", ["Error signing up", error]),
  });

  /** when signup form submitted */
  const onSignup = useCallback(
    async (data: FormValues) => {
      const {
        name,
        email,
        institution,
        password,
        confirm,
        newsletter,
        remember,
      } = data;
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
        remember: Boolean(remember),
      });
    },
    [signupMutate]
  );

  return (
    <>
      <Section>
        <Meta title="Sign Up" />
        <h2>Sign Up</h2>
      </Section>

      {/* pitch */}
      <Section fill="offWhite">
        <p>
          <strong>Why sign up?</strong>
        </p>
        <ul>
          <li>Track revisions to your articles.</li>
          <li>Organize your articles into collections and share them.</li>
          <li>Get important updates via our newsletter.</li>
        </ul>
      </Section>

      {/* form */}
      <Section>
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
            strength={true}
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
          <Flex gap="small">
            <Checkbox
              name="newsletter"
              label="Subscribe to our newsletter"
              defaultChecked={false}
              form="signup"
            />
            <Help tooltip="We promise only infrequent, meaningful updates!" />
          </Flex>
          <Checkbox
            name="remember"
            label="Keep me logged in"
            defaultChecked={false}
            form="signup"
          />
          <Button text="Sign Up" icon={<FaUserPlus />} form="signup" />
        </Flex>

        <Form id="signup" onSubmit={onSignup} />
      </Section>
    </>
  );
};

export default SignUp;
