import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { loggedInState } from "@/state";
import Section from "@/components/Section";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Button from "@/components/Button";

const Account = () => {
  const [loggedIn] = useAtom(loggedInState);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedIn) navigate("/login");
  });

  return (
    <Section>
      <h2>Account</h2>

      <form>
        <Flex hAlign="stretch" dir="col">
          <h3>Personal Info</h3>
          <Grid>
            <Field
              name="Display Name:"
              placeholder="Jane Smith"
              defaultValue={loggedIn?.displayName || ""}
            />
            <Field
              name="Email:"
              optional={true}
              placeholder="jane.smith@email.com"
              defaultValue={loggedIn?.email || ""}
            />
            <Field
              name="Institution:"
              optional={true}
              placeholder="University of Colorado"
              defaultValue={loggedIn?.institution || ""}
            />
          </Grid>
        </Flex>
        <Flex>
          <Button text="Save Info" icon="floppy-disk" />
        </Flex>
      </form>

      <form>
        <Flex hAlign="stretch" dir="col">
          <h3>Change Password</h3>
          <Grid>
            <Field name="Current Password:" type="password" />
            <Field name="New Password:" type="password" />
            <Field name="Confirm New Password:" type="password" />
          </Grid>
        </Flex>
        <Flex>
          <Button text="Change Password" icon="lock" />
        </Flex>
      </form>
    </Section>
  );
};

export default Account;
