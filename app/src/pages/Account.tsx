import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { loggedInState, exampleLogin } from "@/state";
import Section from "@/components/Section";
import Field from "@/components/Field";
import Flex from "@/components/Flex";
import Grid from "@/components/Grid";
import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";

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
        <h3>Personal Info</h3>
        <Grid>
          <Field
            label="Display Name"
            placeholder="Jane Smith"
            defaultValue={loggedIn?.name || ""}
          />
          <Field
            label="Email"
            optional={true}
            placeholder="jane.smith@email.com"
            defaultValue={loggedIn?.email || ""}
          />
          <Field
            label="Institution"
            optional={true}
            placeholder="University of Colorado"
            defaultValue={loggedIn?.institution || ""}
          />
        </Grid>
        <Flex dir="col">
          <Checkbox
            label="Subscribe to our newsletter"
            defaultChecked={loggedIn?.newsletter}
          />
          <Button text="Save Info" icon="floppy-disk" />
        </Flex>
      </form>

      <form>
        <h3>Change Password</h3>
        <Grid>
          <Field
            label="Current Password"
            type="password"
            placeholder={exampleLogin.password}
          />
          <Field
            label="New Password"
            type="password"
            placeholder={exampleLogin.password}
          />
          <Field
            label="Confirm New Password"
            type="password"
            placeholder={exampleLogin.password}
          />
        </Grid>
        <Flex>
          <Button text="Change Password" icon="lock" />
        </Flex>
      </form>
    </Section>
  );
};

export default Account;
