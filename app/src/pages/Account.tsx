import { useCallback, useContext, useEffect } from "react";
import { FaLock, FaRegSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

/** logged-in user's account page */
const Account = () => {
  const { loggedIn, setLoggedIn } = useContext(State);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /** redirect if not logged in */
  useEffect(() => {
    if (!loggedIn) navigate("/login");
  });

  /** mutation for saving info */
  const {
    mutate: saveInfoMutate,
    isLoading: saveInfoLoading,
    isError: saveInfoError,
  } = useMutation({
    mutationFn: saveInfo,
    onSuccess: async (data) => {
      setLoggedIn(data);
      notification("success", "Saved info");
      if (loggedIn?.id)
        await queryClient.removeQueries({
          queryKey: ["getAuthor", loggedIn.id],
        });
    },
  });

  /** when save info form submitted */
  const onSaveInfo = useCallback(
    async (data: FormValues) => {
      const { name, email, institution, newsletter } = data;
      saveInfoMutate({ name, email, institution, newsletter: !!newsletter });
    },
    [saveInfoMutate]
  );

  /** mutation for changing password */
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

  /** when change password form submitted */
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

      {/* form */}
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
          icon={<FaRegSave />}
          disabled={saveInfoLoading}
          form="save-info"
        />
      </Flex>

      {/* statuses */}
      {saveInfoLoading && <Notification type="loading" text="Saving info" />}
      {saveInfoError && <Notification type="error" text="Error saving info" />}

      <Form id="save-info" onSubmit={onSaveInfo} />

      {/* form */}
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
          icon={<FaLock />}
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
