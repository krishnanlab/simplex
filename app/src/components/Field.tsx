import { InputHTMLAttributes, ReactNode } from "react";
import { css } from "@stitches/react";
import PasswordMeter from "./PasswordMeter";
import Flex from "@/components/Flex";
import Help from "@/components/Help";
import { dark, rounded, shadow } from "@/global/palette";

type Props = {
  /** text above input */
  label: string;
  /** question mark text on hover */
  help?: string;
  /** whether field is multi-line */
  multi?: boolean;
  /** whether field is optional for form */
  optional?: boolean;
  /** whether to check and show password strength */
  strength?: boolean;
  onChange?: (value: string) => unknown;
  children?: ReactNode;
} & Omit<
  InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
  "onChange"
>;

const wrapperStyle = css({
  display: "block",
  margin: "40px 0",
});

const labelStyle = css({
  color: dark,
  marginBottom: "15px",
});

const inputStyle = css({
  width: "100%",
  marginBottom: "10px",
  minHeight: "40px",
  margin: "0",
  padding: "5px 10px",
  border: "none",
  borderRadius: rounded,
  fontSize: "inherit",
  fontFamily: "inherit",
  fontWeight: "inherit",
  boxShadow: shadow,
  appearance: "none",
  resize: "vertical",
  "&::placeholder": {
    color: dark,
    opacity: 0.5,
  },
});

const childStyle = css({
  display: "flex",
  alignItems: "center",
  minHeight: "40px",
});

/** text input with label */
const Field = ({
  label,
  help,
  disabled,
  multi = false,
  optional = false,
  strength = false,
  onChange,
  children,
  ...props
}: Props) => {
  let content = <></>;

  if (children) content = <div className={childStyle()}>{children}</div>;
  else {
    const Component = multi ? "textarea" : "input";
    content = (
      <>
        <Component
          required={!optional}
          disabled={disabled}
          className={inputStyle()}
          rows={8}
          {...props}
          onChange={(event) => onChange?.(event.target.value as string)}
        />
        {strength && <PasswordMeter />}
      </>
    );
  }

  return (
    <label className={wrapperStyle()}>
      <Flex hAlign="left" gap="tiny" className={labelStyle()}>
        {help && <Help tooltip={help} />}
        <span>
          {label}: {optional || disabled ? "" : "*"}
        </span>
      </Flex>
      {content}
    </label>
  );
};

export default Field;
