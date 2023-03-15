import { useCallback, useContext } from "react";
import { FaLock, FaRegSave } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEvent } from "react-use";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { changePassword, saveInfo } from "@/api/account";
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

/** logged-in user's account page */
const Account = () => {
  const { currentUser, setCurrentUser } = useContext(State);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  /** redirect if not logged in */
  useEvent("current-user", () => {
    if (!currentUser) navigate("/login");
  });

  /** mutation for saving info */
  const { mutate: saveInfoMutate, isLoading: saveInfoLoading } = useMutation({
    mutationFn: (...params: Parameters<typeof saveInfo>) => {
      notification("loading", "Saving info");
      return saveInfo(...params);
    },
    onSuccess: async (data) => {
      queryClient.removeQueries({
        queryKey: ["getAuthor", currentUser?.id],
      });
      setCurrentUser(data);
      notification("success", "Saved info");
    },
    onError: (error) => notification("error", ["Error saving info", error]),
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
  const { mutate: changePasswordMutate, isLoading: changePasswordLoading } =
    useMutation({
      mutationFn: (...params: Parameters<typeof changePassword>) => {
        notification("loading", "Changing password");
        return changePassword(...params);
      },
      onSuccess: async () => {
        notification("success", "Changed password");
      },
      onError: (error) =>
        notification("error", ["Error saving password", error]),
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
    <>
      <Section>
        <Meta title="Account" />
        <h2>Account</h2>
      </Section>

      {/* form */}
      <Section fill="offWhite">
        <h3>Personal Info</h3>
        <Grid>
          <Field
            label="Name"
            name="name"
            placeholder="Jane Smith"
            defaultValue={currentUser?.name || ""}
            form="save-info"
          />
          <Field
            label="Email"
            name="email"
            placeholder="jane.smith@email.com"
            defaultValue={currentUser?.email || ""}
            form="save-info"
          />
          <Field
            label="Institution"
            name="institution"
            optional={true}
            placeholder="University of Colorado"
            defaultValue={currentUser?.institution || ""}
            form="save-info"
          />
        </Grid>
        <Flex dir="col">
          <Flex gap="small">
            <Checkbox
              name="newsletter"
              label="Subscribe to our newsletter"
              defaultChecked={currentUser?.newsletter}
              form="save-info"
            />
            <Help tooltip="We promise only infrequent, meaningful updates!" />
          </Flex>
          <Button
            text="Save Info"
            icon={<FaRegSave />}
            disabled={saveInfoLoading}
            form="save-info"
          />
        </Flex>

        <Form id="save-info" onSubmit={onSaveInfo} />
      </Section>

      {/* form */}
      <Section>
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
            strength={true}
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

        <Form id="change-password" onSubmit={onChangePassword} />
      </Section>
    </>
  );
};

export default Account;
