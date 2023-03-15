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
import { notification } from "@/components/Notification";
import Section from "@/components/Section";
import { sleep } from "@/util/debug";
import { scrollToTop } from "@/util/dom";

/** reset password page */
const ResetPassword = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  /** mutation for resetting password */
  const { mutate: resetMutate, isLoading: resetLoading } = useMutation({
    mutationFn: resetPassword,
    onMutate: () => notification("loading", "Resetting password"),
    onSuccess: async () => {
      notification("success", "Reset password");
      await sleep(1000);
      await navigate("/login");
      scrollToTop();
    },
    onError: () => notification("error", "Error resetting password"),
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
          form="reset"
        />
        <Field
          label="Confirm New Password"
          name="confirm"
          type="password"
          placeholder="**********"
          form="reset"
        />
      </Grid>
      <Flex>
        <Button
          text="Reset Password"
          icon={<FaLock />}
          disabled={resetLoading}
          form="reset"
        />
      </Flex>

      <Form id="reset" onSubmit={onReset} />
    </Section>
  );
};

export default ResetPassword;
