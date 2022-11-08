import { SelectHTMLAttributes } from "react";
import { css } from "@emotion/react";
import { dark, deep } from "@/global/palette";
import { capitalize } from "@/util/string";

interface Props<Option> {
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

const Select = <Option extends string>({
  label,
  options,
  onChange,
  ...props
}: Props<Option> &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, "options" | "onChange">) => (
  <label>
    <span css={labelStyle}>{label}:</span>
    <select
      css={selectStyle}
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
