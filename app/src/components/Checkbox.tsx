import { HTMLProps } from "react";
import { css } from "@emotion/react";
import { deep } from "@/palette";

interface Props {
  label: string;
}

const wrapperStyle = css({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
});

const labelStyle = css({
  color: deep,
});

const inputStyle = css({
  width: "16px",
  height: "16px",
  margin: "0",
  padding: "2px 4px",
  accentColor: deep,
  cursor: "pointer",
});

const Field = ({ label, ...props }: Props & HTMLProps<HTMLInputElement>) => (
  <label css={wrapperStyle}>
    <input type="checkbox" css={inputStyle} {...props}></input>
    <span css={labelStyle}>{label}</span>
  </label>
);

export default Field;
