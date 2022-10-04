import { ReactNode } from "react";
import { css } from "@emotion/react";

interface Props {
  children: ReactNode;
}

const gridStyle = css({
  display: "grid",
  gap: "30px",
  margin: "40px 0",
});

const Grid = ({ children }: Props) => {
  const items = Array.isArray(children) ? children.length : 3;
  const cols = [
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
  ].slice(0, items);

  return <div css={[gridStyle, ...cols]}>{children}</div>;
};

export default Grid;
