import { useCallback } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { resetPassword } from "@/api/account";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";

/** reset password page */
const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  /** mutation for resetting password */
  const {
    mutate: resetMutate,
    isLoading: resetLoading,
    isError: resetError,
    error: resetErrorMessage,
  } = useMutation({
    mutationFn: resetPassword,
    onSuccess: async () => {
      await navigate("/login");
      notification("success", "Reset password");
    },
  });

  /** when reset form submitted */
  const onReset = useCallback(
    async (data: FormValues) => {
      const { code, email, password, confirm } = data;
      if (confirm !== password) {
        window.alert("Passwords do not match.");
        return;
      }
      resetMutate({ code, email, password });
    },
    [resetMutate]
  );

  return (
    <Section>
      <Meta title="Reset Password" />
      <h2>Reset Password</h2>

      <Grid cols={2}>
        <Field
          label="Code"
          name="code"
          placeholder="xxxxxx"
          defaultValue={params.get("code") || ""}
          form="reset"
        />
        <Field
          label="Email"
          name="email"
          placeholder="jane.smith@email.com"
          defaultValue={params.get("email") || ""}
          form="reset"
        />
        <Field
          label="New Password"
          name="password"
          type="password"
          placeholder="**********"
          form="change-password"
        />
        <Field
          label="Confirm New Password"
          name="confirm"
          type="password"
          placeholder="**********"
          form="change-password"
        />
      </Grid>
      <Flex>
        <Button text="Reset Password" icon={<FaLock />} form="reset" />
      </Flex>

      {/* statuses */}
      {resetLoading && (
        <Notification type="loading" text="Resetting password" />
      )}
      {resetError && (
        <Notification
          type="error"
          text={["Error resetting password", resetErrorMessage]}
        />
      )}

      <Form id="reset" onSubmit={onReset} />
    </Section>
  );
};

export default ResetPassword;
