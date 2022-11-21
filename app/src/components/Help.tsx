import { css } from "@emotion/react";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";

interface Props {
  /** text on hover */
  tooltip: string;
}

const helpStyle = css({
  padding: "0",
  background: "none",
  border: "none",
});

/** question mark with text on hover */
const Help = ({ tooltip }: Props) => (
  <Tooltip
    reference={
      <button css={helpStyle} aria-label="Help">
        <Icon icon="question-circle" />
      </button>
    }
    content={tooltip}
  />
);

export default Help;
