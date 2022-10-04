import { HTMLProps } from "react";
import { css } from "@emotion/react";
import { dark, deep } from "@/palette";
import { capitalize } from "@/util/string";

interface Props {
  label: string;
  options: Array<string>;
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

const Field = ({
  label,
  options,
  ...props
}: Props & HTMLProps<HTMLSelectElement>) => (
  <label>
    <span css={labelStyle}>{label}:</span>
    <select css={selectStyle} {...props}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {capitalize(option)}
        </option>
      ))}
    </select>
  </label>
);

export default Field;
