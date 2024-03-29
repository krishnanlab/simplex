import { ReactNode } from "react";
import { css } from "@stitches/react";
import Flex from "@/components/Flex";
import Help from "@/components/Help";
import { dark, deep } from "@/global/palette";

type Props = {
  /** question mark text on hover */
  help?: ReactNode;
  /** left text (key) */
  label?: string;
  /** right text (value) */
  value?: string | number | ReactNode;
  /** html title attr */
  title?: string;
};

const labelStyle = css({ color: dark, lineHeight: 1 });
const valueStyle = css({ color: deep, lineHeight: 1 });

/** simple left/right key/value text with help text */
const Stat = ({ help, label, value, title }: Props) => (
  <Flex display="inline" gap="tiny" hAlign="left" title={title}>
    {label && (
      <span className={labelStyle()}>
        {label}
        {value !== undefined ? ":" : ""}
      </span>
    )}
    {value !== undefined && <span className={valueStyle()}>{value}</span>}
    {help && <Help tooltip={help} />}
  </Flex>
);

export default Stat;
