import { SelectHTMLAttributes } from "react";
import { css } from "@emotion/react";
import { dark, deep } from "@/palette";
import { capitalize } from "@/util/string";

interface Props<Option> {
  label: string;
  options: readonly Option[];
  onChange: (value: Option) => unknown;
}

const labelStyle = css({
  color: dark,
  marginRight: "15px",
});

const selectStyle = css({
  margin: "0",
  padding: "7px 5px",
  background: "none",
  border: "none",
  borderBottom: "solid 2px " + deep,
  fontSize: "inherit",
  fontFamily: "inherit",
  fontWeight: "inherit",
  cursor: "pointer",
});

const Field = <Option extends string>({
  label,
  options,
  onChange = () => null,
  ...props
}: Props<Option> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "options" | "onChange">) => (
  <label>
    <span css={labelStyle}>{label}:</span>
    <select
      css={selectStyle}
      {...props}
      onChange={(event) => onChange(event.target.value as Option)}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {capitalize(option)}
        </option>
      ))}
    </select>
  </label>
);

export default Field;
