import { useCallback, useContext, useEffect } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/api/account";
import Button from "@/components/Button";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Meta from "@/components/Meta";
import { notification } from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";
import { scrollToTop } from "@/util/dom";

/** forgot password page */
const ForgotPassword = () => {
  const { currentUser } = useContext(State);
  const navigate = useNavigate();

  /** redirect if already logged in */
  useEffect(() => {
    if (currentUser) {
      navigate("/");
      scrollToTop();
    }
  });

  /** mutation for requesting reset */
  const { mutate: resetMutate, isLoading: forgotLoading } = useMutation({
    mutationFn: forgotPassword,
    onMutate: () => notification("loading", "Requesting password reset"),
    onSuccess: async () => {
      notification(
        "success",
        "If your account is in our system, you should receive a password reset email soon."
      );
    },
    onError: () => notification("error", "Error requesting password reset"),
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
        <Button
          text="Request Reset"
          icon={<FaLock />}
          disabled={forgotLoading}
          form="forgot"
        />
      </Flex>

      <Form id="forgot" onSubmit={onReset} />
    </Section>
  );
};

export default ForgotPassword;
