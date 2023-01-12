import { useCallback, useContext } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/account";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Meta from "@/components/Meta";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";

/** forgot password page */
const ForgotPassword = () => {
  const { loggedIn } = useContext(State);
  const navigate = useNavigate();

  /** redirect if already logged in */
  if (loggedIn) navigate("/");

  /** mutation for requesting reset */
  const {
    mutate: resetMutate,
    isLoading: resetLoading,
    isError: resetError,
  } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: async () => {
      await navigate("/");
      notification("success", "Sent password reset email");
    },
  });

  /** when forgot form submitted */
  const onReset = useCallback(
    async (data: FormValues) => {
      const { email } = data;
      resetMutate({ email });
    },
    [resetMutate]
  );

  return (
    <Section>
      <Meta title="Forgot Password" />
      <h2>Forgot Password</h2>

      <Field
        label="Email"
        name="email"
        placeholder="jane.smith@email.com"
        form="forgot"
      />
      <Flex>
        <Button text="Request Reset" icon={<FaLock />} form="forgot" />
      </Flex>

      {/* statuses */}
      {resetLoading && (
        <Notification type="loading" text="Requesting password reset" />
      )}
      {resetError && (
        <Notification type="error" text="Error requesting password reset" />
      )}

      <Form id="forgot" onSubmit={onReset} />
    </Section>
  );
};

export default ForgotPassword;
