import { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  children: ReactNode;
}

const gridStyle = css({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: "30px",
  margin: "40px 0",
  "@media (max-width: 800px)": {
    gridTemplateColumns: "1fr 1fr",
  },
  "@media (max-width: 500px)": {
    gridTemplateColumns: "1fr",
  },
});

const Grid = ({ children }: Props) => <div css={gridStyle}>{children}</div>;

export default Grid;
