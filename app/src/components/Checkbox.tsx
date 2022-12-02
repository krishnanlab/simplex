import { InputHTMLAttributes } from "react";
import { css } from "@stitches/react";
import { deep } from "@/global/palette";

type Props = {
  /** label above input */
  label: string;
  onChange?: (value: boolean) => unknown;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange">;

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

/** checkbox with label */
const Checkbox = ({ label, onChange, ...props }: Props) => (
  <label className={wrapperStyle()}>
    <input
      type="checkbox"
      className={inputStyle()}
      onChange={(event) => onChange?.(event.target.checked)}
      {...props}
    ></input>
    <span className={labelStyle()}>{label}</span>
  </label>
);

export default Checkbox;
