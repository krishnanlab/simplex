import { css } from "@emotion/react";
import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";

interface Props {
  tooltip: string;
}

const helpStyle = css({
  padding: "0",
  background: "none",
  border: "none",
});

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
