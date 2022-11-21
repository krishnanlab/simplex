import { ReactNode } from "react";
import { css } from "@stitches/react";
import Flex from "@/components/Flex";
import Help from "@/components/Help";
import { dark, deep } from "@/global/palette";

interface Props {
  /** question mark text on hover */
  help?: string;
  /** left text (key) */
  label?: string;
  /** right text (value) */
  value?: string | number | ReactNode;
}

const labelStyle = css({ color: dark, lineHeight: 1 });
const valueStyle = css({ color: deep, lineHeight: 1 });

/** simple left/right key/value text with help text */
const Stat = ({ help, label, value }: Props) => (
  <Flex display="inline" gap="tiny" hAlign="left">
    {help && <Help tooltip={help} />}
    {label && (
      <span className={labelStyle()}>
        {label}
        {value !== undefined ? ":" : ""}
      </span>
    )}
    {value !== undefined && <span className={valueStyle()}>{value}</span>}
  </Flex>
);

export default Stat;
