import { CSSProperties, ReactNode } from "react";
import { css } from "@stitches/react";

type Props = {
  /** max number of columns */
  cols?: number;
  children: ReactNode;
};

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "repeat(min(var(--cols), var(--max)), 1fr)",
  gap: "30px",
  margin: "40px 0",
  "& > *": {
    margin: "0 !important",
  },
  "@media (min-width: 0)": {
    "--cols": "1",
  },
  "@media (min-width: 600px)": {
    "--cols": "2",
  },
  "@media (min-width: 900px)": {
    "--cols": "3",
  },
});

/** util grid wrapper */
const Grid = ({ cols = 3, children }: Props) => (
  <div className={gridStyle()} style={{ "--max": cols } as CSSProperties}>
    {children}
  </div>
);

export default Grid;
