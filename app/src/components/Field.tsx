import { InputHTMLAttributes } from "react";
import { css } from "@emotion/react";
import Flex from "@/components/Flex";
import Help from "@/components/Help";
import { dark, rounded, shadow } from "@/global/palette";

export type Props = {
  /** text above input */
  label: string;
  /** question mark text on hover */
  help?: string;
  /** whether field is optional for form */
  optional?: boolean;
  onChange?: (value: string) => unknown;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

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
  "&::placeholder": {
    color: dark,
    opacity: 0.5,
  },
});

/** text input with label */
const Field = ({
  label,
  help,
  optional = false,
  onChange,
  ...props
}: Props) => (
  <label css={wrapperStyle}>
    <Flex hAlign="left" gap="tiny" css={labelStyle}>
      {help && <Help tooltip={help} />}
      <span>
        {label}: {optional ? "" : "*"}
      </span>
    </Flex>
    <input
      required={!optional}
      css={inputStyle}
      {...props}
      onChange={(event) => onChange?.(event.target.value as string)}
    />
  </label>
);

export default Field;
