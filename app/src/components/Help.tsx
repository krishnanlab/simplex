import { ReactNode } from "react";
import { FaRegQuestionCircle } from "react-icons/fa";
import { css } from "@stitches/react";
import Tooltip from "@/components/Tooltip";

type Props = {
  /** text on hover */
  tooltip: ReactNode;
};

const helpStyle = css({
  padding: "0",
  background: "none",
  border: "none",
});

/** question mark with text on hover */
const Help = ({ tooltip }: Props) => (
  <Tooltip
    reference={
      <button className={helpStyle()} aria-label="Help">
        <FaRegQuestionCircle />
      </button>
    }
    content={tooltip}
  />
);

export default Help;
