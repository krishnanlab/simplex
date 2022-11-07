import { ReactNode } from "react";
import { css } from "@emotion/react";
import Flex from "@/components/Flex";
import Help from "@/components/Help";
import { dark, deep } from "@/global/palette";

interface Props {
  help?: string;
  label?: string;
  value?: string | number | ReactNode;
}

const labelStyle = css({ color: dark, lineHeight: 1 });
const valueStyle = css({ color: deep, lineHeight: 1 });

const Stat = ({ help, label, value }: Props) => (
  <Flex display="inline" gap="tiny" hAlign="left">
    {help && <Help tooltip={help} />}
    {label && (
      <span css={labelStyle}>
        {label}
        {value !== undefined ? ":" : ""}
      </span>
    )}
    {value !== undefined && <span css={valueStyle}>{value}</span>}
  </Flex>
);

export default Stat;
