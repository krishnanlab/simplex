import { createPortal } from "react-dom";
import { css, SerializedStyles, keyframes } from "@emotion/react";
import { dark, pale } from "@/palette";

interface Props {
  css?: SerializedStyles;
  className?: string;
}

const spin = keyframes({
  from: {
    strokeDashoffset: "62.83",
  },
  to: {
    strokeDashoffset: "0",
  },
});

const spinnerStyle = css({
  position: "fixed",
  bottom: "15px",
  right: "15px",
  height: "30px",
  "& > path": {
    strokeDasharray: "47.12 15.71",
    animation: spin + " 1s linear infinite",
  },
});

const Spinner = ({ className }: Props) =>
  createPortal(
    <svg css={spinnerStyle} className={className} viewBox="-12 -12 24 24">
      <path
        fill="none"
        stroke={pale}
        strokeWidth="4"
        d="M -10 0 A 10 10 0 0 1 10 0 A 10 10 0 0 1 -10 0"
      />
      <path
        fill="none"
        stroke={dark}
        strokeWidth="3"
        d="M -10 0 A 10 10 0 0 1 10 0 A 4 4 0 0 1 -10 0"
      />
    </svg>,
    document.body
  );

export default Spinner;
