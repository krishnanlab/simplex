import { css, SerializedStyles, keyframes } from "@emotion/react";
import { dark } from "@/palette";

interface Props {
  css?: SerializedStyles;
  className?: string;
}

const spin = keyframes({
  from: {
    strokeDashoffset: "25.13",
  },
  to: {
    strokeDashoffset: "0",
  },
});

const spinnerStyle = css({
  height: "1.2em",
  "& > path": {
    strokeDasharray: "18.85 6.28",
    animation: spin + " 1s linear infinite",
  },
});

const Spinner = ({ className }: Props) => (
  <svg css={spinnerStyle} className={className} viewBox="-5 -5 10 10">
    <path
      fill="none"
      stroke={dark}
      strokeWidth="1"
      d="M -4 0 A 4 4 0 0 1 4 0 A 4 4 0 0 1 -4 0"
    />
  </svg>
);

export default Spinner;
