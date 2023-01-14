import { SelectHTMLAttributes } from "react";
import { css } from "@stitches/react";
import { dark, deep } from "@/global/palette";

type Props<Option> = {
  /** label next to input */
  label: string;
  value?: string;
  options?: readonly Option[];
  onChange?: (value: Option, index: number) => unknown;
} & Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "value" | "options" | "onChange"
>;

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
const Select = <Option extends { label: string; value: string }>({
  label,
  value,
  options,
  onChange,
  ...props
}: Props<Option>) => (
  <label>
    <span className={labelStyle()}>{label}:</span>
    <select
      className={selectStyle()}
      value={value}
      onChange={(event) => {
        const { value, selectedIndex, options } = event.target;
        const label = options[selectedIndex].innerHTML;
        onChange?.({ value, label } as Option, selectedIndex);
      }}
      {...props}
    >
      {options?.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </label>
);

export default Select;
