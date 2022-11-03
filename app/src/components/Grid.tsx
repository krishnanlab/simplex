import { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  cols?: number;
  children: ReactNode;
}

const gridStyle = css({
  display: "grid",
  gap: "30px",
  margin: "40px 0",
  "& > *": {
    margin: "0 !important",
  },
});

const Grid = ({ cols = 3, children }: Props) => {
  // const items = Array.isArray(children) ? children.length : 3;
  const breakpoints = [
    {
      "@media (min-width: 0)": {
        gridTemplateColumns: "1fr",
      },
    },
    {
      "@media (min-width: 600px)": {
        gridTemplateColumns: "1fr 1fr",
      },
    },
    {
      "@media (min-width: 900px)": {
        gridTemplateColumns: "1fr 1fr 1fr",
      },
    },
  ].slice(0, cols);

  return <div css={[gridStyle, ...breakpoints]}>{children}</div>;
};

export default Grid;
