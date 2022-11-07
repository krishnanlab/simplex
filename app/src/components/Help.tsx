import Icon from "@/components/Icon";
import Tooltip from "@/components/Tooltip";
import { css } from "@emotion/react";

interface Props {
  tooltip: string;
}

const style = css({
  padding: "0",
  background: "none",
  border: "none",
});

const Help = ({ tooltip }: Props) => (
  <Tooltip
    reference={
      <button css={style} aria-label="Help">
        <Icon icon="question-circle" />
      </button>
    }
    content={tooltip}
  />
);

export default Help;
