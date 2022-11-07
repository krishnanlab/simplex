import { InputHTMLAttributes } from "react";
import { css } from "@emotion/react";
import Help from "@/components/Help";
import { dark, rounded, shadow } from "@/global/palette";

interface Props {
  label: string;
  help?: string;
  optional?: boolean;
  onChange?: (value: string) => unknown;
}

const wrapperStyle = css({
  display: "block",
  margin: "40px 0",
});

const labelStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
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

const Field = ({
  label,
  help,
  optional = false,
  onChange,
  ...props
}: Props & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">) => (
  <label css={wrapperStyle}>
    <div css={labelStyle}>
      {help && <Help tooltip={help} />}
      <span>
        {label}: {optional ? "" : "*"}
      </span>
    </div>
    <input
      required={!optional}
      css={inputStyle}
      {...props}
      onChange={(event) => onChange?.(event.target.value as string)}
    />
  </label>
);

export default Field;
