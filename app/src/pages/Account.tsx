import { useCallback, useContext, useEffect, FormEventHandler } from "react";
import { useNavigate } from "react-router-dom";
import Section from "@/components/Section";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import { GlobalState } from "@/App";
import { changePassword, saveInfo } from "@/api/account";

const Account = () => {
  const { loggedIn, setLoggedIn } = useContext(GlobalState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate("/login");
  });

  const onSaveInfo: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const { name, email, institution, newsletter } = Object.fromEntries(
        new FormData(event.target as HTMLFormElement)
      ) as Record<string, string>;

      try {
        const loggedIn = await saveInfo({
          name,
          email,
          institution,
          newsletter: !!newsletter,
        });
        setLoggedIn(loggedIn);
        window.alert("Successfully saved your info.");
      } catch (error) {
        window.alert("There was a problem saving your info.");
        console.error(error);
      }
    },
    [setLoggedIn]
  );

  const onChangePassword: FormEventHandler<HTMLFormElement> = useCallback(
    async (event) => {
      event.preventDefault();

      const {
        current,
        new: fresh,
        confirm,
      } = Object.fromEntries(
        new FormData(event.target as HTMLFormElement)
      ) as Record<string, string>;

      if (confirm !== fresh) {
        window.alert("Passwords do not match.");
        return;
      }

      try {
        await changePassword({ current, fresh });
        window.alert("Successfully changed your password.");
      } catch (error) {
        window.alert("There was a problem changing your password.");
        console.error(error);
      }
    },
    []
  );

  return (
    <Section>
      <h2>Account</h2>

      <h3>Personal Info</h3>
      <Grid>
        <Field
          label="Display Name"
          name="name"
          placeholder="Jane Smith"
          defaultValue={loggedIn?.name || ""}
          form="save-info"
        />
        <Field
          label="Email"
          name="email"
          placeholder="jane.smith@email.com"
          defaultValue={loggedIn?.email || ""}
          form="save-info"
        />
        <Field
          label="Institution"
          name="institution"
          optional={true}
          placeholder="University of Colorado"
          defaultValue={loggedIn?.institution || ""}
          form="save-info"
        />
      </Grid>
      <Flex dir="col">
        <Checkbox
          label="Subscribe to our newsletter"
          name="newsletter"
          defaultChecked={loggedIn?.newsletter}
          form="save-info"
        />
        <Button text="Save Info" icon="floppy-disk" form="save-info" />
      </Flex>
      <form id="save-info" onSubmit={onSaveInfo}></form>

      <h3>Change Password</h3>
      <Grid>
        <Field
          label="Current Password"
          name="current"
          type="password"
          placeholder="**********"
          form="change-password"
        />
        <Field
          label="New Password"
          name="new"
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
        <Button text="Change Password" icon="lock" form="change-password" />
      </Flex>
      <form id="change-password" onSubmit={onChangePassword}></form>
    </Section>
  );
};

export default Account;
