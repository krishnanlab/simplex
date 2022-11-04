import { css, keyframes } from "@emotion/react";

const radius = 10;
const thickness = 3;

const size = radius * 2 + thickness;
const circumference = 2 * Math.PI * radius;

const viewBox = [-size / 2, -size / 2, size, size].join(" ");
const d = `M -${radius} 0 A ${radius} ${radius} 0 0 1 ${radius} 0 A 4 4 0 0 1 -${radius} 0`;

const spin = keyframes({
  from: {
    strokeDashoffset: circumference,
  },
  to: {
    strokeDashoffset: "0",
  },
});

const style = css({
  "& > path": {
    strokeDasharray: circumference * 0.75 + " " + circumference * 0.25,
    animation: spin + " 1s linear infinite",
  },
});

const Spinner = () => (
  <svg css={style} viewBox={viewBox}>
    <path fill="none" stroke="currentColor" strokeWidth={thickness} d={d} />
  </svg>
);

export default Spinner;
