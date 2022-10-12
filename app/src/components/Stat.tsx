import { css } from "@emotion/react";
import Flex from "@/components/Flex";
import Icon from "@/components/Icon";
import { dark, deep } from "@/palette";

interface Props {
  tooltip?: string;
  label?: string;
  value?: string | number;
}

const labelStyle = css({ color: dark, lineHeight: 1 });
const valueStyle = css({ color: deep, lineHeight: 1 });

const Stat = ({ tooltip, label, value }: Props) => (
  <Flex display="inline" gap="tiny">
    {tooltip && <Icon icon="question-circle" title={tooltip} />}
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
