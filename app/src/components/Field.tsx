import { HTMLProps } from "react";
import { css } from "@emotion/react";
import { dark, rounded, shadow } from "@/palette";

interface Props {
  name: string;
  optional?: boolean;
}

const wrapperStyle = css({
  flexGrow: "1",
});

const labelStyle = css({
  width: "100%",
  color: dark,
  marginBottom: "15px",
});

const inputStyle = css({
  width: "100%",
  padding: "5px 10px",
  marginBottom: "10px",
  minHeight: "40px",
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
  name,
  optional = false,
  ...props
}: Props & HTMLProps<HTMLInputElement>) => (
  <label css={wrapperStyle}>
    <div css={labelStyle}>
      {name} {optional ? "" : "*"}
    </div>
    <input required={!optional} css={inputStyle} {...props} />
  </label>
);

export default Field;
