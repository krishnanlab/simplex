import { HTMLProps } from "react";
import { css } from "@emotion/react";
import { dark, rounded, shadow } from "@/palette";

interface Props {
  label: string;
  optional?: boolean;
}

const labelStyle = css({
  width: "100%",
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
  optional = false,
  ...props
}: Props & HTMLProps<HTMLInputElement>) => (
  <label>
    <div css={labelStyle}>
      {label}: {optional ? "" : "*"}
    </div>
    <input required={!optional} css={inputStyle} {...props} />
  </label>
);

export default Field;
