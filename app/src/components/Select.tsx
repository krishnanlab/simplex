import { SelectHTMLAttributes } from "react";
import { css } from "@stitches/react";
import { dark, deep } from "@/global/palette";
import { capitalize } from "@/util/string";

interface Props<Option> {
  /** label next to input */
  label: string;
  options?: readonly Option[];
  onChange?: (value: Option, index: number) => unknown;
}

const labelStyle = css({
  color: dark,
  marginRight: "15px",
});

const selectStyle = css({
  width: "110px",
  margin: "0",
  padding: "7px 5px",
  background: "none",
  border: "none",
  borderBottom: "solid 2px " + deep,
  fontSize: "inherit",
  fontFamily: "inherit",
  fontWeight: "inherit",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  cursor: "pointer",
});

/** util select component */
const Select = <Option extends string>({
  label,
  options,
  onChange,
  ...props
}: Props<Option> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "options" | "onChange">) => (
  <label>
    <span className={labelStyle()}>{label}:</span>
    <select
      className={selectStyle()}
      onChange={(event) =>
        onChange?.(event.target.value as Option, event.target.selectedIndex)
      }
      {...props}
    >
      {options?.map((option, index) => (
        <option key={index} value={option}>
          {capitalize(option)}
        </option>
      ))}
    </select>
  </label>
);

export default Select;
