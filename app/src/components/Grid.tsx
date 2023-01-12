import { ReactNode } from "react";
import { css } from "@stitches/react";
import { classNames } from "@/util/string";

type Props = {
  /** max number of columns */
  cols?: number;
  children: ReactNode;
};

const gridStyle = css({
  display: "grid",
  gap: "30px",
  margin: "40px 0",
  "& > *": {
    margin: "0 !important",
  },
});

const breakpointStyles = [
  css({
    "@media (min-width: 0)": {
      gridTemplateColumns: "1fr",
    },
  }),
  css({
    "@media (min-width: 600px)": {
      gridTemplateColumns: "1fr 1fr",
    },
  }),
  css({
    "@media (min-width: 900px)": {
      gridTemplateColumns: "1fr 1fr 1fr",
    },
  }),
];

/** util grid wrapper */
const Grid = ({ cols = 3, children }: Props) => {
  // const items = Array.isArray(children) ? children.length : 3;
  const breakpoints = breakpointStyles.map((style) => style()).slice(0, cols);

  return (
    <div className={classNames([gridStyle(), ...breakpoints])}>{children}</div>
  );
};

export default Grid;
