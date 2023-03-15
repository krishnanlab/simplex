import { useCallback, useContext } from "react";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEvent } from "react-use";
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
import { sleep } from "@/util/debug";

/** forgot password page */
const ForgotPassword = () => {
  const { currentUser } = useContext(State);
  const navigate = useNavigate();

  /** redirect if already logged in */
  useEvent("current-user", () => {
    if (currentUser) navigate("/");
  });

  /** mutation for requesting reset */
  const { mutate: resetMutate } = useMutation({
    mutationFn: forgotPassword,
    onMutate: () => notification("loading", "Requesting password reset"),
    onSuccess: async () => {
      notification("success", "Sent password reset email");
      await sleep(1000);
      await navigate("/");
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
        <Button text="Request Reset" icon={<FaLock />} form="forgot" />
      </Flex>

      <Form id="forgot" onSubmit={onReset} />
    </Section>
  );
};

export default ForgotPassword;
