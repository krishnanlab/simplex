import { FormEventHandler, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Section from "@/components/Section";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Button from "@/components/Button";
import { forgotPassword } from "@/api/account";

const Account = () => {
  const navigate = useNavigate();

  const onReset: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const { email } = Object.fromEntries(
        new FormData(event.target as HTMLFormElement)
      ) as Record<string, string>;

      try {
        await forgotPassword({ email });
        window.alert("We sent you an email to reset your password.");
        navigate("/");
      } catch (error) {
        window.alert("There was a problem resetting your password.");
        console.error(error);
      }
    },
    [navigate]
  );

  return (
    <Section>
      <h2>Forgot Password</h2>

      <Field
        label="Email"
        name="email"
        placeholder="jane.smith@email.com"
        form="forgot"
      />

      <Flex>
        <Button text="Request Reset" icon="lock" form="forgot" />
      </Flex>
      <form id="forgot" onSubmit={onReset}></form>
    </Section>
  );
};

export default Account;
