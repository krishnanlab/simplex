import { useCallback, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { changePassword, saveInfo } from "@/api/account";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Form, { FormValues } from "@/components/Form";
import Grid from "@/components/Grid";
import Meta from "@/components/Meta";
import Notification, { notification } from "@/components/Notification";
import Section from "@/components/Section";
import { State } from "@/global/state";

const Account = () => {
  const { loggedIn, setLoggedIn } = useContext(State);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate("/login");
  });

  const {
    mutate: saveInfoMutate,
    isLoading: saveInfoLoading,
    isError: saveInfoError,
  } = useMutation({
    mutationFn: saveInfo,
    onSuccess: async (data) => {
      setLoggedIn(data);
      notification("success", "Saved info");
    },
  });

  const onSaveInfo = useCallback(
    async (data: FormValues) => {
      const { name, email, institution, newsletter } = data;
      saveInfoMutate({ name, email, institution, newsletter: !!newsletter });
    },
    [saveInfoMutate]
  );

  const {
    mutate: changePasswordMutate,
    isLoading: changePasswordLoading,
    isError: changePasswordError,
  } = useMutation({
    mutationFn: changePassword,
    onSuccess: async () => {
      notification("success", "Changed password");
    },
  });

  const onChangePassword = useCallback(
    async (data: FormValues) => {
      const { current, fresh, confirm } = data;
      if (confirm !== fresh) {
        window.alert("Passwords do not match.");
        return;
      }
      changePasswordMutate({ current, fresh });
    },
    [changePasswordMutate]
  );

  return (
    <Section>
      <Meta title="Account" />
      <h2>Account</h2>

      <h3>Personal Info</h3>
      <Grid>
        <Field
          label="Name"
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
        <Button
          text="Save Info"
          icon="floppy-disk"
          disabled={saveInfoLoading}
          form="save-info"
        />
      </Flex>

      {saveInfoLoading && <Notification type="loading" text="Saving info" />}
      {saveInfoError && <Notification type="error" text="Error saving info" />}

      <Form id="save-info" onSubmit={onSaveInfo} />

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
          name="fresh"
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
        <Button
          text="Change Password"
          icon="lock"
          form="change-password"
          disabled={changePasswordLoading}
        />
      </Flex>

      {/* statuses */}
      {changePasswordLoading && (
        <Notification type="loading" text="Changing password" />
      )}
      {changePasswordError && (
        <Notification type="error" text="Error changing password" />
      )}

      <Form id="change-password" onSubmit={onChangePassword} />
    </Section>
  );
};

export default Account;
